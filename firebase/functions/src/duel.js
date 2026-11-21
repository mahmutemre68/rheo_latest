/* ══════════════════════════════════════════════════════════════════
   Rheo live duels — server logic

   Everything authoritative happens here; clients only ask.
   - The correct answers never leave the server. A match lives twice:
       /matchesPrivate/{id}  full state incl. answers and picks (no client access)
       /matches/{id}         public projection the two players read
     Every change is a transaction on the private node, then the projection is
     written only if its version is newer, so a late write can never roll the
     public view back.
   - Time is the server's. A round accepts answers until its deadline (+ a
     small grace for network latency); anything later is a timeout.
   - Nothing runs on a timer server-side. Clients call `tick` when their local
     clock says a phase is over (and every few seconds as a heartbeat); the
     server re-checks the time and advances only if it really is due. Either
     player's tick is enough, so one stalled client cannot freeze a match.
   - A player whose presence goes offline for FORFEIT_AFTER_MS loses.

   All database access goes through `db` (see makeAdminDb / test/memoryDb.js)
   so the whole flow is testable without the Firebase emulator.
   ══════════════════════════════════════════════════════════════════ */

export const LANGS = ['python', 'javascript', 'java']
export const ROUNDS = 3
export const ROUND_MS = 20_000
export const COUNTDOWN_MS = 3_000
export const REVEAL_MS = 2_500
export const GRACE_MS = 1_500
export const FORFEIT_AFTER_MS = 8_000
export const QUEUE_STALE_MS = 15_000
export const START_ELO = 1000
const K = 32

export class DuelError extends Error {
    constructor(code, message) { super(message); this.code = code }
}

/* ── pure helpers ─────────────────────────────────────────────────── */

export function expectedScore(a, b) { return 1 / (1 + 10 ** ((b - a) / 400)) }

/** Same K and formula as the app (core.js calculateElo); result 1 / 0.5 / 0. */
export function eloDelta(mine, theirs, result) { return Math.round(K * (result - expectedScore(mine, theirs))) }

/** ELO gap a waiting player accepts; widens the longer they wait. */
export function acceptableGap(waitedMs) { return Math.min(600, 100 + 25 * Math.floor(waitedMs / 1000)) }

export function sanitizeName(name, uid) {
    const clean = String(name ?? '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 20)
    return clean || `Player-${String(uid).slice(0, 4)}`
}

/** Pick the queued opponent for `me`, or null. Pure. */
export function findOpponent(queue, me, now) {
    let best = null
    for (const [uid, entry] of Object.entries(queue || {})) {
        if (uid === me.uid || !entry) continue
        if (now - (entry.seenAt ?? entry.joinedAt) > QUEUE_STALE_MS) continue
        const gap = Math.abs(entry.elo - me.elo)
        const allowed = Math.max(acceptableGap(now - entry.joinedAt), acceptableGap(now - (me.joinedAt ?? now)))
        if (gap > allowed) continue
        if (!best || entry.joinedAt < best.entry.joinedAt) best = { uid, entry }
    }
    return best
}

/** Questions for a match, weighted by the players' average ELO (as the app does). */
export function pickQuestions(pool, avgElo, count = ROUNDS, rand = Math.random) {
    const weights = avgElo < 1200 ? [0.65, 0.30, 0.05] : avgElo < 1600 ? [0.15, 0.55, 0.30] : [0.05, 0.30, 0.65]
    const byDiff = { 1: [], 2: [], 3: [] }
    for (const q of pool) if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q)
    for (const list of Object.values(byDiff)) list.sort(() => rand() - 0.5)
    const out = []
    while (out.length < count) {
        const r = rand()
        let d = r < weights[0] ? 1 : r < weights[0] + weights[1] ? 2 : 3
        if (!byDiff[d].length) d = [2, 1, 3].find(x => byDiff[x].length)
        if (!d) break
        out.push(byDiff[d].pop())
    }
    return out
}

/** What the players may see. Answers appear only for rounds already closed. */
export function publicView(m) {
    return {
        version: m.version, lang: m.lang, state: m.state,
        players: m.players, round: m.round, roundCount: m.roundCount,
        roundStartsAt: m.roundStartsAt, roundDeadline: m.roundDeadline, revealUntil: m.revealUntil ?? null,
        questions: m.questions.map(({ text, options, type, difficulty }) => ({ text, options, type, difficulty })),
        answered: Object.fromEntries(Object.entries(m.picks || {}).map(([r, byUid]) => [r, Object.fromEntries(Object.keys(byUid).map(u => [u, true]))])),
        results: m.results || {},
        score: m.score, winner: m.winner ?? null, endReason: m.endReason ?? null, eloDelta: m.eloDelta ?? null,
    }
}

function closeRound(m, now) {
    const r = m.round
    const picks = m.picks?.[r] || {}
    const correct = m.answers[r]
    const res = { correct, picks: {} }
    for (const uid of Object.keys(m.players)) {
        const p = picks[uid]
        const ok = !!p && p.choice === correct
        res.picks[uid] = { choice: p ? p.choice : null, ok, ms: p ? p.ms : null }
        if (ok) { m.score[uid] += 1; m.correctMs[uid] += p.ms }
    }
    m.results = { ...(m.results || {}), [r]: res }
    m.state = 'reveal'
    m.revealUntil = now + REVEAL_MS
}

function finish(m, now, reason, forfeitLoser = null) {
    const [a, b] = Object.keys(m.players)
    let result // from a's point of view
    if (forfeitLoser) result = forfeitLoser === a ? 0 : 1
    else if (m.score[a] !== m.score[b]) result = m.score[a] > m.score[b] ? 1 : 0
    else if (m.score[a] > 0 && m.correctMs[a] !== m.correctMs[b]) result = m.correctMs[a] < m.correctMs[b] ? 1 : 0 // faster correct answers break ties
    else result = 0.5
    const ea = m.players[a].elo, eb = m.players[b].elo
    m.eloDelta = { [a]: eloDelta(ea, eb, result), [b]: eloDelta(eb, ea, 1 - result) }
    m.winner = result === 0.5 ? 'draw' : result === 1 ? a : b
    m.state = 'done'
    m.endReason = reason
    m.endedAt = now
}

/** Advance a match as far as the clock allows. Pure; mutates and returns m. */
export function advance(m, now) {
    if (m.state === 'done') return m
    // Forfeit: someone has been offline too long (presence is written by clients).
    for (const uid of Object.keys(m.players)) {
        const pr = m.presence?.[uid]
        const since = pr?.online === false ? pr.at : (pr ? null : m.createdAt)
        if (since != null && now - since > FORFEIT_AFTER_MS) {
            finish(m, now, 'forfeit', uid)
            return m
        }
    }
    for (let guard = 0; guard < 10; guard++) {
        if (m.state === 'round') {
            const everyone = Object.keys(m.players).every(u => m.picks?.[m.round]?.[u])
            if (everyone || now > m.roundDeadline + GRACE_MS) closeRound(m, now)
            else break
        } else if (m.state === 'reveal') {
            if (now < m.revealUntil) break
            if (m.round + 1 >= m.roundCount) { finish(m, now, 'completed'); break }
            m.round += 1
            m.state = 'round'
            m.roundStartsAt = now
            m.roundDeadline = now + ROUND_MS
            m.revealUntil = null
        } else break
    }
    return m
}

/* ── handlers (db-backed) ─────────────────────────────────────────── */

async function userElo(db, uid, lang) {
    return (await db.get(`users/${uid}/elo/${lang}`)) ?? START_ELO
}

async function publish(db, id, m) {
    // Keep the presence the clients write under the public node.
    await db.transaction(`matches/${id}`, cur => (cur && cur.version >= m.version ? undefined : { ...publicView(m), presence: cur?.presence ?? null }))
}

/** Join the queue for a language; pairs immediately when a fair opponent waits. */
export async function joinQueue(db, uid, { lang, name } = {}, { pool, rand = Math.random } = {}) {
    if (!LANGS.includes(lang)) throw new DuelError('invalid-argument', 'unknown language')
    const current = await db.get(`users/${uid}/currentMatch`)
    if (current) {
        const st = await db.get(`matches/${current}/state`)
        if (st && st !== 'done') return { status: 'matched', matchId: current }
        await db.set(`users/${uid}/currentMatch`, null)
    }
    const now = db.now()
    const elo = await userElo(db, uid, lang)
    const displayName = sanitizeName(name, uid)
    let paired = null
    await db.transaction(`queue/${lang}`, q => {
        const queue = q || {}
        paired = null
        const mine = queue[uid] || { elo, name: displayName, joinedAt: now }
        const opp = findOpponent(queue, { uid, elo, joinedAt: mine.joinedAt }, now)
        if (opp) {
            paired = opp
            const next = { ...queue }
            delete next[uid]; delete next[opp.uid]
            return next
        }
        return { ...queue, [uid]: { ...mine, elo, name: displayName, seenAt: now } }
    })
    if (!paired) return { status: 'queued' }

    const id = db.newId('matches')
    const oppElo = paired.entry.elo
    const qs = pickQuestions(pool[lang], (elo + oppElo) / 2, ROUNDS, rand)
    const m = {
        version: 1, lang, state: 'round', createdAt: now,
        players: { [paired.uid]: { name: paired.entry.name, elo: oppElo }, [uid]: { name: displayName, elo } },
        round: 0, roundCount: qs.length,
        roundStartsAt: now + COUNTDOWN_MS, roundDeadline: now + COUNTDOWN_MS + ROUND_MS, revealUntil: null,
        questions: qs, answers: qs.map(q => q.correct), picks: {}, results: {},
        score: { [paired.uid]: 0, [uid]: 0 }, correctMs: { [paired.uid]: 0, [uid]: 0 },
        presence: {},
    }
    await db.set(`matchesPrivate/${id}`, m)
    await publish(db, id, m)
    await db.update('', { [`users/${uid}/currentMatch`]: id, [`users/${paired.uid}/currentMatch`]: id })
    return { status: 'matched', matchId: id }
}

export async function leaveQueue(db, uid, { lang } = {}) {
    if (!LANGS.includes(lang)) throw new DuelError('invalid-argument', 'unknown language')
    await db.transaction(`queue/${lang}`, q => {
        if (!q || !q[uid]) return q
        const next = { ...q }; delete next[uid]; return next
    })
    return { status: 'left' }
}

/** Apply a change to a match atomically, advancing it by the clock first. */
async function mutateMatch(db, uid, matchId, change) {
    let outcome = null, failure = null, snapshot = null
    const now = db.now()
    // Presence is written by clients on the public node; fold it in.
    const presence = (await db.get(`matches/${matchId}/presence`)) || {}
    await db.transaction(`matchesPrivate/${matchId}`, m => {
        failure = null; outcome = null
        if (!m) { failure = new DuelError('not-found', 'no such match'); return m }
        if (!m.players[uid]) { failure = new DuelError('permission-denied', 'not your match'); return undefined }
        const next = structuredClone(m)
        next.presence = presence
        advance(next, now)
        try { outcome = change ? change(next, now) : null } catch (e) { failure = e; return undefined }
        advance(next, now)
        next.version = m.version + 1
        snapshot = next
        return next
    })
    if (failure) throw failure
    if (snapshot) {
        await publish(db, matchId, snapshot)
        if (snapshot.state === 'done') await settle(db, matchId, snapshot)
    }
    return { outcome, state: snapshot?.state }
}

export async function submitAnswer(db, uid, { matchId, round, choice } = {}) {
    if (typeof matchId !== 'string' || !Number.isInteger(round) || !Number.isInteger(choice)) throw new DuelError('invalid-argument', 'matchId, round and choice are required')
    const { outcome } = await mutateMatch(db, uid, matchId, (m, now) => {
        if (m.state !== 'round' || m.round !== round) return { accepted: false, reason: 'round-closed' }
        if (now < m.roundStartsAt) return { accepted: false, reason: 'too-early' }
        if (m.picks?.[round]?.[uid]) return { accepted: false, reason: 'already-answered' }
        if (choice < 0 || choice >= m.questions[round].options.length) throw new DuelError('invalid-argument', 'choice out of range')
        m.picks = { ...(m.picks || {}), [round]: { ...(m.picks?.[round] || {}), [uid]: { choice, ms: now - m.roundStartsAt } } }
        return { accepted: true }
    })
    return outcome
}

export async function tick(db, uid, { matchId } = {}) {
    if (typeof matchId !== 'string') throw new DuelError('invalid-argument', 'matchId is required')
    const { state } = await mutateMatch(db, uid, matchId, null)
    return { state }
}

/** Leave a running match on purpose: it counts as a forfeit. */
export async function resign(db, uid, { matchId } = {}) {
    const { state } = await mutateMatch(db, uid, matchId, (m, now) => {
        if (m.state !== 'done') finish(m, now, 'resign', uid)
    })
    return { state }
}

/** Write ratings and stats once per finished match. */
async function settle(db, matchId, m) {
    let first = false
    await db.transaction(`matchesPrivate/${matchId}/settled`, s => { first = !s; return true })
    if (!first) return
    const updates = {}
    for (const uid of Object.keys(m.players)) {
        const before = await userElo(db, uid, m.lang)
        updates[`users/${uid}/elo/${m.lang}`] = Math.max(0, before + m.eloDelta[uid])
        updates[`users/${uid}/currentMatch`] = null
        const stats = (await db.get(`users/${uid}/stats`)) || { wins: 0, losses: 0, draws: 0 }
        if (m.winner === 'draw') stats.draws += 1
        else if (m.winner === uid) stats.wins += 1
        else stats.losses += 1
        updates[`users/${uid}/stats`] = stats
        updates[`users/${uid}/history/${matchId}`] = { at: m.endedAt, lang: m.lang, result: m.winner === 'draw' ? 'draw' : m.winner === uid ? 'win' : 'loss', delta: m.eloDelta[uid], opponent: Object.entries(m.players).find(([u]) => u !== uid)[1].name, score: `${m.score[uid]}-${Object.entries(m.score).find(([u]) => u !== uid)[1]}`, reason: m.endReason }
    }
    await db.update('', updates)
}

/* ── Firebase Admin adapter ───────────────────────────────────────── */

export function makeAdminDb(database, ServerValueNow = () => Date.now()) {
    const ref = p => (p ? database.ref(p) : database.ref())
    return {
        now: ServerValueNow,
        newId: p => ref(p).push().key,
        get: async p => (await ref(p).get()).val(),
        set: (p, v) => ref(p).set(v),
        update: (p, v) => ref(p).update(v),
        transaction: async (p, fn) => {
            const res = await ref(p).transaction(cur => {
                const out = fn(cur)
                return out
            })
            return { committed: res.committed, value: res.snapshot.val() }
        },
    }
}
