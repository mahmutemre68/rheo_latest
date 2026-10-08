import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    duelStats, duelHistory, getDuelQuestions, getRandomOpponent, saveDuelResult,
    getLeagueTier, leagueTiers, getDuelLeaderboard, getActiveLanguage, setActiveLanguage,
    getLangElo, languages, t, getLocale,
    getArenaTitle, getMascotEvolution, getOwnedEmotes, allEmotes, buyEmote,
    getSeasonData, getBattlePass, getDailyChallenge,
    gameModes, getAIResponseTime, getAICorrectChance, stats,
    powerUps, achievementDefs, getUnlockedAchievements, checkAndUnlockAchievements,
} from '../data'
import HologramCard from './HologramCard'
import { showXP } from './XPToast'
import {
    ShieldIcon, SwordIcon, BoltIcon, TrophyIcon, FireIcon, MedalIcon,
    OtterMascot, VSBadge, DiceIcon, CalendarIcon, ChartIcon, StarIcon,
    GemSVG, XPStar, CrownSVG,
} from './ArenaIcons'

/* ═══ GLASS STYLE ═══ */
const G = { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }
const gc = 'rounded-2xl p-3'

/* ═══ SOUND ═══ */
const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
let _ac = null; const _snd = { v: (() => { try { return localStorage.getItem('rheo_setting_sound') !== 'false' } catch (e) { return true } })() }
function ctx() { if (!_ac && AC) _ac = new AC(); return _ac }
function tone(f, d, t = 'sine', v = 0.12) {
    if (!_snd.v) return; try { const c = ctx(); if (!c) return; const o = c.createOscillator(); const g = c.createGain(); o.type = t; o.frequency.setValueAtTime(f, c.currentTime); g.gain.setValueAtTime(v, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d) } catch (e) { }
}
const S = {
    ok: () => { tone(523, .1); setTimeout(() => tone(659, .1), 100); setTimeout(() => tone(784, .15), 200) },
    no: () => { tone(200, .2, 'sawtooth', .08); setTimeout(() => tone(150, .3, 'sawtooth', .06), 150) },
    tick: () => tone(1000, .05, 'square', .04),
    win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, .2), i * 120)),
    lose: () => [400, 350, 300, 250].forEach((f, i) => setTimeout(() => tone(f, .25, 'sine', .06), i * 200)),
    pop: () => tone(800, .06),
    cd: () => tone(440, .15, 'square', .08),
    fight: () => { tone(220, .1, 'sawtooth', .12); setTimeout(() => tone(440, .2, 'sawtooth', .15), 100) },
    sw: () => { const c = ctx(); if (!c || !_snd.v) return; const o = c.createOscillator(); const g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(600, c.currentTime); o.frequency.exponentialRampToValueAtTime(200, c.currentTime + .15); g.gain.setValueAtTime(.06, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .15); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .15) },
}

/* ═══ CONFETTI ═══ */
function Confetti({ count = 40 }) {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#22c55e']
    return <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">{Array.from({ length: count }).map((_, i) => {
        const l = Math.random() * 100, dl = Math.random() * 2, dr = 2 + Math.random() * 2, sz = 4 + Math.random() * 6
        return <motion.div key={i} initial={{ y: -20, x: `${l}vw`, rotate: 0, opacity: 1 }} animate={{ y: '110vh', rotate: 720, opacity: [1, 1, 0] }} transition={{ duration: dr, delay: dl, ease: 'linear' }} style={{ position: 'absolute', width: sz, height: sz * .6, background: colors[i % 6], borderRadius: 1 }} />
    })}</div>
}

/* ═══ CIRCULAR TIMER ═══ */
function CTimer({ time, max, size = 48 }) {
    const p = time / max, r = (size - 6) / 2, c = Math.PI * 2 * r
    const clr = p > .5 ? '#22c55e' : p > .25 ? '#eab308' : '#ef4444'
    return <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute -rotate-90"><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={clr} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} animate={time <= 5 ? { opacity: [1, .4, 1] } : {}} transition={time <= 5 ? { duration: .5, repeat: Infinity } : {}} /></svg>
        <span className={`text-xs font-black z-10 ${time <= 5 ? 'text-red-400' : 'text-white'}`}>{time}</span>
    </div>
}



/* ════════════════ MAIN ════════════════ */
export default function LeagueView() {
    const [phase, setPhase] = useState('dashboard')
    const [md, setMd] = useState(null)
    const [, fu] = useState(0)
    const [pendingMode, setPendingMode] = useState('classic')
    const startLangSelect = (mode = 'classic') => { S.pop(); setPendingMode(mode); setPhase('langSelect') }
    const start = (mode = 'classic', forceLang = null) => {
        const lang = forceLang || getActiveLanguage()
        if (forceLang) setActiveLanguage(forceLang)
        const mc = gameModes[mode]
        const opp = getRandomOpponent()
        opp._duelLang = lang
        const qs = mode === 'daily' ? getDailyChallenge().questions : getDuelQuestions(mc.rounds, mode, lang)
        setMd({ opponent: opp, questions: qs, mode, modeConfig: mc, lang })
        setPhase('searching')
    }
    const back = () => { setPhase('dashboard'); setMd(null); fu(v => v + 1) }

    if (phase === 'langSelect') return <LangSelect mode={pendingMode} onSelect={(lang) => start(pendingMode, lang)} onBack={back} />
    if (phase === 'searching') return <Searching opp={md.opponent} mode={md.mode} onFound={() => setPhase('vs')} />
    if (phase === 'vs') return <VsIntro you={getMascotEvolution()} opp={md.opponent} mode={md.mode} onReady={() => setPhase('playing')} />
    if (phase === 'playing') return <Duel {...md} onFinish={r => { setMd(p => ({ ...p, result: r })); setPhase('result') }} />
    if (phase === 'result') return <Result data={md} onAnalytics={() => setPhase('analytics')} onBack={back} />
    if (phase === 'analytics') return <Analytics data={md} onBack={back} />
    return <Dashboard onStart={startLangSelect} />
}

/* ════════════════ DASHBOARD ════════════════ */
function Dashboard({ onStart }) {
    const tier = getLeagueTier(), title = getArenaTitle(), mascot = getMascotEvolution()
    const season = getSeasonData(), bp = getBattlePass(), daily = getDailyChallenge()
    const tot = duelStats.wins + duelStats.losses, wr = tot > 0 ? Math.round(duelStats.wins / tot * 100) : 0
    const [lb] = useState(() => getDuelLeaderboard())
    const [snd, setSnd] = useState(_snd.v)

    /* ── Reward labels for BP ── */
    const bpRewards = ['50 XP', 'Code Font', '100 Gem', 'Boost', 'Title', '250 XP', 'Skin', '500 Gem', 'Emote', 'Border', 'Frame', 'Power', '1000 XP', 'Badge', 'Crown']

    return <div className="h-full overflow-y-auto pb-24">
        {/* ── BACKGROUND: Animated Digital Grid ── */}
        <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(160deg,#050a15,#0a1628 40%,#0d1117 70%,#0a0f1a)' }}>
            <motion.div animate={{ opacity: [.02, .05, .02] }} transition={{ duration: 8, repeat: Infinity }} className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% -10%,${tier.color}18,transparent 55%)` }} />
            {/* Scan lines */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.03) 2px,rgba(255,255,255,0.03) 4px)' }} />
            {/* Grid dots */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* Floating code particles */}
            {['</>', '{}', '()', '[]', '//', 'fn', 'if', '0x'].map((t, i) =>
                <motion.span key={i} animate={{ y: [0, -40, 0], opacity: [0, .25, 0] }} transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * .8 }}
                    className="absolute text-[8px] font-mono" style={{ color: tier.color + '40', left: `${10 + i * 12}%`, top: `${20 + ((i * 17) % 60)}%` }}>{t}</motion.span>
            )}
        </div>

        <div className="max-w-md mx-auto px-4 space-y-4 relative" style={{ paddingTop: 'max(12px,env(safe-area-inset-top,12px))' }}>
            <button onClick={() => { _snd.v = !_snd.v; setSnd(!snd) }} className="absolute right-4 top-3 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] opacity-50 hover:opacity-90 cursor-pointer z-20 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{snd ? '🔊' : '🔇'}</button>

            {/* ── HEADER with glow ── */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-3 pb-1 flex flex-col items-center">
                <motion.div animate={{ boxShadow: [`0 0 20px ${tier.color}15`, `0 0 40px ${tier.color}30`, `0 0 20px ${tier.color}15`] }} transition={{ duration: 3, repeat: Infinity }} className="rounded-full">
                    <OtterMascot size={60} tier={tier} glow={mascot.glow} />
                </motion.div>
                <h1 className="text-xl font-black text-white mt-2" style={{ textShadow: `0 0 20px ${tier.color}30` }}>{tier.name} League</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md" style={{ background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}35`, boxShadow: `0 0 12px ${tier.color}20` }}><BoltIcon size={10} color={tier.color} />{duelStats.elo} ELO</span>
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-white/5 text-slate-400 border border-white/10 backdrop-blur-md"><StarIcon size={10} />{title.name}</span>
                </div>

                {/* ── FLUID ELO BAR ── */}
                {(() => {
                    const nx = leagueTiers.find(t => t.minElo > duelStats.elo)
                    if (!nx) return <p className="text-[8px] font-bold text-amber-400 mt-2">Max Tier!</p>
                    const pct = Math.min(((duelStats.elo - tier.minElo) / (nx.minElo - tier.minElo)) * 100, 100)
                    return <div className="mt-3 w-full px-2">
                        <div className="flex justify-between items-center text-[8px] font-bold mb-1.5">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: tier.color + '15', color: tier.color, border: `1px solid ${tier.color}30` }}><ShieldIcon size={10} tier={tier.name.toLowerCase()} />{tier.name}</span>
                            <motion.span animate={{ opacity: [.5, 1, .5] }} transition={{ duration: 2, repeat: Infinity }} className="text-[8px] text-slate-400 font-black">{duelStats.elo} / {nx.minElo} ELO</motion.span>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: nx.color + '15', color: nx.color, border: `1px solid ${nx.color}30` }}><ShieldIcon size={10} tier={nx.name.toLowerCase()} />{nx.name}</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.8, ease: 'easeOut' }} className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg,${tier.color},${nx.color})`, boxShadow: `0 0 12px ${tier.color}50` }}>
                                {/* Shimmer effect */}
                                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} className="absolute inset-0" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', width: '50%' }} />
                            </motion.div>
                        </div>
                        <p className="text-[7px] font-black text-slate-500 text-center mt-1">{nx.minElo - duelStats.elo} {t('ELO remaining')}</p>
                    </div>
                })()}
            </motion.div>

            {/* ── GLASSMORPHISM MODE BUTTONS ── */}
            <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .05 }}>
                <motion.button whileTap={{ scale: .96 }} onClick={() => onStart('classic')}
                    className="w-full py-4 rounded-2xl font-black text-base text-white cursor-pointer transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#0891b2,#14b8a6)', boxShadow: '0 4px 25px rgba(20,184,166,0.3), 0 0 60px rgba(20,184,166,0.1), inset 0 1px 0 rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)', width: '40%' }} />
                    <SwordIcon size={22} color="white" /> {t('Find Match')}
                </motion.button>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
                    {[
                        { icon: <BoltIcon size={16} color="white" />, label: t('Blitz'), mode: 'blitz', color: '#eab308' },
                        { icon: <DiceIcon size={16} />, label: t('Auction'), mode: 'auction', color: '#a855f7' },
                        { icon: <CalendarIcon size={16} day={new Date().getDate()} />, label: daily.completed ? t('Done') : t('Daily'), mode: 'daily', color: daily.completed ? '#475569' : '#14b8a6', disabled: daily.completed },
                        { icon: <FireIcon size={16} />, label: t('Survival'), mode: 'survival', color: '#ef4444' },
                        { icon: <SwordIcon size={16} color="white" />, label: t('Sudden Death'), mode: 'sudden', color: '#6366f1' },
                    ].map((m, i) => <div key={i} className="flex-shrink-0" style={{ scrollSnapAlign: 'start', width: 'calc(20% - 5px)', minWidth: 60 }}>
                        <GlassBtn icon={m.icon} label={m.label} onClick={() => onStart(m.mode)} color={m.color} disabled={m.disabled} />
                    </div>)}
                </div>
            </motion.div>

            {/* ── STATS ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }} className="grid grid-cols-4 gap-1.5">
                {[{ l: t('Wins'), v: duelStats.wins, c: '#34d399' }, { l: t('Losses'), v: duelStats.losses, c: '#f87171' }, { l: t('Win Rate'), v: `${wr}%`, c: '#fbbf24' }, { l: t('Streak'), v: duelStats.winStreak, c: '#fb923c', icon: true }].map((s, i) =>
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + i * .04 }} className={`${gc} text-center backdrop-blur-md`} style={{ ...G, boxShadow: `0 4px 20px rgba(0,0,0,0.2), 0 0 1px ${s.c}20` }}>
                        <div className="flex items-center justify-center gap-0.5"><p className="text-sm font-black" style={{ color: s.c, textShadow: `0 0 8px ${s.c}40` }}>{s.v}</p>{s.icon && <FireIcon size={12} />}</div>
                        <p className="text-[7px] font-bold text-slate-400">{s.l}</p>
                    </motion.div>
                )}
            </motion.div>

            {/* ── SEASON + BP ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .12 }} className="grid grid-cols-2 gap-2">
                <div className={`${gc} backdrop-blur-md`} style={G}><p className="text-[8px] font-extrabold text-slate-500 flex items-center gap-1"><CalendarIcon size={10} day="S" />{t('SEASON')}</p><p className="text-xs font-black text-white mt-0.5">{t('Season 1: Zero Day')}</p><p className="text-[8px] font-bold text-slate-600">{season.daysLeft} {t('days')} • {season.gamesPlayed} {t('games')}</p></div>
                <div className={`${gc} backdrop-blur-md`} style={G}><p className="text-[8px] font-extrabold text-slate-500 flex items-center gap-1"><StarIcon size={10} />{t('BATTLE PASS')}</p><p className="text-xs font-black text-amber-400 mt-0.5">Tier {bp.currentTier}/{bp.tiers.length}</p><div className="h-1.5 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}><div className="h-full rounded-full" style={{ width: `${Math.min(((bp.xp - bp.prevXp) / Math.max(bp.nextTier.xpNeeded - bp.prevXp, 1)) * 100, 100)}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', boxShadow: '0 0 8px rgba(251,191,36,0.3)' }} /></div></div>
            </motion.div>

            {/* ── CIRCUIT BOARD BATTLE PASS ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .14 }} className={`${gc} backdrop-blur-md relative overflow-hidden`}
                style={{ ...G, background: 'linear-gradient(180deg,rgba(0,15,10,0.6),rgba(5,25,18,0.5))', border: '1px solid rgba(34,197,94,0.15)', boxShadow: 'inset 0 0 30px rgba(34,197,94,0.03)' }}>
                {/* PCB Background Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 8px,rgba(34,197,94,0.2) 8px,rgba(34,197,94,0.2) 9px),repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(34,197,94,0.2) 8px,rgba(34,197,94,0.2) 9px)' }} />
                {/* PCB corner markers */}
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full border border-green-900/30" style={{ background: 'radial-gradient(circle,rgba(34,197,94,0.1),transparent)' }} />
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-green-900/30" style={{ background: 'radial-gradient(circle,rgba(34,197,94,0.1),transparent)' }} />

                <p className="text-[8px] font-extrabold mb-3 flex items-center gap-1.5 relative z-10" style={{ color: '#4ade80', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#4ade80" strokeWidth="1.5" /><rect x="8" y="8" width="8" height="8" rx="1" fill="#4ade80" fillOpacity="0.3" /><line x1="12" y1="0" x2="12" y2="4" stroke="#4ade80" strokeWidth="1" /><line x1="12" y1="20" x2="12" y2="24" stroke="#4ade80" strokeWidth="1" /><line x1="0" y1="12" x2="4" y2="12" stroke="#4ade80" strokeWidth="1" /><line x1="20" y1="12" x2="24" y2="12" stroke="#4ade80" strokeWidth="1" /></svg>
                    CIRCUIT_PASS v1.0
                </p>

                <div className="relative overflow-x-auto pb-2 relative z-10" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex items-start" style={{ minWidth: bp.tiers.length * 62, paddingTop: 4 }}>
                        {bp.tiers.map((t, i) => {
                            const u = bp.xp >= t.xpNeeded
                            const isCurrent = bp.currentTier === t.tier
                            const isMilestone = [4, 9, 14].includes(i)
                            const chipW = isMilestone ? 48 : 40, chipH = isMilestone ? 48 : 40
                            const icons = [GemSVG, XPStar, BoltIcon, GemSVG, XPStar, CrownSVG, GemSVG, XPStar, BoltIcon, GemSVG, TrophyIcon, GemSVG, XPStar, BoltIcon, CrownSVG]
                            const IconComp = icons[i % icons.length]
                            const traceColor = u ? '#4ade80' : isCurrent ? '#14b8a6' : 'rgba(148,163,184,0.2)'
                            const traceShadow = u ? '0 0 8px rgba(74,222,128,0.5)' : 'none'
                            const chipBg = u ? 'linear-gradient(145deg,#0a2a1a,#0f3d24)' : isCurrent ? 'linear-gradient(145deg,#0a1f2a,#0f2d3d)' : 'linear-gradient(145deg,rgba(15,23,42,0.8),rgba(30,41,59,0.6))'
                            const chipBorder = u ? 'rgba(74,222,128,0.5)' : isCurrent ? 'rgba(20,184,166,0.5)' : 'rgba(148,163,184,0.18)'
                            const chipShadow = u ? '0 0 20px rgba(74,222,128,0.25), inset 0 0 10px rgba(74,222,128,0.06)' : isCurrent ? '0 0 24px rgba(20,184,166,0.3), inset 0 0 10px rgba(20,184,166,0.06)' : '0 0 4px rgba(0,0,0,0.2)'
                            const ledColor = u ? '#4ade80' : isCurrent ? '#14b8a6' : '#475569'

                            return <div key={i} className="flex-shrink-0 flex flex-col items-center relative" style={{ width: 62 }}>
                                {/* PCB Trace (connecting line) */}
                                {i > 0 && <>
                                    <div className="absolute" style={{ top: chipH / 2 + 4, left: -8, width: 16, height: 2, background: traceColor, boxShadow: traceShadow, borderRadius: 1 }} />
                                    {/* Trace via (solder point) */}
                                    <div className="absolute" style={{ top: chipH / 2 + 2, left: -2, width: 6, height: 6, borderRadius: '50%', background: u ? '#0a2a1a' : isCurrent ? '#0a1f2a' : '#111811', border: `1.5px solid ${traceColor}`, boxShadow: traceShadow }} />
                                    {/* Electric pulse on trace */}
                                    {u && <motion.div animate={{ x: [-16, 16], opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} className="absolute" style={{ top: chipH / 2 + 3, left: -8, width: 4, height: 4, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', filter: 'blur(1px)' }} />}
                                </>}

                                {/* CHIP NODE */}
                                <motion.div
                                    animate={isCurrent ? { boxShadow: [`0 0 8px rgba(20,184,166,0.15)`, `0 0 20px rgba(20,184,166,0.35)`, `0 0 8px rgba(20,184,166,0.15)`] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="relative flex items-center justify-center"
                                    style={{ width: chipW, height: chipH, background: chipBg, border: `1.5px solid ${chipBorder}`, boxShadow: chipShadow, borderRadius: isMilestone ? 8 : 6 }}>

                                    {/* Chip pins (top & bottom) */}
                                    {[...Array(isMilestone ? 4 : 3)].map((_, pi) => {
                                        const pinOffset = isMilestone ? 8 + pi * 10 : 8 + pi * 10
                                        return <div key={pi}>
                                            <div className="absolute" style={{ top: -3, left: pinOffset, width: 3, height: 4, background: traceColor, borderRadius: '0 0 1px 1px', opacity: 0.6 }} />
                                            <div className="absolute" style={{ bottom: -3, left: pinOffset, width: 3, height: 4, background: traceColor, borderRadius: '1px 1px 0 0', opacity: 0.6 }} />
                                        </div>
                                    })}
                                    {/* Chip pins (left & right) */}
                                    {[...Array(2)].map((_, pi) => {
                                        const pinY = isMilestone ? 12 + pi * 16 : 10 + pi * 14
                                        return <div key={`lr${pi}`}>
                                            <div className="absolute" style={{ left: -3, top: pinY, width: 4, height: 3, background: traceColor, borderRadius: '0 1px 1px 0', opacity: 0.6 }} />
                                            <div className="absolute" style={{ right: -3, top: pinY, width: 4, height: 3, background: traceColor, borderRadius: '1px 0 0 1px', opacity: 0.6 }} />
                                        </div>
                                    })}

                                    {/* Inner die / icon area */}
                                    <div className="flex flex-col items-center justify-center rounded" style={{ width: chipW - 12, height: chipH - 12, background: u ? 'rgba(74,222,128,0.08)' : isCurrent ? 'rgba(20,184,166,0.08)' : 'rgba(148,163,184,0.04)', border: `1px solid ${u ? 'rgba(74,222,128,0.15)' : isCurrent ? 'rgba(20,184,166,0.15)' : 'rgba(148,163,184,0.08)'}` }}>
                                        {u ? <StarIcon size={isMilestone ? 18 : 14} color="#4ade80" /> : <IconComp size={isMilestone ? 18 : 14} color={isCurrent ? '#14b8a6' : '#94a3b8'} />}
                                    </div>

                                    {/* LED status indicator */}
                                    <motion.div
                                        animate={isCurrent ? { opacity: [.5, 1, .5], boxShadow: [`0 0 2px ${ledColor}`, `0 0 6px ${ledColor}`, `0 0 2px ${ledColor}`] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute" style={{ top: 3, right: 3, width: 4, height: 4, borderRadius: '50%', background: ledColor, boxShadow: u ? `0 0 4px ${ledColor}` : 'none' }} />

                                    {/* Milestone label */}
                                    {isMilestone && <div className="absolute -top-1 -right-1 px-1 rounded text-[4px] font-black" style={{ background: u ? '#4ade80' : isCurrent ? '#14b8a6' : '#334155', color: '#000' }}>CPU</div>}

                                    {/* Current tier scanner line */}
                                    {isCurrent && <motion.div animate={{ y: [-chipH / 2, chipH / 2] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0" style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(20,184,166,0.4),transparent)' }} />}
                                </motion.div>

                                {/* Tier label - terminal style */}
                                <span className={`text-[7px] font-black mt-1.5 font-mono ${u ? 'text-green-400' : isCurrent ? 'text-teal-400' : 'text-slate-400'}`}>T{String(t.tier).padStart(2, '0')}</span>
                                {/* Reward - command style */}
                                <span className={`text-[6px] font-mono leading-tight text-center ${u ? 'text-green-400/70' : isCurrent ? 'text-teal-400/70' : 'text-slate-400'}`}>{bpRewards[i] || 'BONUS'}</span>
                            </div>
                        })}
                    </div>
                </div>

                {/* Bottom PCB info strip */}
                <div className="flex items-center justify-between mt-2 pt-1.5 relative z-10" style={{ borderTop: '1px solid rgba(34,197,94,0.08)' }}>
                    <span className="text-[5px] font-mono text-slate-600">REV 2026.03</span>
                    <span className="text-[6px] font-mono font-bold" style={{ color: '#4ade8080' }}>NEXT: {bpRewards[bp.currentTier] || 'MAX'}</span>
                    <span className="text-[5px] font-mono text-slate-600">RHEO PCB</span>
                </div>
            </motion.div>

            {/* ── EMOTES: Metallic Badge Style ── */}
            <EmoteShop />

            {/* ── LEADERBOARD — Top 3 + Sticky User ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className={`${gc} backdrop-blur-md`} style={G}>
                <h3 className="text-[9px] font-extrabold text-slate-500 tracking-widest mb-2 flex items-center gap-1"><TrophyIcon size={14} color="#fbbf24" />{t('Leaderboard').toUpperCase()}</h3>
                <div className="space-y-1">{(() => {
                    const medalColors = ['#fbbf24', '#C0C0C0', '#CD7F32']
                    const top3 = lb.slice(0, 3)
                    const userEntry = lb.find(p => p.isUser)
                    const userIdx = lb.findIndex(p => p.isUser)
                    const renderRow = (p, i, isSticky) => <motion.div key={`${p.name}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .02 * i }}
                        className={`flex items-center gap-2 rounded-xl px-2.5 py-2 transition-all`}
                        style={isSticky ? { background: `${tier.color}12`, border: `1px solid ${tier.color}30`, boxShadow: `0 0 15px ${tier.color}15, inset 0 0 8px ${tier.color}08` }
                            : i < 3 ? { background: `${medalColors[i]}08`, border: `1px solid ${medalColors[i]}15` }
                                : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="w-6 flex justify-center">
                            {i < 3 ? <motion.div animate={{ boxShadow: [`0 0 4px ${medalColors[i]}30`, `0 0 10px ${medalColors[i]}50`, `0 0 4px ${medalColors[i]}30`] }} transition={{ duration: 2, repeat: Infinity }} className="rounded-full">
                                <MedalIcon rank={i + 1} size={20} />
                            </motion.div> : <span className="text-[10px] font-black text-slate-600">{i + 1}</span>}
                        </div>
                        <div className="relative">
                            {i < 3 && <motion.div animate={{ opacity: [.3, .6, .3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -inset-1 rounded-full" style={{ background: `radial-gradient(circle,${medalColors[i]}20,transparent)` }} />}
                            <OtterMascot size={28} bodyColor={p.isUser ? undefined : (p.otterColor || '#6366f1')} />
                        </div>
                        <span className={`flex-1 text-[10px] font-extrabold truncate ${isSticky || p.isUser ? 'text-teal-300' : 'text-slate-300'}`}>{p.name}</span>
                        <span className="text-[9px] font-black" style={{ color: isSticky ? '#14b8a6' : i < 3 ? medalColors[i] + 'cc' : '#475569' }}>{p.xp}</span>
                    </motion.div>
                    return <>
                        {top3.map((p, i) => renderRow(p, i, false))}
                        {userEntry && userIdx >= 3 && <>
                            <div className="flex items-center justify-center py-1"><span className="text-[8px] font-bold text-slate-600 tracking-[0.3em]">•••</span></div>
                            {renderRow(userEntry, userIdx, true)}
                        </>}
                    </>
                })()}</div>
            </motion.div>

            {/* ── HISTORY ── */}
            {duelHistory.length > 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }}>
                <h3 className="text-[9px] font-extrabold text-slate-500 tracking-widest mb-2 flex items-center gap-1"><ChartIcon size={12} />{t('Recent Duels').toUpperCase()}</h3>
                <div className="space-y-1.5">{duelHistory.slice(0, 5).map(m =>
                    <div key={m.id} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${gc} backdrop-blur-md`} style={{ ...G, borderLeft: `3px solid ${m.result === 'win' ? '#34d399' : '#f87171'}` }}>
                        <OtterMascot size={28} bodyColor={m.opponent.otterColor} />
                        <div className="flex-1 min-w-0"><p className="text-[10px] font-extrabold text-white truncate">{m.opponent.name}</p><span className="text-[7px] font-bold text-slate-600">{m.date}</span></div>
                        <div className="text-right"><p className={`text-[10px] font-black ${m.result === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>{m.score}</p><span className={`text-[7px] font-bold ${m.elo > 0 ? 'text-emerald-400/80' : 'text-red-400/80'}`}>{m.elo > 0 ? '+' : ''}{m.elo}</span></div>
                    </div>
                )}</div>
            </motion.div>}
            {duelHistory.length === 0 && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: [0, 10, -10, 0], y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}><SwordIcon size={28} color="#14b8a6" /></motion.div>
                <div><p className="text-sm font-black text-slate-300">{t('Ready for your first duel?')}</p><p className="text-[10px] font-bold text-slate-500 mt-0.5">{t('Challenge AI opponents and climb the ranks!')}</p></div>
                <motion.button whileTap={{ scale: .95 }} onClick={() => onStart('classic')} className="px-5 py-2 rounded-xl font-black text-xs text-white cursor-pointer" style={{ background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', boxShadow: '0 4px 15px rgba(20,184,166,0.3)' }}>⚔️ {t('Start First Duel!')}</motion.button>
            </motion.div>}

            {/* ── ACHIEVEMENTS (Hologram Cards) ── */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} className={`${gc} backdrop-blur-md`} style={G}>
                <h3 className="text-[9px] font-extrabold text-slate-500 tracking-widest mb-2 flex items-center gap-1"><MedalIcon rank={1} size={14} />{t('Achievements').toUpperCase()} ({getUnlockedAchievements().length}/{achievementDefs.length})</h3>
                <div className="grid grid-cols-4 gap-1.5">{achievementDefs.map(a => {
                    const unlocked = getUnlockedAchievements().find(u => u.id === a.id)
                    return <HologramCard key={a.id} unlocked={!!unlocked} color={unlocked ? a.color : '#64748b'}>
                        <div className="flex flex-col items-center gap-0.5 py-1.5 px-0.5">
                            <motion.div animate={unlocked ? { boxShadow: [`0 0 4px ${a.color}20`, `0 0 8px ${a.color}40`, `0 0 4px ${a.color}20`] } : {}} transition={{ duration: 3, repeat: Infinity }}
                                className="w-8 h-8 rounded-full flex items-center justify-center" style={unlocked ? { background: `${a.color}20` } : { background: 'rgba(148,163,184,0.1)' }}>
                                <span className={`text-sm ${unlocked ? '' : 'grayscale opacity-40'}`}>{a.icon || '🏅'}</span>
                            </motion.div>
                            <span className="text-[5px] font-black text-center leading-tight" style={{ color: unlocked ? a.color : '#94a3b8' }}>{a.name}</span>
                            <span className="text-[4px] font-bold text-slate-600 text-center leading-tight">{a.desc}</span>
                        </div>
                    </HologramCard>
                })}</div>
            </motion.div>
            <div className="pb-4" />
        </div>
    </div>
}

/* ── Glassmorphism Button ── */
function GlassBtn({ icon, label, onClick, color, disabled }) {
    return <motion.button whileTap={disabled ? {} : { scale: .95 }} onClick={disabled ? undefined : onClick}
        className={`w-full pt-3 pb-2 rounded-xl font-black text-[9px] text-white transition-all cursor-pointer flex flex-col items-center justify-center gap-1 backdrop-blur-md relative overflow-hidden ${disabled ? 'opacity-35' : ''}`}
        style={{ background: `linear-gradient(135deg,${color}25,${color}10)`, border: `1px solid ${color}35`, boxShadow: `0 4px 15px ${color}15, 0 0 1px ${color}40`, height: 56 }}>
        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }} className="absolute inset-0" style={{ background: `linear-gradient(90deg,transparent,${color}15,transparent)`, width: '30%' }} />
        <span className="relative z-10 flex items-center justify-center" style={{ width: 20, height: 20 }}>{icon}</span>
        <span className="relative z-10 leading-none">{label}</span>
    </motion.button>
}

function EmoteShop() {
    const [owned, setOwned] = useState(() => getOwnedEmotes())
    const [show, setShow] = useState(false)
    const [justBought, setJustBought] = useState(null)
    const [error, setError] = useState(null)

    const handleBuy = (e) => {
        if (owned.find(o => o.id === e.id)) return
        if ((stats.gems || 0) < e.price) {
            setError(`Need ${e.price - (stats.gems || 0)} more gems!`)
            setTimeout(() => setError(null), 2000)
            return
        }
        const success = buyEmote(e.id)
        if (success) {
            S.pop()
            setOwned(getOwnedEmotes())
            setJustBought(e.id)
            setTimeout(() => setJustBought(null), 1500)
        }
    }

    const tierColors = { free: '#22c55e', common: '#06b6d4', rare: '#a855f7', legendary: '#fbbf24' }

    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .16 }} className={gc} style={G}>
        <div className="flex items-center justify-between py-1 mb-1">
            <p className="text-[8px] font-extrabold text-slate-500 leading-none">{t('Emotes').toUpperCase()} ({owned.length}/{allEmotes.length})</p>
            <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-amber-400">{stats.gems || 0} 💎</span>
                <button onClick={() => setShow(!show)} className="text-[8px] font-black text-teal-400 cursor-pointer leading-none">{show ? t('Close') : t('Shop')}</button>
            </div>
        </div>
        {/* Owned emotes - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>{owned.map(e =>
            <motion.div key={e.id} whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 rounded-xl py-1.5 px-3 flex items-center gap-1.5 border"
                style={{ background: `${e.color}15`, border: `1px solid ${e.color}30`, boxShadow: `0 0 12px ${e.color}10` }}>
                <span className="text-sm font-black" style={{ color: e.color }}>{e.label}</span>
                <span className="text-[7px] font-bold" style={{ color: e.color + '99' }}>{e.text}</span>
            </motion.div>
        )}</div>
        {/* Shop panel */}
        <AnimatePresence>{show && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-black text-red-400 text-center mt-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>⚠️ {error}</motion.p>}
            <div className="grid grid-cols-2 gap-1.5 mt-2">{allEmotes.filter(e => !owned.find(o => o.id === e.id)).map(e => {
                const canAfford = (stats.gems || 0) >= e.price
                return <motion.button key={e.id} whileTap={{ scale: .95 }} onClick={() => handleBuy(e)}
                    className={`rounded-xl py-2 px-2.5 text-left cursor-pointer transition-all relative overflow-hidden border ${!canAfford ? 'opacity-40' : ''}`}
                    style={{ background: `${e.color}08`, border: `1px solid ${e.color}20` }}>
                    {justBought === e.id && <motion.div initial={{ scale: 0 }} animate={{ scale: 2, opacity: 0 }} className="absolute inset-0 rounded-xl" style={{ background: e.color, opacity: 0.3 }} />}
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black" style={{ color: e.color }}>{e.label}</span>
                        <span className="text-[5px] font-black px-1 py-0.5 rounded" style={{ background: tierColors[e.tier] + '20', color: tierColors[e.tier] }}>{e.tier?.toUpperCase()}</span>
                    </div>
                    <p className="text-[6px] font-bold text-slate-500 mb-1">{e.text}</p>
                    <span className="text-[7px] font-black text-amber-400">{e.price} 💎</span>
                </motion.button>
            })}</div>
        </motion.div>}</AnimatePresence>
    </motion.div>
}

/* ════════════════ LANGUAGE SELECTOR ════════════════ */
function LangSelect({ mode, onSelect, onBack }) {
    const langCards = languages.map(l => {
        const elo = getLangElo(l.id)
        const tier = getLeagueTier(elo)
        return { ...l, elo, tier }
    })
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-4 flex flex-col overflow-y-auto" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
            <div className="flex items-center gap-3 mb-6">
                <motion.button whileTap={{ scale: .9 }} onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white" style={{ background: 'rgba(255,255,255,0.08)' }}>←</motion.button>
                <h2 className="text-white font-black text-lg flex-1">⚔️ {t('Choose Language')}</h2>
            </div>
            <p className="text-white/50 text-xs text-center mb-5">{t('Each language has its own ELO rating')}</p>
            <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
                {langCards.map((l, i) => (
                    <motion.button
                        key={l.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { S.fight(); onSelect(l.id) }}
                        className="rounded-2xl p-4 text-left cursor-pointer relative overflow-hidden"
                        style={{
                            ...G,
                            borderColor: l.tier.color + '40',
                            borderWidth: 2,
                        }}
                    >
                        {/* Tier glow */}
                        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 80% 50%, ${l.tier.color}, transparent 70%)` }} />
                        <div className="relative flex items-center gap-4">
                            <span className="text-4xl">{l.icon}</span>
                            <div className="flex-1">
                                <div className="text-white font-bold text-base">{l.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: l.tier.color + '30', color: l.tier.color }}>
                                        {l.tier.emoji} {l.tier.name}
                                    </span>
                                    <span className="text-white/40 text-xs">ELO {l.elo}</span>
                                </div>
                            </div>
                            <div className="text-white/30 text-2xl">→</div>
                        </div>
                    </motion.button>
                ))}
            </div>
            <p className="text-white/30 text-[10px] text-center mt-4">{t('Your rank is calculated separately for each language')}</p>
        </motion.div>
    )
}

/* ════════════════ SEARCHING ════════════════ */
function Searching({ opp, mode, onFound }) {
    const [found, setFound] = useState(false)
    const [dots, setDots] = useState('')
    useEffect(() => { S.sw(); const d = setInterval(() => setDots(v => v.length >= 3 ? '' : v + '.'), 400); const f = setTimeout(() => { setFound(true); S.pop(); setTimeout(onFound, 1800) }, 2500 + Math.random() * 2000); return () => { clearInterval(d); clearTimeout(f) } }, [onFound])

    return <div className="h-full flex flex-col items-center justify-center px-8 gap-5">
        <span className="text-[9px] font-black text-slate-500 px-3 py-0.5 rounded-full border border-white/10" style={G}>{gameModes[mode]?.name}</span>
        {!found ? <>
            <div className="relative w-44 h-44">
                <div className="absolute inset-0 rounded-full border-2 border-red-500/20" /><div className="absolute inset-4 rounded-full border border-red-500/15" /><div className="absolute inset-8 rounded-full border border-red-500/10" />
                <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}><div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left" style={{ background: 'linear-gradient(90deg,rgba(239,68,68,0.8),transparent)' }} /></motion.div>
                <div className="absolute inset-0 flex items-center justify-center"><motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}><OtterMascot size={48} tier={getLeagueTier()} /></motion.div></div>
            </div>
            <h2 className="text-lg font-black text-white">{t('Searching Opponent')}{dots}</h2>
            <p className="text-[10px] font-bold text-slate-500">ELO: {duelStats.elo - 100} - {duelStats.elo + 100}</p>
        </> : <>
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
                <OtterMascot size={80} bodyColor={opp.otterColor} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="text-center">
                <h2 className="text-lg font-black text-white">{t('Opponent Found!')}</h2>
                <p className="text-sm font-extrabold text-red-400 mt-0.5">{opp.name}</p>
                <p className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1"><BoltIcon size={10} />{opp.elo} ELO</p>
            </motion.div>
        </>}
    </div>
}

/* ════════════════ VS INTRO ════════════════ */
function VsIntro({ you, opp, mode, onReady }) {
    const [c, setC] = useState(3)
    const readyRef = useRef(onReady)
    readyRef.current = onReady
    const fired = useRef(false)
    useEffect(() => {
        if (c <= 0) { if (!fired.current) { fired.current = true; S.fight(); setTimeout(() => readyRef.current(), 300) } return }
        S.cd(); const t = setTimeout(() => setC(v => v - 1), 800); return () => clearTimeout(t)
    }, [c])
    return <div className="h-full flex flex-col items-center justify-center gap-6 px-8">
        <div className="flex items-center gap-6 w-full justify-center">
            <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150 }} className="text-center">
                <OtterMascot size={64} tier={getLeagueTier()} glow={you.glow} />
                <p className="text-xs font-black text-teal-300 mt-1">SEN</p>
                <p className="text-[9px] font-bold text-slate-500 flex items-center justify-center gap-0.5"><BoltIcon size={8} />{duelStats.elo}</p>
            </motion.div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ delay: .3, duration: .5 }}><VSBadge size={48} /></motion.div>
            <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150 }} className="text-center">
                <OtterMascot size={64} bodyColor={opp.otterColor} />
                <p className="text-xs font-black text-red-400 mt-1">{opp.name}</p>
                <p className="text-[9px] font-bold text-slate-500 flex items-center justify-center gap-0.5"><BoltIcon size={8} />{opp.elo}</p>
            </motion.div>
        </div>
        <span className="text-[9px] font-black text-slate-600 px-3 py-0.5 rounded-full border border-white/10" style={G}>{gameModes[mode]?.desc}</span>
        <motion.div key={c} initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-6xl font-black ${c > 0 ? 'text-amber-400' : 'text-red-500'}`} style={{ textShadow: c > 0 ? '0 0 40px rgba(251,191,36,0.4)' : '0 0 40px rgba(239,68,68,0.5)' }}>{c > 0 ? c : 'FIGHT!'}</motion.div>
    </div>
}

/* ════════════════ DUEL ════════════════ */
function Duel({ opponent, questions, mode, modeConfig, onFinish }) {
    const [rd, setRd] = useState(0), [tl, setTl] = useState(modeConfig?.timer || 20), [sel, setSel] = useState(null)
    const [sc, setSc] = useState({ you: 0, them: 0 }), [rr, setRr] = useState([]), [oAns, setOAns] = useState(false)
    const [sEmote, setSEmote] = useState(null), [oEmote, setOEmote] = useState(null), [rdDet, setRdDet] = useState([])
    const [bet, setBet] = useState(10), [showBet, setShowBet] = useState(!!modeConfig?.betting)
    const [lives, setLives] = useState(modeConfig?.lives || 99)
    const [flash, setFlash] = useState(null) // 'correct' | 'wrong' | null
    const [decrypting, setDecrypting] = useState(true)
    const [decText, setDecText] = useState('')
    const st = useRef(Date.now()), tot = questions?.length || 0
    const q = questions && rd < questions.length ? questions[rd] : null
    const ownEm = getOwnedEmotes()
    const spd = (s) => !modeConfig?.speedBonus ? 1 : s >= 7 ? 3 : s >= 4 ? 2 : 1
    const glyphs = '█▓▒░┃┆╋╬◆◇○●∆∇⟡⬡⬢◉▪▫⌬⏣'

    // Decryption animation
    useEffect(() => {
        if (!q) return; setDecrypting(true)
        const target = q.text; let frame = 0; const maxFrames = 12
        const iv = setInterval(() => {
            frame++
            if (frame >= maxFrames) { clearInterval(iv); setDecText(target); setDecrypting(false); return }
            const ratio = frame / maxFrames
            setDecText(target.split('').map((c, i) => {
                if (c === ' ') return ' '
                return Math.random() < ratio ? c : glyphs[Math.floor(Math.random() * glyphs.length)]
            }).join(''))
        }, 80)
        return () => clearInterval(iv)
    }, [rd, q])

    useEffect(() => { if (!q && rd > 0) { onFinish({ won: sc.you > sc.them, yourScore: sc.you, theirScore: sc.them, totalTimeMs: Date.now() - st.current, roundDetails: rdDet }) } }, [q, rd])
    useEffect(() => { if (!q || tl <= 0 || sel !== null || showBet) return; const t = setInterval(() => setTl(v => { if (v <= 6 && v > 1) S.tick(); return v - 1 }), 1000); return () => clearInterval(t) }, [tl, sel, showBet, q])
    // Bot lock-in (8-15s random delay)
    useEffect(() => { if (!q || sel !== null || showBet) return; setOAns(false); const d = 8000 + Math.random() * 7000; const t = setTimeout(() => { setOAns(true); S.sw() }, d); return () => clearTimeout(t) }, [rd, sel, showBet, q])
    useEffect(() => { setOEmote(null); const d = 4000 + Math.random() * 8000; const t = setTimeout(() => { const em = ['GG', 'WP', 'EZ', 'GL']; setOEmote(em[Math.floor(Math.random() * em.length)]); S.pop(); setTimeout(() => setOEmote(null), 2500) }, d); return () => clearTimeout(t) }, [rd])

    const answer = useCallback((idx) => {
        if (sel !== null || !q) return; setSel(idx); const ok = idx === q.correct; ok ? S.ok() : S.no()
        // Flash effect
        setFlash(ok ? 'correct' : 'wrong'); setTimeout(() => setFlash(null), 800)
        let newLives = lives
        if (modeConfig?.lives && !ok) { newLives = lives - 1; setLives(newLives) }
        const ns = { ...sc }; if (ok) ns.you += modeConfig?.speedBonus ? spd(tl) : 1; if (Math.random() < getAICorrectChance(opponent, q.type || 'mcq')) ns.them += modeConfig?.speedBonus ? Math.ceil(Math.random() * 2) : 1
        setSc(ns); setRr(p => [...p, ok ? 'you' : (ns.them > sc.them ? 'them' : 'skip')]); setRdDet(p => [...p, { question: q.text, correct: ok, timeUsed: (modeConfig?.timer || 20) - tl, speedBonus: modeConfig?.speedBonus ? spd(tl) : null }])
        const isEnd = rd + 1 >= tot || (modeConfig?.suddenDeath && !ok) || (modeConfig?.lives && newLives <= 0)
        if (isEnd) { setTimeout(() => onFinish({ won: ns.you > ns.them, yourScore: ns.you, theirScore: ns.them, totalTimeMs: Date.now() - st.current, roundDetails: [...rdDet, { question: q.text, correct: ok, timeUsed: (modeConfig?.timer || 20) - tl }] }), 1800) }
        else { setTimeout(() => { setRd(r => r + 1); setSel(null); setTl(modeConfig?.timer || 20); if (modeConfig?.betting) setShowBet(true) }, 1500) }
    }, [sel, q, sc, rd, tot, opponent, onFinish, tl, modeConfig, rdDet, lives])

    useEffect(() => { if (tl === 0 && sel === null && !showBet && q) answer(-1) }, [tl, sel, answer, showBet, q])

    if (!q) return <div className="h-full flex items-center justify-center"><p className="text-white font-black">{t('Loading...')}</p></div>
    const lang = getActiveLanguage(), li = { python: 'Python', javascript: 'JS', java: 'Java' }[lang] || 'Python'
    const qColors = { mcq: '#06b6d4', debug: '#ef4444', complete: '#a855f7', trace: '#22c55e', algo: '#eab308' }
    const timePct = (tl / (modeConfig?.timer || 20)) * 100
    const isCrit = tl <= 5

    if (showBet) return <div className="h-full flex flex-col items-center justify-center gap-5 px-8">
        <DiceIcon size={48} /><h2 className="text-lg font-black text-white">{t('XP Wager?')}</h2>
        <p className="text-[10px] font-bold text-slate-500">{t('Correct')} = +{bet * 2} XP • {t('Wrong')} = -{bet} XP</p>
        <div className="w-full max-w-xs"><input type="range" min="10" max="100" step="10" value={bet} onChange={e => setBet(+e.target.value)} className="w-full accent-purple-500" /><div className="flex justify-between text-[9px] font-black"><span className="text-slate-500">10</span><span className="text-purple-400 text-lg">{bet} XP</span><span className="text-slate-500">100</span></div></div>
        <div className="flex gap-3"><button onClick={() => { setBet(100); S.pop() }} className="px-4 py-2 rounded-xl font-black text-xs text-amber-400 border border-amber-700/50 cursor-pointer" style={G}>MAX</button><button onClick={() => { setShowBet(false); S.pop() }} className="px-6 py-2 rounded-xl font-black text-xs text-white bg-purple-600 border-b-[3px] border-purple-800 cursor-pointer active:border-b-[1px] active:translate-y-[2px]">{t('START')}</button></div>
    </div>

    return <motion.div
        animate={flash === 'wrong' ? { x: [0, -4, 4, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="h-full flex flex-col relative overflow-hidden"
        style={{ paddingTop: 'max(4px,env(safe-area-inset-top,4px))', background: 'radial-gradient(ellipse at 50% 0%,rgba(6,182,212,0.06),transparent 60%)' }}>

        {/* ── CYBER GRID BACKGROUND ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }}>
            <defs><pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#14b8a6" strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#cyberGrid)" />
        </svg>

        {/* ── FULL SCREEN FLASH OVERLAY ── */}
        <AnimatePresence>{flash && <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: .25 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 pointer-events-none"
            style={{ background: flash === 'correct' ? 'radial-gradient(circle at bottom,#14b8a6,transparent 70%)' : 'radial-gradient(circle at center,#ef4444,transparent 70%)' }} />
        }</AnimatePresence>

        {/* ── SHARED TIMEBAR (Top) ── */}
        <div className="px-3 mb-0.5">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div animate={{ width: `${timePct}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full relative"
                    style={{ background: isCrit ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#14b8a6,#06b6d4)', boxShadow: isCrit ? '0 0 12px rgba(239,68,68,0.5)' : '0 0 8px rgba(20,184,166,0.3)' }}>
                    {isCrit && <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.5, repeat: Infinity }} className="absolute inset-0 rounded-full" style={{ background: 'rgba(239,68,68,0.4)' }} />}
                </motion.div>
            </div>
            <div className="flex justify-between">
                <span className="text-[7px] font-mono font-bold text-slate-600">{li}</span>
                <motion.span animate={isCrit ? { scale: [1, 1.15, 1], color: ['#ef4444', '#fbbf24', '#ef4444'] } : {}} transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-[9px] font-black font-mono" style={{ color: isCrit ? '#ef4444' : '#94a3b8' }}>{tl}s</motion.span>
                <span className="text-[7px] font-mono font-bold text-slate-600">R{rd + 1}/{tot}</span>
            </div>
        </div>

        {/* ── SPLIT-SCREEN PLAYER ZONES ── */}
        <div className="flex items-center justify-between px-3 py-0.5 relative">
            {/* Player zone (left - teal) */}
            <div className="flex items-center gap-1.5 flex-1 rounded-lg px-2 py-1" style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.12)' }}>
                <div className="relative">
                    {flash === 'correct' && <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ duration: 0.6 }} className="absolute inset-0 rounded-full" style={{ background: '#14b8a6', filter: 'blur(8px)' }} />}
                    <OtterMascot size={28} tier={getLeagueTier()} />
                </div>
                <div>
                    <p className="text-[7px] font-black text-teal-400 font-mono">{t('Wins') === 'Galibiyet' ? 'SEN' : 'YOU'}</p>
                    <p className="text-base font-black text-teal-300 leading-none">{sc.you}</p>
                </div>
            </div>

            {/* VS divider */}
            <div className="flex flex-col items-center mx-1.5">
                <motion.div animate={{ boxShadow: ['0 0 4px #fbbf2440', '0 0 12px #fbbf2480', '0 0 4px #fbbf2440'] }} transition={{ duration: 2, repeat: Infinity }}
                    className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)' }}>
                    <span className="text-[8px] font-black text-amber-400">VS</span>
                </motion.div>
            </div>

            {/* Enemy zone (right - red) */}
            <div className="flex items-center gap-1.5 flex-1 flex-row-reverse rounded-lg px-2 py-1" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="relative">
                    {oAns && <motion.div animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute inset-0 rounded-full" style={{ background: '#ef4444', filter: 'blur(6px)' }} />}
                    <OtterMascot size={28} bodyColor={opponent.otterColor} />
                </div>
                <div className="text-right">
                    <p className="text-[7px] font-black text-red-400 font-mono truncate max-w-[60px]">{opponent.name}</p>
                    <p className="text-base font-black text-red-300 leading-none">{sc.them}</p>
                </div>
            </div>
        </div>

        {/* ── OPPONENT LOCKED IN notification ── */}
        <AnimatePresence>
            {sEmote && <FEmote emoji={sEmote} from="left" />}{oEmote && <FEmote emoji={oEmote} from="right" />}
            {oAns && sel === null && <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex justify-center mb-1">
                <motion.span animate={{ boxShadow: ['0 0 6px rgba(239,68,68,0.2)', '0 0 16px rgba(239,68,68,0.5)', '0 0 6px rgba(239,68,68,0.2)'] }} transition={{ duration: 1, repeat: Infinity }}
                    className="text-[8px] font-black text-red-400 font-mono px-3 py-1 rounded-full tracking-wider"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    ⚠ OPPONENT LOCKED IN
                </motion.span>
            </motion.div>}
        </AnimatePresence>

        {/* ── WRONG ANSWER alert ── */}
        <AnimatePresence>
            {flash === 'wrong' && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center mb-1">
                <span className="text-[8px] font-black text-red-500 font-mono px-3 py-1 rounded-full tracking-wider"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    ✖ SYSTEM COMPROMISED
                </span>
            </motion.div>}
            {flash === 'correct' && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center mb-1">
                <span className="text-[8px] font-black text-teal-400 font-mono px-3 py-1 rounded-full tracking-wider"
                    style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)' }}>
                    ✓ ACCESS GRANTED
                </span>
            </motion.div>}
        </AnimatePresence>

        {/* ── ROUND INDICATOR DOTS ── */}
        <div className="flex justify-center gap-1 pb-0.5">{Array.from({ length: tot }).map((_, i) => <motion.div key={i} animate={i === rd ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: .6, repeat: Infinity }} className={`w-1.5 h-1.5 rounded-sm ${rr[i] === 'you' ? 'bg-teal-400' : rr[i] === 'them' ? 'bg-red-400' : rr[i] === 'skip' ? 'bg-slate-600' : i === rd ? 'bg-amber-400' : 'bg-slate-800'}`} style={{ border: i === rd ? '1px solid rgba(251,191,36,0.4)' : '1px solid transparent' }} />)}</div>

        {/* ── BADGES (mode info) ── */}
        <div className="flex justify-center gap-1.5 mb-0.5">
            {modeConfig.speedBonus && <span className="text-[6px] font-black text-amber-400 font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}><BoltIcon size={6} color="#eab308" /> BLITZ {sel === null && tl > 0 ? `${spd(tl)}x` : ''}</span>}
            {modeConfig.betting && <span className="text-[6px] font-black text-purple-400 font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>{bet} XP</span>}
            {modeConfig.lives && <span className="text-[6px] font-black text-red-400 font-mono px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>♥ {lives}</span>}
        </div>

        {/* ── QUESTION AREA ── */}
        <div className="flex-1 px-3 flex flex-col justify-start overflow-y-auto pt-1" style={{ paddingBottom: 12 }}>
            <AnimatePresence mode="wait"><motion.div key={rd} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className={`${gc} mb-2`} style={{ ...G, borderLeft: `3px solid ${qColors[q.type || 'mcq']}` }}>
                <p className="text-[8px] font-extrabold font-mono tracking-widest mb-1" style={{ color: qColors[q.type || 'mcq'] }}>{{ mcq: '// QUESTION', debug: '// DEBUG', complete: '// COMPLETE', trace: '// TRACE', algo: '// COMPLEXITY' }[q.type || 'mcq']}</p>
                <p className={`text-sm font-black leading-relaxed ${decrypting ? 'text-emerald-300' : 'text-white'}`} style={decrypting ? { fontFamily: 'monospace', letterSpacing: '0.05em' } : undefined}>{decText || q.text}</p>
                {q.code && <pre className="mt-2 p-2 rounded-lg text-[10px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(34,197,94,0.1)' }}>{q.code.replace(/\\n/g, '\n')}</pre>}
            </motion.div></AnimatePresence>

            {/* ── ANSWER OPTIONS (stretched to fill void) ── */}
            <div className="flex-1 flex flex-col gap-1.5 justify-end pb-1">{q.options.map((opt, i) => {
                const ok = i === q.correct, ch = i === sel; let stl = { ...G }
                if (sel !== null && ok) stl = { background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.35)', boxShadow: '0 0 12px rgba(20,184,166,0.15)' }
                else if (ch && !ok) stl = { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', boxShadow: '0 0 12px rgba(239,68,68,0.15)' }
                return <motion.button key={`${rd}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 + i * .05 }} onClick={() => answer(i)} disabled={sel !== null}
                    className={`w-full text-left px-4 py-3.5 rounded-xl font-extrabold text-[12px] text-white transition-all flex items-center min-h-[48px] ${sel === null ? 'cursor-pointer active:scale-[0.98]' : ''}`} style={stl}>
                    <span className="text-slate-500 mr-2 font-black font-mono text-[11px] shrink-0">{String.fromCharCode(65 + i)}.</span><span className="flex-1">{opt}</span>
                </motion.button>
            })}</div>
        </div>

        {/* ── EMOTE BAR (sticky bottom) ── */}
        <div className="shrink-0 px-3 py-2 flex justify-center gap-1.5 border-t border-white/5" style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}>
            {ownEm.slice(0, 4).map(e => <motion.button key={e.id} whileTap={{ scale: .85 }} onClick={() => { setSEmote(e.label); S.pop(); setTimeout(() => setSEmote(null), 2500) }}
                className="h-7 rounded-lg text-[8px] font-black px-2.5 cursor-pointer font-mono" style={{ ...G, color: e.color, borderColor: e.color + '30' }}>{e.label}</motion.button>)}
        </div>
    </motion.div>
}

function FEmote({ emoji, from }) { return <motion.div initial={{ opacity: 0, y: 0, x: from === 'left' ? -50 : 50, scale: .3 }} animate={{ opacity: [0, 1, 1, 0], y: -60, x: 0, scale: [.3, 1.3, 1, .8] }} transition={{ duration: 2 }} className="text-center mb-1"><span className="text-lg font-black inline-block px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>{emoji}</span></motion.div> }

/* ════════════════ RESULT ════════════════ */
function Result({ data, onAnalytics, onBack }) {
    const { opponent, result, mode } = data, { won, yourScore, theirScore } = result
    const [reward, setReward] = useState(null), [confetti, setConfetti] = useState(false)
    useEffect(() => { const r = saveDuelResult({ won, yourScore, theirScore, opponent, totalTimeMs: result.totalTimeMs, mode, roundDetails: result.roundDetails || [] }); setReward(r); won ? S.win() : S.lose(); if (won) { setConfetti(true); setTimeout(() => setConfetti(false), 4000) }; showXP(r.xpGain) }, [])
    if (!reward) return null
    const cel = reward.celebration

    return <div className="h-full flex flex-col items-center justify-center px-8 gap-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: won ? 'radial-gradient(circle at 50% 40%,rgba(251,191,36,0.12),transparent 65%)' : 'radial-gradient(circle at 50% 40%,rgba(239,68,68,0.08),transparent 65%)' }} />
        {confetti && <Confetti />}
        {cel && <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ type: 'spring' }}><span className="text-lg font-black px-4 py-1 rounded-full inline-block" style={{ color: cel.color, background: cel.color + '22', border: `2px solid ${cel.color}44`, boxShadow: `0 0 20px ${cel.color}30` }}>{cel.title}</span></motion.div>}
        {/* Trophy with massive glow */}
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="relative">
            {won && <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-[-20px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(251,191,36,0.35),transparent 70%)', filter: 'blur(12px)' }} />}
            {!won && <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-[-16px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(239,68,68,0.25),transparent 70%)', filter: 'blur(10px)' }} />}
            {won ? <TrophyIcon size={72} /> : <ShieldIcon size={72} tier="bronze" />}
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className={`text-3xl font-black ${won ? 'text-amber-400' : 'text-red-400'}`} style={{ textShadow: won ? '0 0 40px rgba(251,191,36,0.4)' : '0 0 20px rgba(239,68,68,0.3)', letterSpacing: '0.05em' }}>{won ? t('VICTORY!') : t('DEFEAT')}</motion.h2>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="flex items-center gap-8">
            <div className="text-center relative">
                {won && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-[-8px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(20,184,166,0.3),transparent)', filter: 'blur(8px)' }} />}
                <OtterMascot size={56} tier={getLeagueTier()} /><p className="text-2xl font-black text-teal-400 mt-1">{yourScore}</p>
            </div>
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl font-black text-slate-600">—</motion.span>
            <div className="text-center relative">
                {!won && <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-[-8px] rounded-full" style={{ background: 'radial-gradient(circle,rgba(239,68,68,0.3),transparent)', filter: 'blur(8px)' }} />}
                <OtterMascot size={56} bodyColor={opponent.otterColor} /><p className="text-2xl font-black text-red-400 mt-1">{theirScore}</p>
            </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }} className="flex items-center gap-2 flex-wrap justify-center">
            <Chip label={`+${reward.xpGain} XP`} color="#fbbf24" />{reward.gemGain > 0 && <Chip label={`+${reward.gemGain} Gem`} color="#14b8a6" />}<Chip label={`${reward.eloChange > 0 ? '+' : ''}${reward.eloChange} ELO`} color={reward.eloChange > 0 ? '#34d399' : '#f87171'} />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }} className="text-[10px] font-bold text-slate-600">ELO: <span className="text-white font-black">{reward.newElo}</span> • {reward.tier.name} • {reward.title.name}</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex gap-3 w-full max-w-[320px]">
            <button onClick={onAnalytics} className="flex-1 py-3 rounded-xl font-black text-xs text-slate-300 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700/50 active:scale-[0.97] transition-all" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}><ChartIcon size={12} />{t('Analysis')}</button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl font-black text-xs text-white bg-teal-500 border-b-[4px] border-teal-700 active:border-b-[1px] active:translate-y-[3px] transition-all cursor-pointer">{t('BACK TO ARENA')}</button>
        </motion.div>
    </div>
}
function Chip({ label, color }) { return <div className="rounded-lg px-2.5 py-1" style={{ background: color + '18', border: `1px solid ${color}50` }}><span className="text-[10px] font-black" style={{ color }}>{label}</span></div> }

/* ════════════════ ANALYTICS ════════════════ */
function Analytics({ data, onBack }) {
    const det = data.result.roundDetails || []
    return <div className="h-full overflow-y-auto pb-24" style={{ paddingTop: 'max(16px,env(safe-area-inset-top,16px))' }}>
        <div className="max-w-md mx-auto px-4 space-y-4">
            <div className="text-center flex flex-col items-center"><ChartIcon size={20} /><h2 className="text-lg font-black text-white mt-1">{t('Match Analysis')}</h2><p className="text-[10px] font-bold text-slate-500">{det.filter(d => d.correct).length}/{det.length} {t('correct')} • {Math.round((data.result.totalTimeMs || 0) / 1000)}s</p></div>
            {det.map((d, i) => <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .1 }} className={gc} style={{ ...G, borderLeft: `3px solid ${d.correct ? '#34d399' : '#f87171'}` }}>
                <div className="flex items-center gap-2 mb-1"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${d.correct ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{i + 1}</span><span className={`text-[10px] font-black ${d.correct ? 'text-emerald-400' : 'text-red-400'}`}>{d.correct ? t('Correct') : t('Wrong')}</span><span className="text-[9px] font-bold text-slate-600 ml-auto">{d.timeUsed}s</span>{d.speedBonus && d.speedBonus > 1 && <span className="text-[8px] font-black text-amber-400">{d.speedBonus}x</span>}</div>
                <p className="text-[10px] font-bold text-slate-400 truncate">{d.question}</p>
            </motion.div>)}
            <button onClick={onBack} className="w-full py-3 rounded-xl font-black text-sm text-white bg-teal-500 border-b-[4px] border-teal-700 active:border-b-[1px] active:translate-y-[3px] transition-all cursor-pointer">{t('BACK TO ARENA')}</button>
        </div>
    </div>
}
