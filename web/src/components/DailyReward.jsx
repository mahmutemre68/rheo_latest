import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stats, saveProgress, addXP, isHapticEnabled, t } from '../data'
import { showXP } from './XPToast'
import { haptic } from '../nativeBridge'

/* ═══════════════════════════════════════════
   DAILY REWARD — Real 7-day calendar with localStorage persistence
   ═══════════════════════════════════════════ */

const REWARD_DEFS = [
    { day: 1, emoji: '💎', label: '10 Gems', type: 'gems', amount: 10 },
    { day: 2, emoji: '⚡', label: '5 Energy', type: 'energy', amount: 5 },
    { day: 3, emoji: '💎', label: '20 Gems', type: 'gems', amount: 20 },
    { day: 4, emoji: '⭐', label: '50 XP', type: 'xp', amount: 50 },
    { day: 5, emoji: '💎', label: '30 Gems', type: 'gems', amount: 30 },
    { day: 6, emoji: '⚡', label: '10 Energy', type: 'energy', amount: 10 },
    { day: 7, emoji: '🎁', label: 'Mystery Box', type: 'mystery', amount: 0, special: true },
]

function getTodayStr() { return new Date().toDateString() }

function getDailyState() {
    try {
        const raw = localStorage.getItem('rheo_daily_state')
        if (raw) return JSON.parse(raw)
    } catch (e) { }
    return null
}

function saveDailyState(state) {
    try { localStorage.setItem('rheo_daily_state', JSON.stringify(state)) } catch (e) { }
}

function initDailyState() {
    const existing = getDailyState()
    const todayStr = getTodayStr()
    if (existing) {
        // Check if streak is broken (more than 1 day gap)
        const lastDate = new Date(existing.lastClaimDate)
        const today = new Date()
        // Use UTC dates to avoid timezone issues
        const lastUTC = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        const diffDays = Math.floor((todayUTC - lastUTC) / (1000 * 60 * 60 * 24))
        if (diffDays > 1) {
            // Streak broken — reset to day 1
            return { currentDay: 1, lastClaimDate: null, claimedToday: false }
        }
        // Check if already claimed today
        const claimedToday = existing.lastClaimDate === todayStr
        return { ...existing, claimedToday }
    }
    // First time — start from day 1
    return { currentDay: 1, lastClaimDate: null, claimedToday: false }
}

export default function DailyReward({ onClose }) {
    const [state, setState] = useState(initDailyState)
    const [justClaimed, setJustClaimed] = useState(false)
    const [mysteryReward, setMysteryReward] = useState(null)

    const { currentDay, claimedToday } = state
    const canClaim = !claimedToday && !justClaimed

    const handleClaim = () => {
        if (!canClaim) return
        setJustClaimed(true)
        if (isHapticEnabled()) haptic('success')

        const reward = REWARD_DEFS[currentDay - 1]
        let rewardMsg = reward.label

        // Apply reward to stats
        if (reward.type === 'gems') {
            stats.gems = (stats.gems || 0) + reward.amount
        } else if (reward.type === 'energy') {
            stats.energy = (stats.energy || 0) + reward.amount
        } else if (reward.type === 'xp') {
            addXP(reward.amount)
        } else if (reward.type === 'mystery') {
            // Random mystery reward
            const options = [
                { type: 'gems', amount: 50, label: '50 Gems 💎' },
                { type: 'xp', amount: 100, label: '100 XP ⭐' },
                { type: 'energy', amount: 25, label: '25 Energy ⚡' },
            ]
            const pick = options[Math.floor(Math.random() * options.length)]
            if (pick.type === 'gems') stats.gems = (stats.gems || 0) + pick.amount
            else if (pick.type === 'energy') stats.energy = (stats.energy || 0) + pick.amount
            else if (pick.type === 'xp') addXP(pick.amount)
            rewardMsg = pick.label
            setMysteryReward(pick.label)
        }

        // Persist the advanced day for tomorrow, but keep the just-claimed day
        // shown as claimed in the UI (advancing currentDay now would incorrectly
        // mark the next day's tile as ✅).
        const nextDay = currentDay >= 7 ? 1 : currentDay + 1
        setState(s => ({ ...s, claimedToday: true }))
        saveDailyState({
            currentDay: nextDay,
            lastClaimDate: getTodayStr(),
            claimedToday: true,
        })
        saveProgress() // Persist gems/energy
        try { localStorage.setItem('rheo_last_daily', getTodayStr()) } catch (e) { }

        setTimeout(onClose, 1800)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-6"
            onClick={onClose}>

            <motion.div
                initial={{ scale: 0.7, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl overflow-hidden bg-slate-800 border-2 border-slate-700/40 border-b-[6px] border-b-slate-950">

                {/* Header */}
                <div className="text-center pt-6 pb-4 px-5">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 1, repeat: 2 }}
                        className="text-4xl mb-2">🎉</motion.div>
                    <h2 className="text-xl font-black text-white">{t('Daily Reward')}</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">{t('Come back every day for bigger prizes!')}</p>
                </div>

                {/* 7-day calendar */}
                <div className="px-5 pb-3">
                    <div className="grid grid-cols-7 gap-1.5">
                        {REWARD_DEFS.map((r, i) => {
                            const dayNum = r.day
                            const isToday = dayNum === currentDay && canClaim
                            const isClaimed = dayNum < currentDay || (dayNum === currentDay && !canClaim)
                            const isFuture = dayNum > currentDay

                            return (
                                <motion.div key={r.day}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.05 }}
                                    className={`rounded-xl py-2.5 flex flex-col items-center gap-1 border-b-[3px] relative
                                        ${isToday ? 'bg-amber-500/20 border-amber-700 border border-amber-500/40 ring-2 ring-amber-400/30'
                                            : isClaimed ? 'bg-teal-500/10 border-teal-900/40 border border-teal-700/20'
                                                : r.special ? 'bg-purple-500/10 border-purple-900/40 border border-purple-700/20'
                                                    : 'bg-slate-900/60 border-slate-950 border border-slate-700/10'}`}>
                                    <span className="text-[8px] font-black text-slate-500">DAY {r.day}</span>
                                    <span className={`text-lg ${!isToday && !isClaimed && !r.special ? 'opacity-30' : ''}`}>
                                        {isClaimed ? '✅' : r.emoji}
                                    </span>
                                    <span className={`text-[7px] font-bold leading-tight text-center ${isClaimed ? 'text-teal-500' : isToday ? 'text-amber-300' : 'text-slate-600'}`}>
                                        {r.label}
                                    </span>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Claim / Already claimed */}
                <div className="px-5 pb-5 pt-2">
                    {canClaim ? (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClaim}
                            className="w-full py-3.5 rounded-2xl font-black text-base text-white bg-amber-500 border-b-[5px] border-amber-700 active:border-b-[1px] active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            🎁 {t('COLLECT REWARD')}
                        </motion.button>
                    ) : justClaimed ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="text-center py-3">
                            <span className="text-lg font-black text-teal-400">
                                ✅ {mysteryReward ? `${t('You got')} ${mysteryReward}!` : t('Claimed!')}
                            </span>
                        </motion.div>
                    ) : (
                        <div className="text-center py-3">
                            <span className="text-sm font-black text-slate-500">✅ {t('Already claimed today!')}</span>
                            <p className="text-[10px] font-bold text-slate-600 mt-1">{t('Come back tomorrow for Day')} {currentDay}!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}
