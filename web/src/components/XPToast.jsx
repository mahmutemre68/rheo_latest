import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '../data'

/* ═══════════════════════════════════════════
   XP TOAST + ACHIEVEMENT — floating notifications
   ═══════════════════════════════════════════ */

let _setToasts = null
let _setLevelUp = null
let _setAchievement = null

export function showXP(amount) {
    _setToasts?.(prev => [...prev, { id: Date.now(), amount }])
}

export function showLevelUp(level) {
    _setLevelUp?.({ level, show: true })
}

export function showAchievement(icon, title, desc) {
    _setAchievement?.({ icon, title, desc, show: true })
}

export default function XPToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const [levelUp, setLevelUp] = useState({ level: 0, show: false })
    const [achievement, setAchievement] = useState({ icon: '', title: '', desc: '', show: false })

    useEffect(() => {
        _setToasts = setToasts
        _setLevelUp = setLevelUp
        _setAchievement = setAchievement
        window.__showXP = showXP
        window.__showLevelUp = showLevelUp
        window.__showAchievement = showAchievement
        return () => { _setToasts = null; _setLevelUp = null; _setAchievement = null }
    }, [])

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <>
            {children}

            {/* Floating XP Toasts */}
            <div className="fixed top-[60px] right-4 z-[100] flex flex-col gap-2 pointer-events-none"
                style={{ top: 'max(60px, calc(env(safe-area-inset-top, 16px) + 44px))' }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <XPToast key={toast.id} amount={toast.amount} onDone={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Achievement Toast */}
            <AnimatePresence>
                {achievement.show && (
                    <AchievementToast {...achievement} onDone={() => setAchievement(a => ({ ...a, show: false }))} />
                )}
            </AnimatePresence>

            {/* Level Up Celebration */}
            <AnimatePresence>
                {levelUp.show && (
                    <LevelUpCelebration level={levelUp.level} onDone={() => setLevelUp({ level: 0, show: false })} />
                )}
            </AnimatePresence>
        </>
    )
}

function XPToast({ amount, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2000)
        return () => clearTimeout(t)
    }, [onDone])

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2.5 border-b-[3px] border-slate-950 shadow-lg pointer-events-auto">
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5 }}
                className="text-lg">⭐</motion.div>
            <span className="text-sm font-black text-amber-400">+{amount} XP</span>
        </motion.div>
    )
}

/* ═══════════════ ACHIEVEMENT TOAST ═══════════════ */
function AchievementToast({ icon, title, desc, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 4000)
        return () => clearTimeout(t)
    }, [onDone])

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={onDone}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[180] cursor-pointer"
            style={{ top: 'max(16px, env(safe-area-inset-top, 16px))' }}>
            <div className="flex items-center gap-3 bg-slate-800 rounded-2xl px-5 py-4 border-2 border-amber-500/30 border-b-[5px] border-b-slate-950 shadow-2xl min-w-[280px]"
                style={{ boxShadow: '0 0 40px rgba(245,158,11,0.15)' }}>
                {/* Gold badge ring */}
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-b-[3px] border-amber-800 flex items-center justify-center shrink-0">
                    <span className="text-xl">{icon}</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-extrabold text-amber-400/70 tracking-widest uppercase">{t('Achievement Unlocked')}</p>
                    <p className="text-sm font-black text-white truncate">{title}</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">{desc}</p>
                </div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: 2 }}
                    className="text-lg">🏆</motion.div>
            </div>
        </motion.div>
    )
}

/* ═══════════════ LEVEL UP CELEBRATION ═══════════════ */
function LevelUpCelebration({ level, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 4000)
        return () => clearTimeout(t)
    }, [onDone])

    const confettiColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#FF85A2', '#58CC02']
    const confetti = Array.from({ length: 30 }, (_, i) => ({
        id: i, x: Math.random() * 100, delay: Math.random() * 0.5,
        color: confettiColors[i % confettiColors.length],
        size: 6 + Math.random() * 6, rotation: Math.random() * 360,
    }))

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onDone} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 cursor-pointer">
            {confetti.map(c => (
                <motion.div key={c.id}
                    initial={{ y: -50, x: `${c.x}vw`, opacity: 1, rotate: 0 }}
                    animate={{ y: '100vh', opacity: 0, rotate: c.rotation + 720 }}
                    transition={{ duration: 2 + Math.random(), delay: c.delay, ease: 'easeOut' }}
                    className="fixed top-0" style={{ left: `${c.x}%` }}>
                    <div style={{ width: c.size, height: c.size, backgroundColor: c.color, borderRadius: c.size > 8 ? '50%' : '2px' }} />
                </motion.div>
            ))}
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex flex-col items-center gap-4">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}
                    className="w-28 h-28 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center border-b-[6px] border-amber-800 shadow-2xl">
                    <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center border-2 border-amber-300/30">
                        <span className="text-4xl font-black text-white">{level}</span>
                    </div>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-2xl font-black text-white text-center">{t('LEVEL UP!')}</h2>
                    <p className="text-sm font-bold text-amber-300 text-center mt-1">{t('You reached Level')} {level}</p>
                </motion.div>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                    className="flex gap-3">
                    <div className="rounded-xl px-3 py-1.5 bg-slate-800 border-b-[2px] border-slate-950">
                        <span className="text-xs font-black text-teal-400">+50 💎</span>
                    </div>
                    <div className="rounded-xl px-3 py-1.5 bg-slate-800 border-b-[2px] border-slate-950">
                        <span className="text-xs font-black text-amber-400">+5 ⚡</span>
                    </div>
                </motion.div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="text-[10px] font-bold text-slate-500 mt-2">{t('Tap anywhere to continue')}</motion.p>
            </motion.div>
        </motion.div>
    )
}
