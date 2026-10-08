import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile, stats } from '../data'

/* ═══════════════════════════════════════════
   MORE VIEW — Settings, Stats, About
   ═══════════════════════════════════════════ */
export default function MoreView() {
    return (
        <div className="h-full overflow-y-auto pb-24">
            <div className="max-w-md mx-auto px-4 space-y-4"
                style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-black text-white pt-2">More</h1>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">Settings & insights</p>
                </motion.div>

                {/* Quick Stats Overview */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="rounded-2xl p-5 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
                    <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase mb-4">Learning Summary</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <StatBubble emoji="📚" value="142" label="Lessons" />
                        <StatBubble emoji="⏱️" value="38h" label="Total Time" />
                        <StatBubble emoji="✅" value="87%" label="Accuracy" />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                        <StatBubble emoji="🔥" value={`${stats.streak}`} label="Streak" />
                        <StatBubble emoji="💎" value={`${stats.gems}`} label="Gems" />
                        <StatBubble emoji="⚡" value={`${stats.energy}`} label="Energy" />
                    </div>
                </motion.div>

                {/* Weekly Activity */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl p-5 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
                    <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase mb-4">This Week</h3>
                    <WeeklyChart />
                </motion.div>

                {/* Settings */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase mb-3">Settings</h3>
                    <div className="space-y-2">
                        <SettingRow icon="🔔" label="Notifications" type="toggle" defaultOn={true} />
                        <SettingRow icon="🌙" label="Dark Mode" type="toggle" defaultOn={true} />
                        <SettingRow icon="📳" label="Haptic Feedback" type="toggle" defaultOn={true} />
                        <SettingRow icon="🔊" label="Sound Effects" type="toggle" defaultOn={false} />
                        <SettingRow icon="🌍" label="Language" type="value" value="English" />
                        <SettingRow icon="🐍" label="Learning Path" type="value" value="Python" />
                    </div>
                </motion.div>

                {/* About */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="text-[11px] font-extrabold text-slate-500 tracking-widest uppercase mb-3">About</h3>
                    <div className="space-y-2">
                        <SettingRow icon="📖" label="Terms of Service" type="arrow" />
                        <SettingRow icon="🔒" label="Privacy Policy" type="arrow" />
                        <SettingRow icon="💬" label="Send Feedback" type="arrow" />
                        <SettingRow icon="⭐" label="Rate Rheo" type="arrow" />
                    </div>
                    <div className="text-center py-4">
                        <p className="text-[10px] font-bold text-slate-600">Rheo v2.0 • Made with 🦦 by Furkan & Arda</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function StatBubble({ emoji, value, label }) {
    return (
        <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-700/20 border-b-[2px] border-b-slate-950 text-center">
            <div className="text-lg mb-0.5">{emoji}</div>
            <p className="text-sm font-black text-white">{value}</p>
            <p className="text-[8px] font-bold text-slate-600">{label}</p>
        </div>
    )
}

function WeeklyChart() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const values = [45, 30, 60, 20, 55, 80, 35]
    const max = Math.max(...values)
    const today = new Date().getDay()
    const todayIdx = today === 0 ? 6 : today - 1

    return (
        <div className="flex items-end justify-between gap-2 h-24">
            {days.map((day, i) => {
                const height = (values[i] / max) * 100
                const isToday = i === todayIdx
                return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div
                            initial={{ height: 0 }} animate={{ height: `${height}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                            className={`w-full rounded-lg ${isToday ? 'bg-teal-500' : 'bg-slate-700'}`}
                            style={{ minHeight: 4 }}>
                            {isToday && (
                                <div className="w-full h-[3px] rounded-t-lg bg-white/20 mt-[1px]" />
                            )}
                        </motion.div>
                        <span className={`text-[8px] font-extrabold ${isToday ? 'text-teal-400' : 'text-slate-600'}`}>{day}</span>
                    </div>
                )
            })}
        </div>
    )
}

function SettingRow({ icon, label, type, value, defaultOn }) {
    const [on, setOn] = useState(defaultOn ?? false)

    return (
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 bg-slate-800 border border-slate-700/30 border-b-[3px] border-b-slate-950">
            <span className="text-lg">{icon}</span>
            <span className="flex-1 text-sm font-extrabold text-white">{label}</span>
            {type === 'toggle' && (
                <button onClick={() => setOn(!on)}
                    className={`w-12 h-7 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-200 ${on ? 'bg-teal-500' : 'bg-slate-700'}`}>
                    <motion.div animate={{ x: on ? 18 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
            )}
            {type === 'value' && (
                <span className="text-xs font-bold text-slate-500">{value}</span>
            )}
            {type === 'arrow' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            )}
        </div>
    )
}
