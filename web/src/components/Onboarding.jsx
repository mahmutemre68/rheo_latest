import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, isHapticEnabled, setDailyXPGoal, addXP } from '../data'
import LivingOtter, { CodeRain } from './LivingOtter'

/* ══════════════════════════════════════════════
   INTERACTIVE ONBOARDING — "First Blood" Bug Hunt
   ══════════════════════════════════════════════ */

// The buggy code — line 2 (index 1) has the bug (missing closing paren)
const BUG_CODE = [
    { text: 'def greet(name):', hasBug: false },
    { text: '    print("Hello " + name', hasBug: true, fixed: '    print("Hello " + name)' },
    { text: '    return True', hasBug: false },
]

const NEON_PARTICLES = ['⚡', '💥', '✦', '🔥', '💎', '⭐']

// Reward for the "First Blood" bug hunt — must match the "+50 XP 🎉" label below
const FIRST_BLOOD_XP = 50

export default function Onboarding({ onFinish }) {
    const [phase, setPhase] = useState('intro') // intro -> hunt -> explosion -> welcome -> goal -> done
    const [foundBug, setFoundBug] = useState(false)
    const [selectedLine, setSelectedLine] = useState(null)
    const [wrongShake, setWrongShake] = useState(null)
    const [particles, setParticles] = useState([])
    const [otterMood, setOtterMood] = useState('idle')

    // Auto-advance from intro
    useEffect(() => {
        if (phase === 'intro') {
            const timer = setTimeout(() => setPhase('hunt'), 2000)
            return () => clearTimeout(timer)
        }
    }, [phase])

    const handleLineClick = useCallback((index) => {
        if (foundBug || phase !== 'hunt') return

        const line = BUG_CODE[index]
        setSelectedLine(index)

        if (line.hasBug) {
            // CORRECT — Bug found!
            setFoundBug(true)
            setOtterMood('celebrate')
            try { if (isHapticEnabled()) navigator.vibrate?.(100) } catch (e) { }

            // Generate explosion particles
            const newParticles = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                emoji: NEON_PARTICLES[Math.floor(Math.random() * NEON_PARTICLES.length)],
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                delay: Math.random() * 0.3,
                scale: 0.5 + Math.random() * 1.5,
            }))
            setParticles(newParticles)

            setTimeout(() => setPhase('explosion'), 400)
            setTimeout(() => setPhase('welcome'), 1800)
        } else {
            // WRONG — shake it
            setWrongShake(index)
            setOtterMood('thinking')
            try { if (isHapticEnabled()) navigator.vibrate?.(30) } catch (e) { }
            setTimeout(() => {
                setWrongShake(null)
                setSelectedLine(null)
                setOtterMood('idle')
            }, 600)
        }
    }, [foundBug, phase])

    const handleWelcomeNext = useCallback(() => {
        setPhase('goal')
    }, [])

    // Goal first, then the XP — so updateDailyXPGoal() measures against the goal
    // the user just picked. FIRST_BLOOD_XP is the "+50 XP 🎉" promised on the
    // welcome screen; without this the reward was shown but never credited.
    const finishOnboarding = useCallback((goalAmount) => {
        setDailyXPGoal(goalAmount)
        addXP(FIRST_BLOOD_XP)
        setPhase('done')
        onFinish()
    }, [onFinish])

    const handleSelectGoal = useCallback((amount) => finishOnboarding(amount), [finishOnboarding])

    const handleSkip = useCallback(() => finishOnboarding(100), [finishOnboarding])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center"
            style={{ background: '#080E1A' }}>

            {/* Code Rain Background */}
            <CodeRain color="#06b6d4" speed={0.6} density={20} opacity={0.08} />

            {/* Explosion Particles */}
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div key={p.id}
                        initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 0, scale: p.scale, x: p.x, y: p.y }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
                        className="fixed z-[260] pointer-events-none"
                        style={{ left: '50%', top: '50%', fontSize: 20 + Math.random() * 16 }}>
                        {p.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="w-full max-w-[430px] h-full flex flex-col relative overflow-hidden">

                {/* ═══ PHASE: INTRO ═══ */}
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.div key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
                            <LivingOtter mood="idle" size={100} showSparkles />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 text-center">
                                <h1 className="text-2xl font-black text-white mb-2">🔍 {t('Bug Detected!')}</h1>
                                <p className="text-sm font-bold text-slate-400">{t('There is a bug in this code. Can you find it?')}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="mt-8 text-xs font-bold text-cyan-500">
                                ● ● ●
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ═══ PHASE: HUNT ═══ */}
                    {phase === 'hunt' && (
                        <motion.div key="hunt"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">

                            {/* Otter Helper */}
                            <motion.div className="mb-4" animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                <LivingOtter mood={otterMood} size={70} />
                            </motion.div>

                            <p className="text-xs font-black text-cyan-400 tracking-wider mb-4">
                                🎯 {t('TAP THE BROKEN LINE')}
                            </p>

                            {/* Code Block */}
                            <div className="w-full max-w-[340px] rounded-2xl bg-slate-900/90 border border-slate-700/40 overflow-hidden backdrop-blur-sm"
                                style={{ boxShadow: '0 0 30px rgba(6,182,212,0.1)' }}>
                                {/* Title bar */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700/30">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                    <span className="text-[9px] font-bold text-slate-500 ml-2">main.py</span>
                                </div>

                                {/* Code Lines */}
                                <div className="px-3 py-3 space-y-0">
                                    {BUG_CODE.map((line, i) => (
                                        <motion.div key={i}
                                            onClick={() => handleLineClick(i)}
                                            animate={wrongShake === i ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                                            transition={wrongShake === i ? { duration: 0.5 } : {}}
                                            className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 group
                                                ${foundBug && line.hasBug
                                                    ? 'bg-emerald-500/15 border border-emerald-500/30'
                                                    : selectedLine === i && !line.hasBug
                                                        ? 'bg-red-500/10 border border-red-500/20'
                                                        : 'hover:bg-slate-800/50 border border-transparent'
                                                }`}>
                                            {/* Line number */}
                                            <span className="text-[10px] font-mono font-bold text-slate-600 w-4 text-right select-none">{i + 1}</span>
                                            {/* Code text */}
                                            <code className={`text-xs font-mono font-bold flex-1 whitespace-pre ${foundBug && line.hasBug ? 'text-emerald-400' : 'text-slate-300'
                                                }`}>
                                                {foundBug && line.hasBug ? line.fixed : line.text}
                                            </code>
                                            {/* Bug indicator */}
                                            {foundBug && line.hasBug && (
                                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                    className="text-emerald-400 text-xs">✅</motion.span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Error hint */}
                                {!foundBug && (
                                    <div className="px-4 py-2 border-t border-slate-700/20">
                                        <p className="text-[9px] font-bold text-red-400/70 font-mono">
                                            SyntaxError: unexpected EOF while parsing
                                        </p>
                                    </div>
                                )}
                                {foundBug && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="px-4 py-2 border-t border-emerald-700/20 bg-emerald-500/5">
                                        <p className="text-[9px] font-bold text-emerald-400 font-mono">
                                            ✓ Fixed! Missing closing parenthesis added.
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Skip button */}
                            {!foundBug && (
                                <button onClick={handleSkip}
                                    className="mt-6 text-[10px] font-bold text-slate-600 cursor-pointer hover:text-slate-400 transition">
                                    {t('Skip')} →
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* ═══ PHASE: EXPLOSION + WELCOME ═══ */}
                    {(phase === 'explosion' || phase === 'welcome') && (
                        <motion.div key="welcome"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">

                            {/* Neon burst background.
                                pointer-events-none is load-bearing: this is an
                                absolutely positioned sibling, so it paints above
                                the in-flow CONTINUE button below it. Without it
                                the burst stays hit-testable at opacity 0 and
                                swallows every tap on that button — leaving a
                                first-time user permanently stuck on this screen. */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 2, 1.6], opacity: [0, 0.3, 0] }}
                                transition={{ duration: 1.5 }}
                                className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
                                style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />

                            <motion.div
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                                <LivingOtter mood="celebrate" size={120} showSparkles />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-center mt-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                                    className="inline-block px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/30 mb-3">
                                    <span className="text-[10px] font-black text-red-400 tracking-wider">🩸 FIRST BLOOD</span>
                                </motion.div>
                                <h1 className="text-2xl font-black mb-2" style={{
                                    background: 'linear-gradient(135deg, #06b6d4, #14b8a6, #22c55e)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {t('Welcome to Rheo, Hacker!')}
                                </h1>
                                <p className="text-sm font-bold text-slate-400 mt-1">
                                    {t('You started your journey by finding your first bug!')}
                                </p>
                                <p className="text-xs font-bold text-teal-500 mt-2">+{FIRST_BLOOD_XP} XP 🎉</p>
                            </motion.div>

                            {phase === 'welcome' && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleWelcomeNext}
                                    className="mt-8 w-full max-w-[280px] py-4 rounded-2xl font-black text-base text-white
                                        border-b-[6px] border-teal-700 active:translate-y-[6px] active:border-b-0
                                        transition-all duration-75 cursor-pointer"
                                    style={{ background: 'linear-gradient(135deg, #06b6d4, #14b8a6)' }}>
                                    🚀 {t("CONTINUE")}
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* ═══ PHASE: GOAL ═══ */}
                    {phase === 'goal' && (
                        <motion.div key="goal"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
                            
                            <h2 className="text-2xl font-black text-white mb-2 text-center">{t('Set your daily goal')}</h2>
                            <p className="text-sm font-bold text-slate-400 mb-8 text-center">{t('How much time do you want to spend learning every day?')}</p>

                            <div className="w-full max-w-[300px] flex flex-col gap-3">
                                {[
                                    { id: 'casual', label: 'Casual', desc: '5 mins/day', xp: 50, emoji: '🚶' },
                                    { id: 'regular', label: 'Regular', desc: '10 mins/day', xp: 100, emoji: '🏃' },
                                    { id: 'hardcore', label: 'Hardcore', desc: '20 mins/day', xp: 200, emoji: '🚀' },
                                ].map(g => (
                                    <motion.button key={g.id}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSelectGoal(g.xp)}
                                        className="relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border-2 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-teal-500/50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{g.emoji}</span>
                                            <div className="text-left">
                                                <div className="text-base font-black text-white">{t(g.label)}</div>
                                                <div className="text-xs font-bold text-slate-400">{t(g.desc)}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-black text-teal-400">{g.xp} XP</div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
