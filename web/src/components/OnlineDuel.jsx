import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, profile, saveDuelResult, setLangElo, languages } from '../data'
import { getDuelClient } from '../online/duelClient.js'
import LivingOtter from './LivingOtter'
import { OtterMascot } from './ArenaIcons'
import { haptic } from '../nativeBridge.js'

const QUEUE_HEARTBEAT_MS = 4000
const MATCH_HEARTBEAT_MS = 3000
const OFFER_BOT_AFTER_S = 25
const GRACE_MS = 1500

/**
 * Live 1v1 duel against a real player (see firebase/functions/src/duel.js).
 * The server owns answers, time and scoring; this screen only renders the
 * public match and asks the server to move on when its clock says so.
 *   lang        — duel language
 *   onExit()    — back to the League dashboard
 *   onPractice()— nobody online: play a practice bot instead
 */
export default function OnlineDuel({ lang, onExit, onPractice }) {
    const [client, setClient] = useState(null)
    const [uid, setUid] = useState(null)
    const [error, setError] = useState(null)
    const [matchId, setMatchId] = useState(null)
    const [match, setMatch] = useState(null)
    const [waited, setWaited] = useState(0)
    const [now, setNow] = useState(Date.now())
    const [picked, setPicked] = useState({})        // round -> my choice (optimistic)
    const recorded = useRef(false)
    const leaving = useRef(false)
    const tickBusy = useRef(false)
    const matchIdRef = useRef(null)

    // Connect + sign in (anonymous)
    useEffect(() => {
        let alive = true
        getDuelClient().then(async c => {
            const { uid } = await c.connect()
            if (!alive) return
            setClient(c); setUid(uid)
        }).catch(e => alive && setError(e?.message || 'connect failed'))
        return () => { alive = false }
    }, [])

    // Know which match I am in
    useEffect(() => {
        if (!client || !uid) return
        return client.watchUser(uid, u => { if (u.currentMatch) setMatchId(u.currentMatch) })
    }, [client, uid])

    // Queue with heartbeat until matched
    useEffect(() => {
        if (!client || !uid || matchId) return
        let alive = true
        const started = Date.now()
        const join = () => client.joinQueue({ lang, name: profile.name || '' })
            .then(r => { if (alive && r?.matchId) setMatchId(r.matchId) })
            .catch(e => alive && setError(e?.message || 'queue failed'))
        join()
        const hb = setInterval(join, QUEUE_HEARTBEAT_MS)
        const clock = setInterval(() => setWaited(Math.floor((Date.now() - started) / 1000)), 500)
        return () => { alive = false; clearInterval(hb); clearInterval(clock); if (!matchIdRef.current) client.leaveQueue({ lang }).catch(() => {}) }
    }, [client, uid, matchId, lang])
    useEffect(() => { matchIdRef.current = matchId }, [matchId])

    // Follow the match, announce presence
    useEffect(() => {
        if (!client || !uid || !matchId) return
        client.goOnline(matchId, uid).catch(() => {})
        const off = client.watchMatch(matchId, m => m && setMatch(m))
        return () => { off(); client.goOffline(matchId, uid).catch(() => {}) }
    }, [client, uid, matchId])

    // Server-aligned clock
    useEffect(() => {
        if (!client) return
        const id = setInterval(() => setNow(client.serverNow()), 200)
        return () => clearInterval(id)
    }, [client])

    // Ask the server to move on when a phase is due, plus a heartbeat
    const tick = useCallback(() => {
        if (!client || !matchId || tickBusy.current) return
        tickBusy.current = true
        client.tick({ matchId }).catch(() => {}).finally(() => { tickBusy.current = false })
    }, [client, matchId])
    useEffect(() => {
        if (!match || match.state === 'done') return
        const id = setInterval(tick, MATCH_HEARTBEAT_MS)
        return () => clearInterval(id)
    }, [match?.state, tick])
    useEffect(() => {
        if (!match) return
        if (match.state === 'round' && now > match.roundDeadline + GRACE_MS + 100) tick()
        if (match.state === 'reveal' && match.revealUntil && now > match.revealUntil + 100) tick()
    }, [now, match, tick])

    // Record the finished match locally (XP, history) and align the rating
    useEffect(() => {
        if (!match || match.state !== 'done' || recorded.current || !uid) return
        recorded.current = true
        const opp = Object.entries(match.players).find(([u]) => u !== uid)?.[1] || { name: '?', elo: 1000 }
        const mine = match.players[uid]
        const theirUid = Object.keys(match.players).find(u => u !== uid)
        saveDuelResult({
            won: match.winner === uid, yourScore: match.score?.[uid] ?? 0, theirScore: match.score?.[theirUid] ?? 0,
            opponent: { name: opp.name, elo: opp.elo, _duelLang: match.lang, otterColor: '#6366f1' }, mode: 'online',
        })
        setLangElo(match.lang, Math.max(0, mine.elo + (match.eloDelta?.[uid] ?? 0)))   // server rating is the truth
        haptic(match.winner === uid ? 'success' : 'warning')
        if (leaving.current) onExit()
    }, [match, uid, onExit])

    const answer = i => {
        if (!match || match.state !== 'round' || picked[match.round] != null || now < match.roundStartsAt) return
        setPicked(p => ({ ...p, [match.round]: i }))
        haptic('selection')
        client.answer({ matchId, round: match.round, choice: i }).catch(() => {})
    }
    // Leaving a running duel resigns it. Wait for the server's verdict so the
    // loss is recorded locally too (history, rating), then close; give up
    // waiting after a few seconds rather than trap the player.
    const leave = async () => {
        if (!matchId || !match || match.state === 'done') return onExit()
        leaving.current = true
        try { await client.resign({ matchId }) } catch (e) { /* ignore */ }
        setTimeout(() => { if (leaving.current && !recorded.current) onExit() }, 4000)
    }

    const langName = languages.find(l => l.id === lang)?.name || lang

    /* ── screens ── */
    if (error) return <Shell onClose={onExit}>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6">
            <LivingOtter mood="sad" size={96} />
            <p className="text-white font-black text-lg">{t('Could not reach the duel server.')}</p>
            <p className="text-slate-400 text-sm">{t('Check your connection, or play a practice bot.')}</p>
            <button onClick={onPractice} className="min-h-12 px-6 rounded-2xl font-black" style={{ background: '#2DD4BF', color: '#04231F' }}>{t('Play a practice bot')}</button>
        </div>
    </Shell>

    if (!match) return <Shell onClose={onExit}>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}><LivingOtter mood="thinking" size={104} /></motion.div>
            <p className="text-white font-black text-xl" role="status" aria-live="polite">{matchId ? t('Opponent found!') : t('Looking for a live opponent…')}</p>
            <p className="text-slate-400 text-sm font-bold">{langName} · {waited}s</p>
            {waited >= OFFER_BOT_AFTER_S && !matchId && <div className="mt-4 space-y-2 w-full max-w-xs">
                <p className="text-slate-300 text-sm">{t('Not many players online right now.')}</p>
                <button onClick={onPractice} className="w-full min-h-12 rounded-2xl font-black" style={{ background: '#2DD4BF', color: '#04231F' }}>{t('Play a practice bot')}</button>
                <p className="text-slate-400 text-[12px]">{t('or keep waiting — we will match you as soon as someone joins.')}</p>
            </div>}
        </div>
    </Shell>

    const theirUid = Object.keys(match.players).find(u => u !== uid)
    const me = match.players[uid], them = match.players[theirUid]
    const r = match.round
    const q = match.questions?.[r]
    const res = match.results?.[r]
    const myPick = picked[r] ?? res?.picks?.[uid]?.choice
    const theyLocked = !!match.answered?.[r]?.[theirUid]
    const counting = match.state === 'round' && now < match.roundStartsAt
    const left = Math.max(0, match.roundDeadline - Math.max(now, match.roundStartsAt))
    const total = match.roundDeadline - match.roundStartsAt

    if (match.state === 'done') {
        const won = match.winner === uid, draw = match.winner === 'draw'
        const delta = match.eloDelta?.[uid] ?? 0
        return <Shell onClose={onExit}>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
                <LivingOtter mood={won ? 'celebrate' : draw ? 'happy' : 'encouraging'} size={120} />
                <h1 className="text-3xl font-black text-white">{won ? t('You won!') : draw ? t('Draw') : t('You lost')}</h1>
                <p className="text-slate-300 font-bold">{match.score[uid]} – {match.score[theirUid]} · {them.name}</p>
                {match.endReason === 'forfeit' && <p className="text-slate-400 text-sm">{won ? t('Your opponent left the duel.') : t('You were away too long.')}</p>}
                {match.endReason === 'resign' && <p className="text-slate-400 text-sm">{won ? t('Your opponent resigned.') : t('You left the duel.')}</p>}
                <p className={`text-xl font-black ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{delta >= 0 ? '+' : ''}{delta} ELO</p>
                <div className="w-full max-w-xs space-y-2 mt-3">
                    <button onClick={() => { recorded.current = false; setMatch(null); setMatchId(null); setPicked({}) }} className="w-full min-h-12 rounded-2xl font-black" style={{ background: '#2DD4BF', color: '#04231F' }}>{t('Play again')}</button>
                    <button onClick={onExit} className="w-full min-h-11 rounded-2xl font-bold text-slate-300">{t('Back to League')}</button>
                </div>
            </div>
        </Shell>
    }

    return <Shell onClose={leave} closeLabel={t('Leave duel')}>
        {/* Players */}
        <div className="flex items-center gap-3 px-4 pt-2">
            <OtterMascot size={44} />
            <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">{t('You')}</p>
                <p className="text-slate-400 text-[11px] font-bold">{me.elo} ELO</p>
            </div>
            <div className="text-2xl font-black text-white tabular-nums" aria-label={t('Score')}>{match.score[uid]} : {match.score[theirUid]}</div>
            <div className="flex-1 min-w-0 text-right">
                <p className="text-white font-black text-sm truncate">{them.name}</p>
                <p className={`text-[11px] font-bold ${theyLocked ? 'text-teal-300' : 'text-slate-400'}`}>{theyLocked ? `✓ ${t('locked in')}` : `${them.elo} ELO`}</p>
            </div>
            <OtterMascot size={44} bodyColor="#6366f1" name={them.name} />
        </div>

        {/* Round + timer */}
        <div className="px-4 mt-4">
            <div className="flex justify-between text-[11px] font-black text-slate-400 mb-1.5">
                <span>{t('ROUND')} {r + 1} / {match.roundCount}</span>
                <span className="tabular-nums">{counting ? '' : `${Math.ceil(left / 1000)}s`}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#162033' }}>
                <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${counting ? 100 : (left / total) * 100}%`, background: left < 5000 && !counting ? '#F87171' : '#2DD4BF' }} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8">
            <AnimatePresence mode="wait">
                {counting ? <motion.div key={`c${r}`} initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="h-64 flex items-center justify-center">
                    <span className="text-7xl font-black text-white tabular-nums">{Math.max(1, Math.ceil((match.roundStartsAt - now) / 1000))}</span>
                </motion.div> : q && <motion.div key={`q${r}`} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="space-y-4">
                    <h2 className="text-lg font-extrabold text-white leading-snug">{q.text}</h2>
                    {q.code && <pre className="font-mono text-[13px] leading-6 rounded-2xl p-4 whitespace-pre-wrap break-words text-slate-100 border" style={{ background: '#162033', borderColor: '#334155' }}>{q.code.replace(/\\n/g, '\n')}</pre>}
                    <div className="grid gap-3">
                        {q.options.map((o, i) => {
                            const revealed = match.state === 'reveal' && res
                            const isRight = revealed && res.correct === i
                            const isMineWrong = revealed && myPick === i && res.correct !== i
                            const theirs = revealed && res.picks?.[theirUid]?.choice === i
                            const border = isRight ? '#34D399' : isMineWrong ? '#F87171' : myPick === i ? '#2DD4BF' : '#334155'
                            return <button key={i} onClick={() => answer(i)} disabled={myPick != null || match.state !== 'round'}
                                className="min-h-14 rounded-2xl px-4 py-3 border-2 text-left font-mono font-bold text-white flex items-center gap-3"
                                style={{ background: isRight ? 'rgba(52,211,153,0.12)' : '#1E293B', borderColor: border }}>
                                <span className="flex-1">{o}</span>
                                {theirs && <span className="text-[11px] font-black text-indigo-300 font-sans">{them.name.split(' ')[0]}</span>}
                                {isRight && <span aria-hidden="true">✓</span>}
                            </button>
                        })}
                    </div>
                    {match.state === 'round' && myPick != null && <p className="text-center text-slate-400 text-sm font-bold" role="status">{theyLocked ? t('Both locked in…') : t('Locked in. Waiting for your opponent…')}</p>}
                    {match.state === 'reveal' && res && <p className={`text-center font-black ${res.picks?.[uid]?.ok ? 'text-emerald-400' : 'text-red-400'}`} role="status">
                        {res.picks?.[uid]?.ok ? t('Correct!') : myPick == null ? t('Time is up') : t('Not this time')}
                    </p>}
                </motion.div>}
            </AnimatePresence>
        </div>
    </Shell>
}

function Shell({ children, onClose, closeLabel }) {
    return <div className="fixed inset-0 z-[260] flex flex-col" style={{ background: '#0F172A', paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-3 py-2">
            <button onClick={onClose} aria-label={closeLabel || t('Close')} className="w-11 h-11 text-slate-400 text-xl">✕</button>
            <span className="text-[11px] font-black tracking-wider text-teal-300">● {t('LIVE DUEL')}</span>
            <span className="w-11" />
        </div>
        {children}
    </div>
}
