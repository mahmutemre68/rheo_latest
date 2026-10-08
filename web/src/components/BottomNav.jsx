import { motion } from 'framer-motion'
import { t, stats, quests, isHapticEnabled } from '../data'
import { haptic } from '../nativeBridge'

// Compute dynamic badge values
function getBadges() {
    const incompleteDailyQuests = quests.daily?.filter(q => {
        try {
            const saved = JSON.parse(localStorage.getItem('rheo_daily_quests') || '{}')
            const progress = saved.progress || {}
            return (progress[q.id] || 0) < q.total
        } catch (e) { return true }
    }).length || 0
    return {
        quests: incompleteDailyQuests > 0 ? incompleteDailyQuests : null,
        league: stats.streak > 0 ? '🔥' : null,
        profile: null,
    }
}

const TABS = [
    { id: 'journey', label: 'Journey', icon: PathIcon },
    { id: 'quests', label: 'Quests', icon: CheckIcon, badgeKey: 'quests' },
    { id: 'league', label: 'League', icon: ShieldIcon, badgeKey: 'league' },
    { id: 'profile', label: 'Profile', icon: UserIcon, badgeKey: 'profile' },
]

export default function BottomNav({ activeTab, onTabChange }) {
    return (
        <nav className="shrink-0 relative" style={{
            background: '#0B1120',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}>
            <div className="flex items-center justify-around h-[60px] relative">
                {TABS.map(tab => {
                    const isActive = tab.id === activeTab
                    const Icon = tab.icon
                    const badges = getBadges()
                    const badge = tab.badgeKey ? badges[tab.badgeKey] : null

                    return (
                        <button
                            key={tab.id}
                            onClick={() => { if (isHapticEnabled()) haptic('selection'); onTabChange(tab.id) }}
                            className={`
                relative flex flex-col items-center justify-center w-16 h-14 rounded-xl
                transition-all duration-150
              `}
                        >
                            {/* Active glow indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute -top-[1px] left-3 right-3 h-[3px] rounded-full"
                                    style={{ background: '#14B8A6' }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon with badge */}
                            <div className="relative">
                                <Icon active={isActive} />
                                {badge && !isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full bg-red-500 border-2 border-[#0B1120] flex items-center justify-center px-0.5">
                                        <span className="text-[8px] font-black text-white leading-none">{badge}</span>
                                    </motion.div>
                                )}
                            </div>
                            <span className={`text-[10px] font-extrabold mt-0.5 ${isActive ? 'text-teal-400' : 'text-slate-500'
                                }`}>
                                {t(tab.label)}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

/* ── Tab Icons (SVG) ── */
function PathIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={active ? '#14B8A6' : '#64748B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h4l3-9 4 18 3-9h4" />
        </svg>
    )
}

function CheckIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={active ? '#14B8A6' : '#64748B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 01-20 0 10 10 0 0120 0z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    )
}

function ShieldIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={active ? '#14B8A6' : '#64748B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
}

function UserIcon({ active }) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={active ? '#14B8A6' : '#64748B'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    )
}
