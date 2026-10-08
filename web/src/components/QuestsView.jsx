import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quests, stats, mascotMessages, getStreakMultiplier, t, updateQuestProgress, saveProgress, isHapticEnabled, addXP, getMysteryProgress } from '../data'
import { showAchievement } from './XPToast'

/* ═══════════════════════════════════════════
   QUESTS VIEW — soft, matte, Duolingo-inspired
   ═══════════════════════════════════════════ */
export default function QuestsView() {
    return (
        <div className="h-full overflow-y-auto pb-24">
            <div className="max-w-md mx-auto px-4 space-y-4"
                style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>
                <QuestsHeader />
                <MonthlyQuest data={quests.monthly} />
                <WeeklyBuildChallenge data={quests.weeklyBuild} />
                <MysteryQuest data={quests.mysteryQuest} />
                <WeekendChallenge data={quests.weekend} />
                <DailyQuests tasks={quests.daily} />
            </div>
        </div>
    )
}

/* ═══════════════ HEADER ═══════════════ */
function QuestsHeader() {
    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-1 pb-1">
            <div>
                <h1 className="text-2xl font-black text-white">{t('Quests')}</h1>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{t('Complete tasks to earn rewards')}</p>
            </div>
            <div className="flex items-center gap-2">
                {getStreakMultiplier().label && (
                    <div className="flex items-center gap-1 bg-slate-800 rounded-xl px-2.5 py-1.5 border-b-[3px] border-slate-900">
                        <span className="text-sm">🔥</span>
                        <span className="text-xs font-black text-orange-300">{getStreakMultiplier().label}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 bg-slate-800 rounded-xl px-3 py-2 border-b-[3px] border-slate-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#5EEAD4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    <span className="text-sm font-black text-teal-300">{stats.xpToday} XP</span>
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════ MONTHLY ═══════════════ */
function MonthlyQuest({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative overflow-hidden rounded-2xl bg-slate-800 border-2 border-slate-700/30 border-b-[6px] border-b-slate-950">
                {/* Soft warm accent strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-rose-400/70 to-amber-400/70" />

                <div className="absolute -top-[2px] right-[16px] z-[1]" style={{ maxHeight: '70px', overflow: 'hidden' }}><FullOtterMascot /></div>
                <div className="p-5 pt-4 relative z-[5]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-white pr-12">{t(data.title)}</h2>
                        <div className="flex items-center gap-1.5 bg-slate-700 rounded-full px-3 py-1.5 border-b-[2px] border-slate-800">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[11px] font-extrabold text-slate-400">{data.daysLeft} {t('days left')}</span>
                        </div>
                    </div>
                    <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-700/30">
                        <p className="text-white font-extrabold text-sm mb-3">{t(data.task)}</p>
                        <CylindricalBar current={data.current} total={data.total} color="#F9A826" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════ WEEKLY BUILD ═══════════════ */
function WeeklyBuildChallenge({ data }) {
    const [tasks, setTasks] = useState(data.tasks)
    const doneTasks = tasks.filter(t => t.done).length

    const toggleTask = (taskId) => {
        const task = tasks.find(t => t.id === taskId)
        if (!task || task.done) return
        updateQuestProgress('weeklyBuild', taskId, true)
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t))
        addXP(50)
        try { if (isHapticEnabled()) navigator.vibrate?.(20) } catch (e) { }
        // Check if all done
        const newDone = tasks.filter(t => t.done).length + 1
        if (newDone === tasks.length) {
            showAchievement('🏗️', 'Weekly Build Complete!', `+${data.reward.amount} XP`)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">{t('Weekly Build Challenge')}</h3>
                <span className="text-[10px] font-bold text-slate-600">🏗️ {data.daysLeft} {t('days left')}</span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/30 border-b-[5px] border-b-slate-950">
                {/* Soft blue accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-sky-400/50 to-indigo-400/50" />

                <div className="p-4 border-b border-slate-700/20">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-700 border-b-[3px] border-slate-800 flex items-center justify-center text-lg">
                            {data.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black text-white">{t(data.title)}</h3>
                            <p className="text-[10px] font-bold text-slate-500">{t(data.desc)}</p>
                        </div>
                    </div>
                </div>

                <div className="p-3.5 space-y-2">
                    {tasks.map((task, i) => (
                        <motion.button key={task.id} whileTap={{ scale: 0.97 }}
                            onClick={() => toggleTask(task.id)}
                            disabled={task.done}
                            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all cursor-pointer
                                ${task.done ? 'bg-slate-700/30' : 'bg-slate-900/40 hover:bg-slate-800/60 active:scale-[0.98]'} border border-slate-700/20`}>
                            <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border-b-[2px] ${task.done ? 'bg-teal-600/80 border-teal-800' : 'bg-slate-700 border-slate-800'}`}>
                                {task.done ? (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                ) : (
                                    <span className="text-[7px] font-black text-slate-400">{i + 1}</span>
                                )}
                            </div>
                            <span className={`text-xs font-bold text-left ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{t(task.step)}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="px-3.5 pb-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold text-slate-600">{doneTasks}/{tasks.length} {t('Steps')}</span>
                        <span className="text-[10px] font-black text-amber-300/80">🏆 {data.reward.amount} XP</span>
                    </div>
                    <CylindricalBar current={doneTasks} total={tasks.length} color="#5B9BD5" />
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════ MYSTERY QUEST ═══════════════ */
function MysteryQuest({ data }) {
    const [revealed, setRevealed] = useState(data.revealed)
    const [completed, setCompleted] = useState(data.completed)
    const [progress, setProgress] = useState(() => getMysteryProgress())

    // Poll progress every 3 seconds when revealed
    useEffect(() => {
        if (!revealed || completed) return
        const interval = setInterval(() => {
            const p = getMysteryProgress()
            setProgress(p)
            // Auto-complete when progress reaches 1 (for single-event quests)
            if (p >= 1 && !completed) {
                handleComplete()
            }
        }, 3000)
        return () => clearInterval(interval)
    }, [revealed, completed])

    const handleReveal = () => {
        setRevealed(true)
        updateQuestProgress('mystery', null, false)
        try { if (isHapticEnabled()) navigator.vibrate?.(30) } catch (e) { }
    }

    const handleComplete = () => {
        if (completed) return
        setCompleted(true)
        updateQuestProgress('mystery', null, true)
        const gemReward = parseInt(data.hidden.reward) || 15
        stats.gems = (stats.gems || 0) + gemReward
        addXP(data.hidden.xp)
        showAchievement('✨', t('Mystery Quest Complete!'), `+${data.hidden.xp} XP, ${data.hidden.reward}`)
        saveProgress()
        try { if (isHapticEnabled()) navigator.vibrate?.(40) } catch (e) { }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">{t('Mystery Quest')}</h3>
                <span className="text-[10px] font-bold text-slate-600">🎁 {t('1/day')}</span>
            </div>

            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.button key="hidden" exit={{ scale: 0.8, opacity: 0 }}
                        onClick={handleReveal}
                        className="w-full rounded-2xl p-6 bg-slate-800 border-2 border-slate-700/30 border-b-[5px] border-b-slate-950 cursor-pointer active:translate-y-[4px] active:border-b-0 transition-all duration-75 text-center">
                        <div className="text-3xl mb-2 opacity-80">🎁</div>
                        <p className="text-sm font-black text-slate-300">{t('TAP TO REVEAL')}</p>
                        <p className="text-[10px] font-bold text-slate-600 mt-1">{t('A mystery quest awaits...')}</p>
                    </motion.button>
                ) : (
                    <motion.div key="revealed" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/30 border-b-[5px] border-b-slate-950">
                        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400/50 to-orange-400/50" />
                        <div className="p-5 text-center">
                            <div className="text-2xl mb-2 opacity-80">{completed ? '✅' : '✨'}</div>
                            <p className={`text-sm font-black mb-1 ${completed ? 'text-slate-500 line-through' : 'text-white'}`}>{t(data.hidden.task)}</p>
                            {/* Real-time progress indicator */}
                            {revealed && !completed && progress > 0 && (
                                <div className="mt-2 mb-1">
                                    <p className="text-[9px] font-black text-teal-400">🔄 {t('Progress')}: {progress} {t('tracked')}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <div className="flex items-center gap-1 bg-slate-700/50 rounded-full px-3 py-1 border border-slate-600/30">
                                    <span className="text-[10px] font-black text-amber-300/80">+{data.hidden.xp} XP</span>
                                </div>
                                <div className="flex items-center gap-1 bg-slate-700/50 rounded-full px-3 py-1 border border-slate-600/30">
                                    <span className="text-[10px] font-black text-sky-300/80">{data.hidden.reward}</span>
                                </div>
                            </div>
                            {!completed && progress >= 1 && (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={handleComplete}
                                    className="mt-4 px-6 py-2.5 rounded-xl font-black text-xs text-white bg-teal-500 border-b-[3px] border-teal-700 active:border-b-0 active:translate-y-[3px] transition-all duration-75 cursor-pointer">
                                    {t('COLLECT REWARD')} ✨
                                </motion.button>
                            )}
                            {!completed && progress < 1 && (
                                <p className="mt-3 text-[9px] font-bold text-slate-600">{t('Complete the task above to earn rewards')}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

/* ═══════════════ WEEKEND ═══════════════ */
function WeekendChallenge({ data }) {
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">{t('Weekend Hackathon')}</h3>
                <span className="text-[10px] font-bold text-slate-600">⏱ {data.hoursLeft} HRS</span>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700/30 border-b-[6px] border-b-slate-950">
                <div className="h-32 relative bg-slate-900/60 overflow-hidden">
                    {/* Subtle binary rain */}
                    {[...Array(14)].map((_, i) => (
                        <div key={i} className="absolute text-slate-700/40 font-mono" style={{
                            fontSize: '7px', left: `${i * 7 + 2}%`, top: `${(i * 19) % 85}%`,
                        }}>{['01', '10', '11', '00', '1', '0', '101', '010'][i % 8]}</div>
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 bg-slate-800/90 border border-slate-600/30 backdrop-blur-sm" style={{ boxShadow: '0 0 30px rgba(94,234,212,0.1)' }}>
                            <span className="text-2xl">💻</span>
                            <span className="text-[7px] font-black text-teal-400 tracking-wider">HACK</span>
                            <div className="flex gap-0.5">{[0, 1, 2].map(j => <div key={j} className="w-1 h-1 rounded-full bg-teal-500/60 animate-pulse" style={{ animationDelay: `${j * 0.3}s` }} />)}</div>
                        </div>
                    </div>
                </div>
                <div className="px-5 py-4">
                    <p className="text-white font-extrabold text-sm mb-3">{t(data.task)}</p>
                    <CylindricalBar current={data.current} total={data.total} color="#5EEAD4" />
                </div>
            </div>
        </motion.div>
    )
}

/* ═══════════════ DAILY ═══════════════ */
function DailyQuests({ tasks }) {
    const loadState = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('rheo_daily_quests') || '{}')
            if (saved.date === new Date().toDateString()) {
                return { date: saved.date, progress: saved.progress || {}, collected: saved.collected || {} }
            }
        } catch (e) { }
        return { date: new Date().toDateString(), progress: {}, collected: {} }
    }
    const [dailyState, setDailyState] = useState(loadState)

    // Auto-refresh quest progress every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => setDailyState(loadState), 5000)
        return () => clearInterval(interval)
    }, [])

    const collectReward = (taskId) => {
        const task = tasks.find(t => t.id === taskId)
        if (!task) return
        // Apply rewards
        if (task.reward === 'chest') { stats.gems = (stats.gems || 0) + 15; addXP(20) }
        else if (task.reward === 'gem') { stats.gems = (stats.gems || 0) + 25 }
        else { addXP(30) }
        saveProgress() // Persist gems
        showAchievement('🎁', t('Quest Reward!'), task.reward === 'gem' ? '+25 💎' : '+20 XP')
        try { if (isHapticEnabled()) navigator.vibrate?.(40) } catch (e) { }

        setDailyState(prev => {
            const next = { ...prev, collected: { ...prev.collected, [taskId]: true } }
            try { localStorage.setItem('rheo_daily_quests', JSON.stringify(next)) } catch (e) { }
            return next
        })
    }

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase">{t('Daily Standup')}</h3>
                <span className="text-[10px] font-bold text-slate-600">{Math.max(0, 24 - new Date().getHours())} HRS</span>
            </div>
            <div className="space-y-3">
                {tasks.map((task, i) => <DailyCard key={task.id} task={task} i={i}
                    progress={dailyState.progress[task.id] || 0}
                    collected={!!dailyState.collected[task.id]}
                    onCollect={() => collectReward(task.id)} />)}
            </div>
        </motion.div>
    )
}

function DailyCard({ task, i, progress, collected, onCollect }) {
    /* Muted, warm icon colors */
    const icons = {
        1: <svg width="20" height="20" viewBox="0 0 24 24" fill="#E8A87C"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" /></svg>,
        2: <svg width="20" height="20" viewBox="0 0 24 24" fill="#7EC8A0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" /></svg>,
        3: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7EB8D8" strokeWidth="2"><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M6 10H2M22 10h-4M8 6l-2-3M16 6l2-3" /><line x1="12" y1="6" x2="12" y2="20" /></svg>,
        4: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8A0D4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" fill="#B8A0D4" /></svg>,
    }
    /* Muted reward colors */
    const rewards = {
        chest: <svg width="24" height="24" viewBox="0 0 32 32"><rect x="6" y="16" width="20" height="10" rx="2" fill="#C5903A" /><path d="M5 18C5 15 9 10 16 10C23 10 27 15 27 18H5Z" fill="#D9A84E" /><rect x="14" y="16" width="4" height="5" rx="1" fill="#8B6B2A" /><circle cx="16" cy="18.5" r="1" fill="#F0D68A" /></svg>,
        disk: <svg width="24" height="24" viewBox="0 0 32 32"><rect x="5" y="5" width="22" height="22" rx="3" fill="#556677" /><rect x="9" y="5" width="14" height="10" rx="1" fill="#7A8A9A" /><rect x="17" y="7" width="4" height="6" rx="0.5" fill="#445566" /><rect x="9" y="19" width="14" height="6" rx="1" fill="#334455" /></svg>,
        gem: <svg width="24" height="24" viewBox="0 0 32 32"><path d="M16 4L6 14L16 28L26 14L16 4Z" fill="#6CACCA" /></svg>,
    }

    const softColors = { '#FB923C': '#D4956A', '#58CC02': '#6AB87A', '#38BDF8': '#6AACCA', '#C084FC': '#A588C4' }
    const current = Math.min(progress, task.total)
    const isComplete = current >= task.total

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.08 }}
            className={`flex items-center gap-3.5 rounded-2xl p-4 bg-slate-800 border-2 border-slate-700/30 border-b-[5px] border-b-slate-950 transition-all duration-75 ${collected ? 'opacity-60' : ''}`}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-slate-900/60 border-b-[2px] border-slate-950">{icons[task.id]}</div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold leading-tight ${collected ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{t(task.task)}</p>
                <div className="mt-2.5"><CylindricalBar current={current} total={task.total} color={softColors[task.color] || task.color} /></div>
            </div>
            {collected ? (
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-teal-500/20 border-b-[2px] border-teal-800">
                    <span className="text-lg">✅</span>
                </div>
            ) : isComplete ? (
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onCollect() }}
                    className="shrink-0 px-3 py-2 rounded-xl font-black text-[10px] text-white bg-amber-500 border-b-[3px] border-amber-700 active:border-b-0 active:translate-y-[3px] transition-all duration-75 cursor-pointer">
                    {t('COLLECT')}
                </motion.button>
            ) : (
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-slate-900/60 border-b-[2px] border-slate-950">{rewards[task.reward]}</div>
            )}
        </motion.div>
    )
}

/* ═══════════════ CYLINDRICAL BAR — matte ═══════════════ */
function CylindricalBar({ current, total, color }) {
    const pct = Math.min(100, Math.max(0, (current / total) * 100))
    return (
        <div className="relative">
            <div className="h-[18px] rounded-full overflow-hidden bg-slate-900/80"
                style={{ boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.4)' }}>
                <div className="h-full rounded-full relative overflow-hidden transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}>
                    {pct > 0 && <div className="absolute top-[2px] left-2 right-2 h-[4px] rounded-full bg-white/20" />}
                    {pct > 0 && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-black/15" />}
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-white/60">{current} / {total}</span>
            </div>
        </div>
    )
}

/* ═══════════════ OTTER ═══════════════ */
function FullOtterMascot() {
    const msg = mascotMessages[1]
    return (
        <div className="relative animate-otter-float">
            <div className="absolute -top-[32px] -left-[24px] animate-bubble-bounce z-20">
                <div className="bg-white rounded-xl px-2 py-1 whitespace-nowrap relative border-b-[2px] border-slate-200">
                    <span className="text-[9px] font-extrabold text-slate-800">{msg}</span>
                    <div className="absolute -bottom-[4px] right-[10px] w-[8px] h-[8px] bg-white rotate-45 rounded-sm" />
                </div>
            </div>
            <div className="relative w-[44px] h-[50px] mt-[6px]">
                <div className="absolute inset-0 rounded-[14px] overflow-hidden bg-teal-700 border-b-[3px] border-teal-900">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[28px] h-[22px] rounded-t-[50%] bg-teal-500" />
                    <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[32px]">
                        <div className="flex justify-center gap-[5px] mb-[1px]">
                            {[0, 1].map(i => (
                                <div key={i} className="w-[7px] h-[8px] rounded-full bg-white relative">
                                    <div className="absolute top-[1px] left-[1px] w-[4px] h-[5px] bg-slate-900 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center"><div className="w-[5px] h-[3px] bg-slate-900 rounded-full" /></div>
                    </div>
                    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2">
                        <div className="w-[8px] h-[4px] border-b-[2px] border-slate-900/50 rounded-b-full" />
                    </div>
                </div>
                <div className="absolute -top-[4px] left-[7px] w-[9px] h-[9px] rounded-full bg-teal-700"><div className="absolute top-[2px] left-[2px] w-[4px] h-[4px] rounded-full bg-teal-500" /></div>
                <div className="absolute -top-[4px] right-[7px] w-[9px] h-[9px] rounded-full bg-teal-700"><div className="absolute top-[2px] right-[2px] w-[4px] h-[4px] rounded-full bg-teal-500" /></div>
                <div className="absolute -bottom-[2px] left-[10px] w-[7px] h-[4px] rounded-b-full bg-teal-800" />
                <div className="absolute -bottom-[2px] right-[10px] w-[7px] h-[4px] rounded-b-full bg-teal-800" />
            </div>
        </div>
    )
}
