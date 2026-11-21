/* ══════════════════════════════════════════════════════════════════
   Live duel client

   One interface, two transports:
   - firebase: anonymous auth + Realtime Database + callable Functions
     (firebase/functions). Loaded lazily — the SDK is only fetched when a
     player actually looks for a live match.
   - mock: the real server logic (firebase/functions/src/duel.js) running in
     the page on an in-memory database, with a scripted opponent. For
     development and browser tests; enable with ?duelMock=1.

   Online play is available when the Firebase config is present at build time
   (VITE_FIREBASE_* in web/.env.local) or the mock is on. Otherwise the app
   keeps offering practice duels against bots, labelled as such.
   ══════════════════════════════════════════════════════════════════ */

const env = import.meta.env || {}
const FIREBASE = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    appId: env.VITE_FIREBASE_APP_ID,
}
const REGION = env.VITE_FIREBASE_FUNCTIONS_REGION || 'europe-west1'

export function isMockEnabled() {
    try {
        if (typeof window === 'undefined') return false
        if (new URLSearchParams(window.location.search).get('duelMock') === '1') return true
        return localStorage.getItem('rheo_duel_mock') === '1'
    } catch (e) { return false }
}
export function isFirebaseConfigured() { return !!(FIREBASE.apiKey && FIREBASE.projectId && FIREBASE.databaseURL && FIREBASE.appId) }
export function isOnlineAvailable() { return isFirebaseConfigured() || isMockEnabled() }

let _client = null
export async function getDuelClient() {
    if (_client) return _client
    _client = isFirebaseConfigured() && !isMockEnabled() ? await firebaseClient() : await mockClient()
    return _client
}

/* ── Firebase transport ───────────────────────────────────────────── */
async function firebaseClient() {
    const [{ initializeApp }, auth, rtdb, fns] = await Promise.all([
        import('firebase/app'), import('firebase/auth'), import('firebase/database'), import('firebase/functions'),
    ])
    const app = initializeApp(FIREBASE)
    const a = auth.getAuth(app)
    const db = rtdb.getDatabase(app)
    const functions = fns.getFunctions(app, REGION)
    const call = name => async data => (await fns.httpsCallable(functions, name)(data)).data
    let offset = 0
    rtdb.onValue(rtdb.ref(db, '.info/serverTimeOffset'), s => { offset = s.val() || 0 })

    return {
        kind: 'firebase',
        async connect() {
            const user = a.currentUser || (await auth.signInAnonymously(a)).user
            return { uid: user.uid }
        },
        serverNow: () => Date.now() + offset,
        joinQueue: call('duelJoinQueue'),
        leaveQueue: call('duelLeaveQueue'),
        answer: call('duelSubmitAnswer'),
        tick: call('duelTick'),
        resign: call('duelResign'),
        watchUser(uid, cb) { return rtdb.onValue(rtdb.ref(db, `users/${uid}`), s => cb(s.val() || {})) },
        watchMatch(id, cb) { return rtdb.onValue(rtdb.ref(db, `matches/${id}`), s => cb(s.val())) },
        async goOnline(matchId, uid) {
            const r = rtdb.ref(db, `matches/${matchId}/presence/${uid}`)
            await rtdb.onDisconnect(r).set({ online: false, at: rtdb.serverTimestamp() })
            await rtdb.set(r, { online: true, at: rtdb.serverTimestamp() })
        },
        async goOffline(matchId, uid) {
            const r = rtdb.ref(db, `matches/${matchId}/presence/${uid}`)
            try { await rtdb.set(r, { online: false, at: rtdb.serverTimestamp() }); await rtdb.onDisconnect(r).cancel() } catch (e) { /* match over */ }
        },
    }
}

/* ── Mock transport: real server logic, in the page ───────────────── */
async function mockClient() {
    const [D, { memoryDb }, pool] = await Promise.all([
        import('../../../firebase/functions/src/duel.js'),
        import('../../../firebase/functions/test/memoryDb.js'),
        import('../../../firebase/functions/src/questions.json', { with: { type: 'json' } }).then(m => m.default),
    ])
    const db = memoryDb({ nullFirst: false })
    db.now = () => Date.now()
    const me = 'mock-you', bot = 'mock-rival'
    const watchers = new Set()
    const notify = () => { for (const w of watchers) w() }
    setInterval(notify, 250)
    const wrap = fn => async data => { const out = await fn(db, me, data, { pool }); notify(); return out }

    // Scripted opponent: joins shortly after you, answers in 2–6 s, ~65% right.
    let botBusy = false
    const botDelay = {}
    async function runBot(lang) {
        if (botBusy) return
        botBusy = true
        await new Promise(r => setTimeout(r, 2500))
        const { matchId } = await D.joinQueue(db, bot, { lang, name: 'Rival (mock)' }, { pool })
        if (!matchId) { botBusy = false; return }
        await db.presence(matchId, bot, true)
        const loop = setInterval(async () => {
            const m = await db.get(`matchesPrivate/${matchId}`)
            if (!m || m.state === 'done') { clearInterval(loop); botBusy = false; return }
            await db.presence(matchId, bot, true)
            await D.tick(db, bot, { matchId }); notify()
            if (m.state === 'round' && !m.picks?.[m.round]?.[bot] && Date.now() > m.roundStartsAt + (botDelay[`${matchId}:${m.round}`] ??= 2000 + Math.random() * 4000)) {
                const right = m.answers[m.round]
                const choice = Math.random() < 0.65 ? right : (right + 1) % m.questions[m.round].options.length
                await D.submitAnswer(db, bot, { matchId, round: m.round, choice }); notify()
            }
        }, 400)
    }

    return {
        kind: 'mock',
        async connect() { return { uid: me } },
        serverNow: () => Date.now(),
        async joinQueue(data) { runBot(data.lang); return wrap(D.joinQueue)(data) },
        leaveQueue: wrap(D.leaveQueue),
        answer: wrap(D.submitAnswer),
        tick: wrap(D.tick),
        resign: wrap(D.resign),
        watchUser(uid, cb) { const w = async () => cb((await db.get(`users/${uid}`)) || {}); watchers.add(w); w(); return () => watchers.delete(w) },
        watchMatch(id, cb) { const w = async () => cb(await db.get(`matches/${id}`)); watchers.add(w); w(); return () => watchers.delete(w) },
        async goOnline(matchId, uid) { await db.presence(matchId, uid, true) },
        async goOffline(matchId, uid) { await db.presence(matchId, uid, false) },
    }
}
