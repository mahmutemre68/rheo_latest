import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HologramCard from './HologramCard'
import { getActivityGrid, getOverallAbility, getAbilityBySkill, getBand, getBandProgress, profile, stats, getSkillRadar, achievements, otterCostumes, journeyPowerUps as powerUps, buyPowerUp, getPowerUpCount, isAchievementUnlocked, t, xpMilestones, isMilestoneClaimed, getDailyXPGoal, appThemes, getUnlockedThemes, getActiveTheme, setActiveTheme, levelPerks, getTotalXP, getXPMultiplier, saveProgress, buyCostume, equipCostume, addXP, isHapticEnabled, isSoundEnabled, setLocale, getLocale, duelStats, languages, getLeagueTier, getLangElo } from '../data'

import { share as nativeShare, haptic, isNative, getReminderState, enableReminders, disableReminders, queryReminders, onRemindersChanged, openExternal, SHARE_URL } from '../nativeBridge'

/* ═══════════════════════════════════════════
   PROFILE VIEW — polished, 3D, Costume Shop
   ═══════════════════════════════════════════ */
export default function ProfileView() {
    const xpPct = Math.round((profile.xpCurrent / profile.xpNext) * 100)
    const [showShop, setShowShop] = useState(false)
    const [showPowerUps, setShowPowerUps] = useState(false)
    const [costumes, setCostumes] = useState(otterCostumes)
    const [freezeMsg, setFreezeMsg] = useState(null)
    const [showSettings, setShowSettings] = useState(false)

    const handleFreeze = () => {
        if (stats.gems < 50) {
            setFreezeMsg('not_enough')
            setTimeout(() => setFreezeMsg(null), 2000)
            return
        }
        stats.gems -= 50
        stats.streakShield = true
        saveProgress()
        setFreezeMsg('activated')
        try { if (isHapticEnabled()) navigator.vibrate?.(40) } catch (e) { }
        setTimeout(() => setFreezeMsg(null), 2000)
    }

    const equipped = costumes.filter(c => c.equipped && c.slot !== null)

    const handleEquip = (id) => {
        equipCostume(id)
        setCostumes([...otterCostumes]) // refresh from source
    }

    const handleBuy = (id) => {
        const ok = buyCostume(id)
        if (!ok) {
            setFreezeMsg('not_enough')
            setTimeout(() => setFreezeMsg(null), 2000)
            return
        }
        setCostumes([...otterCostumes]) // refresh from source
        try { if (isHapticEnabled()) navigator.vibrate?.(40) } catch (e) { }
    }

    return (
        <div className="h-full overflow-y-auto pb-24 relative">
            <div className="max-w-md mx-auto px-4 space-y-4"
                style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>

                {/* Profile header with Otter */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center pt-2 relative">
                    <button onClick={() => setShowSettings(true)} className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xl">
                        ⚙️
                    </button>
                    <div className="relative inline-block">
                        <OtterAvatar size={80} equipped={equipped} />
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 border-b-[3px] border-amber-700 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-xs font-black text-white">{profile.level}</span>
                        </div>
                    </div>
                    <h1 className="text-xl font-black text-white mt-3">{profile.name}</h1>
                    <p className="text-xs font-bold text-slate-500">{t('Level')} {profile.level} Coder</p>

                    <div className="flex gap-2 mt-3">
                        <motion.button whileTap={{ scale: 0.95 }}
                            onClick={() => setShowShop(true)}
                            className="flex-1 px-4 py-2 rounded-xl font-black text-xs text-white bg-purple-500 border-b-[4px] border-purple-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            🛍️ {t('COSTUME SHOP')}
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPowerUps(true)}
                            className="flex-1 px-4 py-2 rounded-xl font-black text-xs text-white bg-amber-500 border-b-[4px] border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            ⚡ {t('POWER-UPS')}
                        </motion.button>
                    </div>
                </motion.div>

                {/* XP progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl p-4 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-slate-400 tracking-wider">{t('NEXT LEVEL')}</span>
                        <span className="text-xs font-black text-teal-400">{profile.xpCurrent} / {profile.xpNext} XP</span>
                    </div>
                    <div className="h-3.5 rounded-full overflow-hidden bg-slate-950"
                        style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)' }}>
                        <div className="h-full rounded-full bg-teal-500 relative overflow-hidden transition-all" style={{ width: `${xpPct}%` }}>
                            <div className="absolute top-[1px] left-2 right-2 h-[3px] rounded-full bg-white/30" />
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20 rounded-full" />
                        </div>
                    </div>
                </motion.div>

                {/* Streak Shield & Calendar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl p-5 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-extrabold text-slate-400 tracking-wider">{t('STREAK SHIELD')}</h3>
                        {stats.streakShield ? (
                            <div className="flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-700/30">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FCD34D"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                <span className="text-[9px] font-black text-emerald-400">{t('ACTIVE')}</span>
                            </div>
                        ) : (
                            <span className="text-[9px] font-bold text-red-400/70">{t('INACTIVE')}</span>
                        )}
                    </div>
                    {/* 7-day calendar */}
                    <StreakCalendar />
                    {/* Freeze button */}
                    <motion.button whileTap={{ scale: 0.95 }}
                        onClick={handleFreeze}
                        className="w-full mt-4 py-2.5 rounded-xl font-black text-xs text-white bg-sky-500/15 border border-sky-700/30 border-b-[3px] border-b-sky-900/40 cursor-pointer flex items-center justify-center gap-2">
                        {freezeMsg === 'activated' ? (
                            <><span>✅</span><span className="text-teal-400">{t('Streak Shield Activated!')}</span></>
                        ) : freezeMsg === 'not_enough' ? (
                            <><span>❌</span><span className="text-red-400">{t('Not enough gems!')}</span></>
                        ) : (
                            <><span>🧊</span><span className="text-sky-300">{t('Freeze a Day')}</span><span className="text-sky-500/70">• 50 💎</span></>
                        )}
                    </motion.button>
                </motion.div>

                {/* Stats grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                    className="grid grid-cols-2 gap-3">
                    <StatBox icon="⭐" label={t('Stars')} value={`${profile.totalStars}/${profile.maxStars}`} color="text-amber-400" />
                    <StatBox icon="🔥" label={t('Streak')} value={`${stats.streak} ${t('days')}`} color="text-orange-400" />
                    <StatBox icon="📅" label={t('Days Active')} value={profile.daysLearning} color="text-sky-400" />
                    <StatBox icon="🏆" label={t('Best Streak')} value={`${profile.longestStreak} ${t('days')}`} color="text-purple-400" />
                </motion.div>

                {/* XP REWARDS ZONE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                    className="rounded-2xl p-5 bg-gradient-to-br from-amber-950/30 to-slate-800 border-2 border-amber-700/20 border-b-[5px] border-b-slate-950">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-extrabold text-amber-400 tracking-wider">⚡ {t('XP REWARDS')}</h3>
                        {(() => { const m = getXPMultiplier(); return m.label ? <span className="text-[10px] font-black text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">{m.label} BONUS</span> : null })()}
                    </div>

                    {/* Daily XP Goal */}
                    <DailyXPModule />

                    {/* XP Milestones */}
                    <div className="mt-4">
                        <p className="text-[10px] font-black text-slate-400 mb-2">🏔️ {t('MILESTONES')}</p>
                        <div className="space-y-1.5">
                            {xpMilestones.map(m => {
                                const totalXP = getTotalXP()
                                const claimed = isMilestoneClaimed(m.xp)
                                const pct = Math.min((totalXP / m.xp) * 100, 100)
                                return (
                                    <div key={m.xp} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${claimed ? 'bg-amber-500/10 border border-amber-700/20' : 'bg-slate-900/40'}`}>
                                        <span className={`text-lg ${claimed ? '' : 'grayscale opacity-40'}`}>{m.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-slate-300">{m.title}</p>
                                                <p className="text-[8px] font-bold text-slate-600">{m.xp.toLocaleString()} XP</p>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                                    className={`h-full rounded-full ${claimed ? 'bg-amber-500' : 'bg-slate-600'}`} />
                                            </div>
                                        </div>
                                        <span className="text-[8px] font-black text-amber-400 shrink-0">{claimed ? '✓' : m.reward}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Theme Gallery */}
                    <ThemeGallery />

                    {/* Next Level Perk */}
                    <NextPerkPreview />
                </motion.div>

                {/* Skill Radar & Language Mastery */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-2xl p-5 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
                    <h3 className="text-xs font-extrabold text-slate-400 tracking-wider mb-4">{t('SKILL RADAR')}</h3>
                    <BigRadar />
                    <div className="my-6 h-px bg-slate-700/50" />
                    <h3 className="text-xs font-extrabold text-slate-400 tracking-wider mb-4">{t('ACTIVITY')}</h3>
                    <ActivityGrid />
                    <div className="my-6 h-px bg-slate-700/50" />
                    <h3 className="text-xs font-extrabold text-slate-400 tracking-wider mb-4">{t('CODE READING LEVEL')}</h3>
                    <ReadingLevel />
                    <div className="my-6 h-px bg-slate-700/50" />
                    <h3 className="text-xs font-extrabold text-slate-400 tracking-wider mb-4">{t('LANGUAGE MASTERY')}</h3>
                    <LanguageMastery />
                </motion.div>

                {/* Social Share Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}>
                    <ShareCard equipped={equipped} />
                </motion.div>

                {/* Achievements — Hologram Cards with 3D tilt */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h3 className="text-xs font-extrabold text-slate-400 tracking-wider mb-3">{t('ACHIEVEMENTS')}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {achievements.map((a, i) => {
                            const unlocked = isAchievementUnlocked(a.id)
                            return (
                                <HologramCard key={a.id} unlocked={unlocked} color={unlocked ? '#f59e0b' : '#475569'}>
                                    <div className="p-3 flex flex-col items-center text-center">
                                        <div className={`text-2xl mb-1 ${unlocked ? '' : 'grayscale'}`}>{a.icon}</div>
                                        <span className="text-[8px] font-extrabold text-slate-400 leading-tight">{a.title}</span>
                                        <span className="text-[7px] font-bold text-slate-600 leading-tight mt-0.5">{a.desc}</span>
                                    </div>
                                </HologramCard>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Costume Shop Overlay */}
            <AnimatePresence>
                {showShop && <CostumeShop costumes={costumes} equipped={costumes.filter(c => c.equipped && c.slot !== null)} onEquip={handleEquip} onBuy={handleBuy} onClose={() => setShowShop(false)} gems={stats.gems} />}
            </AnimatePresence>

            {/* Power-Up Shop Overlay */}
            <AnimatePresence>
                {showPowerUps && <PowerUpShop onClose={() => setShowPowerUps(false)} />}
            </AnimatePresence>

            {/* Settings Overlay */}
            <AnimatePresence>
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════
   CSS OTTER AVATAR — costumes positioned anatomically
   Hat  → top of head
   Face → over eye area
   Body → torso/below
   ═══════════════════════════════════════════════════════ */
function OtterAvatar({ size = 80, equipped = [] }) {
    const s = size
    const hatItem = equipped.find(c => c.slot === 'hat')
    const faceItem = equipped.find(c => c.slot === 'face')
    const bodyItem = equipped.find(c => c.slot === 'body')

    /* Scale factors relative to size */
    const bodyW = s * 0.85
    const bodyH = s * 0.92
    const bellyW = s * 0.52
    const bellyH = s * 0.42
    const earS = s * 0.16
    const eyeW = s * 0.12
    const eyeH = s * 0.14
    const pupilW = s * 0.07
    const pupilH = s * 0.09
    const noseW = s * 0.09
    const noseH = s * 0.06

    /* Costume-specific SVG overlays */
    const hatRenderers = {
        tophat: (s) => (
            <div className="absolute z-20" style={{ top: -s * 0.28, left: '50%', transform: 'translateX(-50%)' }}>
                <svg width={s * 0.55} height={s * 0.45} viewBox="0 0 44 36">
                    <rect x="6" y="8" width="32" height="22" rx="3" fill="#1a1a2e" />
                    <rect x="2" y="26" width="40" height="6" rx="2" fill="#1a1a2e" />
                    <rect x="2" y="26" width="40" height="2" rx="1" fill="#C5903A" />
                    <rect x="8" y="8" width="28" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
                </svg>
            </div>
        ),
        crown: (s) => (
            <div className="absolute z-20" style={{ top: -s * 0.22, left: '50%', transform: 'translateX(-50%)' }}>
                <svg width={s * 0.5} height={s * 0.35} viewBox="0 0 40 28">
                    <path d="M4 22L8 8L14 16L20 4L26 16L32 8L36 22Z" fill="#D4A843" stroke="#B8922E" strokeWidth="1" />
                    <rect x="4" y="22" width="32" height="5" rx="1.5" fill="#D4A843" stroke="#B8922E" strokeWidth="1" />
                    <circle cx="20" cy="10" r="2" fill="#E74C3C" />
                    <circle cx="12" cy="14" r="1.5" fill="#3498DB" />
                    <circle cx="28" cy="14" r="1.5" fill="#2ECC71" />
                </svg>
            </div>
        ),
        party: (s) => (
            <div className="absolute z-20" style={{ top: -s * 0.3, left: '50%', transform: 'translateX(-52%) rotate(-12deg)' }}>
                <svg width={s * 0.4} height={s * 0.4} viewBox="0 0 32 32">
                    <path d="M16 2L8 28H24L16 2Z" fill="#E07CC5" />
                    <path d="M16 2L12 16H20L16 2Z" fill="#F0A0D8" />
                    <circle cx="16" cy="2" r="3" fill="#FFD700" />
                    <line x1="14" y1="3" x2="10" y2="0" stroke="#FF6B6B" strokeWidth="1.5" />
                    <line x1="18" y1="3" x2="22" y2="0" stroke="#4ECDC4" strokeWidth="1.5" />
                    <line x1="16" y1="0" x2="16" y2="-3" stroke="#FFD700" strokeWidth="1.5" />
                    <rect x="8" y="27" width="16" height="3" rx="1" fill="#E07CC5" />
                </svg>
            </div>
        ),
    }

    const faceRenderers = {
        sunglasses: (s) => (
            <div className="absolute z-20" style={{ top: s * 0.22, left: '50%', transform: 'translateX(-50%)' }}>
                <svg width={s * 0.65} height={s * 0.25} viewBox="0 0 52 20">
                    <rect x="2" y="4" width="18" height="13" rx="4" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
                    <rect x="32" y="4" width="18" height="13" rx="4" fill="#1a1a2e" stroke="#333" strokeWidth="1" />
                    <rect x="20" y="8" width="12" height="3" rx="1" fill="#555" />
                    <rect x="4" y="6" width="14" height="4" rx="2" fill="rgba(100,160,255,0.15)" />
                    <rect x="34" y="6" width="14" height="4" rx="2" fill="rgba(100,160,255,0.15)" />
                </svg>
            </div>
        ),
        monocle: (s) => (
            <div className="absolute z-20" style={{ top: s * 0.2, left: '50%', transform: 'translateX(-20%)' }}>
                <svg width={s * 0.35} height={s * 0.4} viewBox="0 0 28 32">
                    <circle cx="14" cy="12" r="10" fill="none" stroke="#C5903A" strokeWidth="2.5" />
                    <circle cx="14" cy="12" r="8" fill="rgba(200,230,255,0.1)" />
                    <line x1="14" y1="22" x2="14" y2="32" stroke="#C5903A" strokeWidth="1.5" />
                </svg>
            </div>
        ),
    }

    const bodyRenderers = {
        cape: (s) => (
            <div className="absolute z-[5]" style={{ top: s * 0.25, left: '50%', transform: 'translateX(-50%)' }}>
                <svg width={s * 1.1} height={s * 0.8} viewBox="0 0 88 64">
                    <path d="M20 4C16 4 6 16 4 40C2 56 8 60 14 62L30 48L44 60L58 48L74 62C80 60 86 56 84 40C82 16 72 4 68 4Z" fill="#C0392B" />
                    <path d="M20 4C18 4 12 10 8 24L30 36L44 24L58 36L80 24C76 10 70 4 68 4Z" fill="#E74C3C" />
                    <path d="M36 4H52L48 8H40L36 4Z" fill="#C5903A" />
                </svg>
            </div>
        ),
        scarf: (s) => (
            <div className="absolute z-20" style={{ top: s * 0.6, left: '50%', transform: 'translateX(-50%)' }}>
                <svg width={s * 0.8} height={s * 0.45} viewBox="0 0 64 36">
                    <path d="M8 4C8 2 10 0 16 0H48C54 0 56 2 56 4V12C56 14 54 18 48 18H16C10 18 8 14 8 12V4Z" fill="#4A90D9" />
                    <path d="M8 4C8 2 10 0 16 0H48C54 0 56 2 56 4V8C56 10 54 10 48 10H16C10 10 8 10 8 8V4Z" fill="#5CA8E8" />
                    <path d="M20 18V32C20 34 22 36 24 36H32C34 36 36 34 36 32V18" fill="#4A90D9" />
                    <path d="M20 18V24C20 26 22 26 24 25H32C34 25 36 26 36 24V18" fill="#5CA8E8" />
                    <line x1="8" y1="6" x2="56" y2="6" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                </svg>
            </div>
        ),
    }

    return (
        <div className="relative" style={{ width: s, height: s }}>
            {/* Cape renders BEHIND the otter */}
            {bodyItem && bodyRenderers[bodyItem.id] && bodyRenderers[bodyItem.id](s)}

            {/* Otter body */}
            <div className="absolute rounded-[35%] overflow-hidden border-b-[4px] border-teal-900"
                style={{ width: bodyW, height: bodyH, top: s * 0.08, left: (s - bodyW) / 2, backgroundColor: '#0F766E' }}>
                {/* Belly */}
                <div className="absolute rounded-[50%]"
                    style={{ width: bellyW, height: bellyH, bottom: 0, left: (bodyW - bellyW) / 2, backgroundColor: '#14B8A6' }} />
                {/* Smile */}
                <div className="absolute" style={{ bottom: s * 0.14, left: '50%', transform: 'translateX(-50%)' }}>
                    <div style={{ width: s * 0.14, height: s * 0.06, borderBottom: '2px solid rgba(0,0,0,0.3)', borderRadius: '0 0 50% 50%' }} />
                </div>
            </div>

            {/* Eyes — rendered on top so glasses cover them correctly */}
            <div className="absolute z-10 flex justify-center" style={{ top: s * 0.25, left: 0, right: 0, gap: s * 0.08 }}>
                {[0, 1].map(i => (
                    <div key={i} className="rounded-full bg-white relative" style={{ width: eyeW, height: eyeH }}>
                        <div className="absolute bg-slate-900 rounded-full" style={{ width: pupilW, height: pupilH, top: s * 0.015, left: s * 0.015 }} />
                    </div>
                ))}
            </div>

            {/* Nose */}
            <div className="absolute z-10 rounded-full bg-slate-900"
                style={{ width: noseW, height: noseH, top: s * 0.42, left: '50%', transform: 'translateX(-50%)' }} />

            {/* Ears */}
            <div className="absolute rounded-full bg-teal-700 z-0"
                style={{ width: earS, height: earS, top: s * 0.02, left: s * 0.15 }}>
                <div className="absolute rounded-full bg-teal-500" style={{ width: earS * 0.5, height: earS * 0.5, top: earS * 0.25, left: earS * 0.25 }} />
            </div>
            <div className="absolute rounded-full bg-teal-700 z-0"
                style={{ width: earS, height: earS, top: s * 0.02, right: s * 0.15 }}>
                <div className="absolute rounded-full bg-teal-500" style={{ width: earS * 0.5, height: earS * 0.5, top: earS * 0.25, right: earS * 0.25 }} />
            </div>

            {/* Feet */}
            <div className="absolute rounded-b-full bg-teal-800"
                style={{ width: s * 0.12, height: s * 0.06, bottom: 0, left: s * 0.25 }} />
            <div className="absolute rounded-b-full bg-teal-800"
                style={{ width: s * 0.12, height: s * 0.06, bottom: 0, right: s * 0.25 }} />

            {/* Hat overlay — sits on top of head */}
            {hatItem && hatRenderers[hatItem.id] && hatRenderers[hatItem.id](s)}

            {/* Face overlay — sits over eye area */}
            {faceItem && faceRenderers[faceItem.id] && faceRenderers[faceItem.id](s)}
        </div>
    )
}


/* ═══════════════ COSTUME SHOP ═══════════════ */
function CostumeShop({ costumes, equipped, onEquip, onBuy, onClose, gems }) {
    const slots = ['hat', 'face', 'body']
    const slotLabels = { hat: '🎩 Hats', face: '👓 Face', body: '🧣 Body' }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 flex flex-col"
            style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 16px))' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-black text-white">🛍️ {t('Costume Shop')}</h2>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-teal-500/15 rounded-xl px-3 py-1.5 border-b-[2px] border-teal-800">
                        <span className="text-sm">💎</span>
                        <span className="text-sm font-black text-teal-400">{gems}</span>
                    </div>
                    <button onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-slate-800 border-b-[3px] border-slate-900 flex items-center justify-center text-slate-400 font-black text-sm cursor-pointer active:translate-y-[3px] active:border-b-0 transition-all duration-75">
                        ✕
                    </button>
                </div>
            </div>

            {/* Live otter preview */}
            <div className="flex justify-center py-6">
                <div className="relative">
                    <OtterAvatar size={120} equipped={equipped} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 space-y-5" style={{ paddingBottom: 'max(80px, env(safe-area-inset-bottom, 80px))' }}>
                {slots.map(slot => {
                    const items = costumes.filter(c => c.slot === slot)
                    if (!items.length) return null
                    return (
                        <div key={slot}>
                            <h3 className="text-xs font-extrabold text-slate-500 tracking-widest uppercase mb-3">{slotLabels[slot]}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {items.map(item => (
                                    <motion.button key={item.id} whileTap={{ scale: 0.95 }}
                                        onClick={() => item.owned ? onEquip(item.id) : onBuy(item.id)}
                                        className={`rounded-2xl p-3 flex flex-col items-center gap-2 border-2 border-b-[4px] cursor-pointer transition-all duration-75 active:translate-y-[4px] active:border-b-0
                                            ${item.equipped ? 'bg-purple-500/20 border-purple-500 border-b-purple-700'
                                                : item.owned ? 'bg-slate-800 border-slate-700/40 border-b-slate-950'
                                                    : 'bg-slate-900 border-slate-800 border-b-slate-950 opacity-70'}`}>
                                        <span className="text-3xl">{item.emoji}</span>
                                        <span className="text-[9px] font-black text-white">{item.name}</span>
                                        {!item.owned && (
                                            <div className="flex items-center gap-1 bg-amber-500/15 rounded-full px-2 py-0.5 border border-amber-700">
                                                <span className="text-[8px]">💎</span>
                                                <span className="text-[8px] font-black text-amber-400">{item.price}</span>
                                            </div>
                                        )}
                                        {item.owned && item.equipped && (
                                            <span className="text-[8px] font-black text-purple-400">EQUIPPED</span>
                                        )}
                                        {item.owned && !item.equipped && (
                                            <span className="text-[8px] font-black text-slate-500">EQUIP</span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

function StatBox({ icon, label, value, color }) {
    return (
        <div className="rounded-2xl p-4 bg-slate-800 border-2 border-slate-700/40 border-b-[5px] border-b-slate-950 flex items-center gap-3">
            <span className="text-xl">{icon}</span>
            <div>
                <p className={`text-sm font-black ${color}`}>{value}</p>
                <p className="text-[9px] font-bold text-slate-500">{label}</p>
            </div>
        </div>
    )
}

/* ── Big Skill Radar ── */
/* ═══════════════════════════════════════════
   ACTIVITY GRID — GitHub / LeetCode style contribution calendar
   One square per day, one column per week. Scrolls horizontally and opens
   pinned to today, because a year of weeks cannot fit a phone at a readable
   square size and shrinking them to fit makes the whole thing unreadable.
   ═══════════════════════════════════════════ */
const ACTIVITY_SHADES = ['#1E293B', '#134E4A', '#0F766E', '#14B8A6', '#5EEAD4']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function ActivityGrid({ weeks = 53 }) {
    const { columns, total, activeDays } = getActivityGrid(weeks)
    const [picked, setPicked] = useState(null)
    const scrollRef = useRef(null)

    // Open scrolled to today — the most recent weeks are the ones worth seeing.
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [])

    // A month label sits above the first column that belongs to that month.
    let lastMonth = -1
    const monthLabels = columns.map(col => {
        const m = col[0].month
        if (m !== lastMonth) { lastMonth = m; return MONTH_SHORT[m] }
        return null
    })

    return (
        <div>
            <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-black text-white">
                    {total} <span className="text-xs font-bold text-slate-500">{t('questions in the last year')}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">{activeDays} {t('active days')}</span>
            </div>

            <div ref={scrollRef} className="overflow-x-auto pb-1 -mx-1 px-1">
                <div className="inline-flex flex-col gap-1 min-w-max">
                    <div className="flex gap-[3px] h-3">
                        {monthLabels.map((label, i) => (
                            <div key={i} className="w-[10px] shrink-0 relative">
                                {label && <span className="absolute left-0 top-0 text-[8px] font-bold text-slate-600 whitespace-nowrap">{label}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-[3px]">
                        {columns.map((col, w) => (
                            <div key={w} className="flex flex-col gap-[3px]">
                                {col.map(day => day.future ? (
                                    <div key={day.key} className="w-[10px] h-[10px]" />
                                ) : (
                                    <button key={day.key} onClick={() => setPicked(day)}
                                        aria-label={`${day.key}: ${day.n}`}
                                        className="w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-transform active:scale-125"
                                        style={{
                                            backgroundColor: ACTIVITY_SHADES[day.level],
                                            outline: picked?.key === day.key ? '1.5px solid #5EEAD4' : 'none',
                                        }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2.5">
                <span className="text-[10px] font-bold text-slate-500 min-h-[14px]">
                    {picked
                        ? picked.n === 0
                            ? `${picked.key} — ${t('no questions')}`
                            : `${picked.key} — ${picked.n} ${t('questions')}, ${picked.ok} ${t('correct')}`
                        : t('Tap a square for that day')}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-bold text-slate-600">{t('Less')}</span>
                    {ACTIVITY_SHADES.map((c, i) => (
                        <div key={i} className="w-[9px] h-[9px] rounded-[2px]" style={{ backgroundColor: c }} />
                    ))}
                    <span className="text-[9px] font-bold text-slate-600">{t('More')}</span>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   CODE READING LEVEL — Junior / Mid / Senior
   Reads the adaptive engine's ability rating, on the same scale as arena ELO.
   ═══════════════════════════════════════════ */
function ReadingLevel() {
    const rating = getOverallAbility()
    const { band, next, progress, remaining } = getBandProgress(rating)
    const skills = getAbilityBySkill()

    return (
        <div>
            <div className="flex items-end justify-between mb-2">
                <div>
                    <span className="text-2xl font-black" style={{ color: band.color }}>{t(band.label)}</span>
                    <span className="ml-2 text-xs font-bold text-slate-500">{Math.round(rating)}</span>
                </div>
                {next && <span className="text-[10px] font-bold text-slate-500">{remaining} {t('to')} {t(next.label)}</span>}
            </div>

            <div className="h-2.5 rounded-full bg-slate-900 overflow-hidden border-b-2 border-slate-950">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                    className="h-full rounded-full" style={{ backgroundColor: band.color }} />
            </div>

            {skills.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-600 mt-3">{t('Answer a few questions and your level will calibrate itself.')}</p>
            ) : (
                <div className="mt-4 space-y-1.5">
                    {skills.slice(0, 5).map(s => {
                        const b = getBand(s.rating)
                        return (
                            <div key={s.skill} className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-400 flex-1 truncate">{t(s.skill)}</span>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded"
                                    style={{ color: b.color, backgroundColor: b.color + '1A' }}>{t(b.label)}</span>
                                <span className="text-[10px] font-bold text-slate-600 w-9 text-right">{s.rating}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function BigRadar() {
    const skills = Object.values(getSkillRadar())
    const n = skills.length
    const cx = 90, cy = 90, R = 52

    const getPoint = (i, r) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
    }

    const outerPts = skills.map((_, i) => getPoint(i, R).join(',')).join(' ')
    const midPts = skills.map((_, i) => getPoint(i, R * 0.5).join(',')).join(' ')
    const dataPts = skills.map((s, i) => getPoint(i, R * s.score / 100).join(',')).join(' ')

    return (
        <div className="flex justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180">
                <polygon points={outerPts} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <polygon points={midPts} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                {skills.map((_, i) => {
                    const [x, y] = getPoint(i, R)
                    return <line key={`line-${i}`} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                })}
                <polygon points={dataPts} fill="rgba(45,212,191,0.2)" stroke="#2DD4BF" strokeWidth="2" />
                {skills.map((s, i) => {
                    const [x, y] = getPoint(i, R + 22)
                    return <text key={`lbl-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                        fill="rgba(255,255,255,0.5)" fontSize="8" fontWeight="800">{s.label}</text>
                })}
                {skills.map((s, i) => {
                    const [x, y] = getPoint(i, R * s.score / 100)
                    return <circle key={`dot-${i}`} cx={x} cy={y} r="3.5" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1" />
                })}
            </svg>
        </div>
    )
}

/* ═══════════════ STREAK CALENDAR ═══════════════ */
function StreakCalendar() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const today = new Date()
    const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1

    // Get real login history from localStorage
    let loginHistory = []
    try { loginHistory = JSON.parse(localStorage.getItem('rheo_login_history') || '[]') } catch (e) { }

    // Build this week's dates
    const mondayOffset = todayIdx
    const streakDays = days.map((_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - mondayOffset + i)
        const dateStr = date.toDateString()
        if (i === todayIdx) return 'today'
        if (i > todayIdx) return 'future'
        if (loginHistory.includes(dateStr)) return 'done'
        return 'missed'
    })

    return (
        <div className="flex gap-1.5">
            {days.map((day, i) => {
                const status = streakDays[i]
                return (
                    <div key={day} className="flex-1 text-center">
                        <p className={`text-[7px] font-bold mb-1 ${status === 'today' ? 'text-amber-400' : 'text-slate-600'}`}>{day}</p>
                        <motion.div
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`w-full aspect-square rounded-lg flex items-center justify-center border-b-[2px] text-[10px] font-black
                                ${status === 'done' ? 'bg-teal-500/20 border-teal-800 text-teal-400'
                                    : status === 'today' ? 'bg-amber-500/20 border-amber-700 text-amber-400 ring-1 ring-amber-400/30'
                                        : status === 'missed' ? 'bg-red-500/10 border-red-900/40 text-red-400/50'
                                            : 'bg-slate-900/40 border-slate-950 text-slate-700'}`}>
                            {status === 'done' ? '🔥' : status === 'today' ? '✨' : status === 'missed' ? '✕' : '·'}
                        </motion.div>
                    </div>
                )
            })}
        </div>
    )
}

/* ═══════════════ SOCIAL SHARE CARD ═══════════════ */
function ShareCard({ equipped }) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        if (isHapticEnabled()) haptic('light')
        const shareText = `🦦 I'm Level ${profile.level} on Rheo! Streak: ${stats.streak} days, XP: ${profile.xpCurrent}. Learn coding with me!`
        // Uses the native OS share sheet inside the app; falls back to the Web
        // Share API and finally the clipboard in a plain browser.
        await nativeShare(shareText, SHARE_URL)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        // Grant 10 XP for sharing
        addXP(10)
    }

    return (
        <div className="rounded-2xl overflow-hidden border-2 border-slate-700/40 border-b-[5px] border-b-slate-950">
            {/* Gradient preview */}
            <div className="relative p-5 text-center"
                style={{ background: 'linear-gradient(135deg, #0D9488 0%, #1E3A5F 50%, #2D1B69 100%)' }}>
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-10"
                    style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)', backgroundSize: '200% 200%' }} />

                <div className="relative">
                    <div className="inline-block mb-2">
                        <OtterAvatar size={56} equipped={equipped} />
                    </div>
                    <h3 className="text-lg font-black text-white">{profile.name}</h3>
                    <p className="text-[10px] font-bold text-white/50 mb-3">Level {profile.level} • Rheo</p>
                    <div className="flex justify-center gap-4">
                        <div className="text-center">
                            <p className="text-base font-black text-white">{stats.streak}</p>
                            <p className="text-[7px] font-bold text-white/40">STREAK</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-base font-black text-white">{profile.xpCurrent}</p>
                            <p className="text-[7px] font-bold text-white/40">XP</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <p className="text-base font-black text-white">{profile.totalStars}</p>
                            <p className="text-[7px] font-bold text-white/40">STARS</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share button */}
            <div className="bg-slate-800 px-5 py-3">
                <motion.button whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-purple-500/15 border border-purple-700/30 border-b-[3px] border-b-purple-900/40 cursor-pointer flex items-center justify-center gap-2">
                    {copied ? (
                        <><span>✅</span><span className="text-emerald-400">Copied!</span></>
                    ) : (
                        <><span>📤</span><span className="text-purple-300">{t('SHARE PROFILE')}</span></>
                    )}
                </motion.button>
            </div>
        </div>
    )
}

/* ═══════════════ POWER-UP SHOP ═══════════════ */
function PowerUpShop({ onClose }) {
    const [msg, setMsg] = useState(null)
    const [, forceUpdate] = useState(0)

    const handleBuy = (id) => {
        const ok = buyPowerUp(id)
        if (ok) {
            setMsg('purchased')
            try { if (isHapticEnabled()) navigator.vibrate?.(40) } catch (e) { }
        } else {
            setMsg('not_enough')
        }
        forceUpdate(v => v + 1)
        setTimeout(() => setMsg(null), 1500)
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-end justify-center"
            onClick={onClose}>
            <motion.div
                initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md rounded-t-3xl bg-slate-800 border-t-2 border-slate-700/40 overflow-y-auto"
                style={{ maxHeight: '80vh' }}>
                {/* Header */}
                <div className="p-5 pb-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-white">⚡ {t('Power-Ups')}</h2>
                        <p className="text-[10px] font-bold text-slate-500">{t('Spend gems on boosts')}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-700 rounded-xl px-3 py-2 border-b-[2px] border-slate-900">
                        <span className="text-sm">💎</span>
                        <span className="text-sm font-black text-sky-300">{stats.gems}</span>
                    </div>
                </div>

                {/* Feedback */}
                {msg && (
                    <div className={`mx-5 mb-2 px-4 py-2 rounded-xl text-center text-xs font-black ${msg === 'purchased' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {msg === 'purchased' ? '✅ Purchased!' : '❌ Not enough gems!'}
                    </div>
                )}

                {/* Items */}
                <div className="px-5 pb-6 space-y-3">
                    {powerUps.map(item => {
                        const count = getPowerUpCount(item.id)
                        return (
                            <div key={item.id} className="flex items-center gap-3 rounded-2xl p-4 bg-slate-900/60 border border-slate-700/20 border-b-[3px] border-b-slate-950">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-700/20 border-b-[2px] border-b-amber-900 flex items-center justify-center text-2xl shrink-0">
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-white">{item.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{item.desc}</p>
                                    {count > 0 && <p className="text-[9px] font-black text-teal-400 mt-0.5">x{count} owned</p>}
                                </div>
                                <motion.button whileTap={{ scale: 0.9 }}
                                    onClick={() => handleBuy(item.id)}
                                    className="px-3 py-2 rounded-xl font-black text-[10px] text-white bg-amber-500 border-b-[3px] border-amber-700 active:border-b-0 active:translate-y-[3px] transition-all cursor-pointer shrink-0">
                                    💎 {item.price}
                                </motion.button>
                            </div>
                        )
                    })}
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ═══════════════ DAILY XP GOAL RING ═══════════════ */
function DailyXPModule() {
    const goal = getDailyXPGoal()
    const pct = Math.min((goal.xpEarned / goal.targetXp) * 100, 100)
    const r = 36, c = 2 * Math.PI * r
    const offset = c - (pct / 100) * c

    return (
        <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
                <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                    <circle cx="40" cy="40" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
                    <motion.circle cx="40" cy="40" r={r} fill="none"
                        stroke={goal.completed ? '#f59e0b' : '#14b8a6'}
                        strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={c} strokeDashoffset={offset}
                        initial={{ strokeDashoffset: c }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: 'easeOut' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {goal.completed
                        ? <span className="text-lg">🎯</span>
                        : <span className="text-sm font-black text-white">{Math.round(pct)}%</span>
                    }
                </div>
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 mb-0.5">{t('DAILY XP GOAL')}</p>
                <p className="text-lg font-black text-white">{goal.xpEarned} <span className="text-sm text-slate-500">/ {goal.targetXp}</span></p>
                {goal.completed
                    ? <p className="text-[10px] font-black text-amber-400">✅ {t('Goal hit!')} {goal.goalStreak > 1 ? `🔥 ${goal.goalStreak} ${t('day streak')}` : ''}</p>
                    : <p className="text-[10px] font-bold text-slate-600">{goal.targetXp - goal.xpEarned} XP {t('to go')}</p>
                }
                {goal.goalStreak > 0 && !goal.completed && <p className="text-[9px] font-bold text-slate-600">🎯 {t('Goal Streak')}: {goal.goalStreak} {t('days')}</p>}
            </div>
        </div>
    )
}

/* ═══════════════ THEME GALLERY ═══════════════ */
function ThemeGallery() {
    const [, forceUpdate] = useState(0)
    const unlocked = getUnlockedThemes()
    const activeTheme = getActiveTheme()

    const handleThemeSelect = (themeId) => {
        if (!unlocked.includes(themeId)) return
        setActiveTheme(themeId)
        saveProgress()
        forceUpdate(v => v + 1)
        try { if (isHapticEnabled()) navigator.vibrate?.(15) } catch (e) { }
    }

    return (
        <div className="mt-4">
            <p className="text-[10px] font-black text-slate-400 mb-2">🎨 {t('THEMES')}</p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {appThemes.map(theme => {
                    const isUnlocked = unlocked.includes(theme.id)
                    const isActive = activeTheme === theme.id
                    return (
                        <motion.div key={theme.id} whileTap={isUnlocked ? { scale: 0.95 } : {}}
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`shrink-0 w-16 rounded-xl p-2 text-center border-b-[3px] transition-all
                                ${isActive ? 'border-amber-700 bg-amber-500/15 ring-1 ring-amber-400/30'
                                    : isUnlocked ? 'border-slate-950 bg-slate-900/60 cursor-pointer'
                                        : 'border-slate-950 bg-slate-900/40 opacity-30'}`}>
                            <div className="w-8 h-8 mx-auto rounded-lg mb-1 border border-slate-700/20"
                                style={{ background: `linear-gradient(135deg, ${theme.colors.bg}, ${theme.colors.accent})` }}>
                                {!isUnlocked && <div className="w-full h-full flex items-center justify-center text-[10px]">🔒</div>}
                            </div>
                            <p className="text-[7px] font-black text-slate-500 leading-tight">{theme.name}</p>
                            {!isUnlocked && <p className="text-[6px] font-bold text-slate-700">{theme.unlockXP} XP</p>}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

/* ═══════════════ NEXT LEVEL PERK ═══════════════ */
function NextPerkPreview() {
    const nextPerk = levelPerks.find(p => p.level > profile.level)
    if (!nextPerk) return null
    const levelsAway = nextPerk.level - profile.level
    return (
        <div className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-900/40 border border-dashed border-slate-700/30">
            <span className="text-2xl grayscale opacity-50">{nextPerk.icon}</span>
            <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400">🔮 {t('NEXT PERK')} — Level {nextPerk.level}</p>
                <p className="text-[9px] font-bold text-slate-600">{nextPerk.perk}</p>
            </div>
            <span className="text-[9px] font-black text-slate-600">{levelsAway} lvl</span>
        </div>
    )
}

/* ═══════════════ SETTINGS MODAL ═══════════════ */
function SettingsModal({ onClose }) {
    const [sound, setSound] = useState(() => isSoundEnabled())
    const [haptic, setHaptic] = useState(() => isHapticEnabled())
    const [locale, setLocaleState] = useState(() => getLocale())

    const toggleSound = () => {
        const val = !sound; setSound(val)
        localStorage.setItem('rheo_setting_sound', JSON.stringify(val))
    }
    const toggleHaptic = () => {
        const val = !haptic; setHaptic(val)
        localStorage.setItem('rheo_setting_haptic', JSON.stringify(val))
        if (val) try { navigator.vibrate?.(40) } catch (e) { }
    }
    // Daily reminders live in the native shell — it is the only side that can
    // hand a schedule to the OS. The switch shows the state the shell reports,
    // not the state we asked for, so a declined permission leaves it off.
    const [reminders, setReminders] = useState(() => getReminderState())
    useEffect(() => {
        if (!isNative()) return
        queryReminders()
        return onRemindersChanged(setReminders)
    }, [])
    const toggleReminders = () => {
        if (reminders.enabled) disableReminders()
        else enableReminders(reminders.hour ?? 20, reminders.minute ?? 0)
    }

    const handleLocale = (l) => {
        setLocaleState(l)
        setLocale(l)
        window.location.reload() // reload to apply i18n
    }
    const handleReset = () => {
        if (window.confirm(t('Reset all progress? This cannot be undone.'))) {
            localStorage.clear()
            window.location.reload()
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end"
            style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="absolute inset-0" onClick={onClose} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative bg-slate-800 rounded-t-3xl border-t-2 border-slate-700 p-6 flex flex-col pb-safe max-h-[80vh] overflow-y-auto">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
                <h2 className="text-xl font-black text-white mb-6">⚙️ {t('Settings')}</h2>

                <div className="space-y-4 mb-6">
                    {/* Preferences */}
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                        <h3 className="text-xs font-black text-slate-500 tracking-wider mb-4 uppercase">{t('Preferences')}</h3>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-bold text-slate-300">{t('Sound Effects')}</p>
                                <p className="text-[10px] text-slate-500">{t('In-game audio & feedback')}</p>
                            </div>
                            <button onClick={toggleSound} className={`w-12 h-6 rounded-full relative transition-colors ${sound ? 'bg-teal-500' : 'bg-slate-700'}`}>
                                <motion.div animate={{ x: sound ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full mt-0.5 shadow-sm" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-300">{t('Haptic Feedback')}</p>
                                <p className="text-[10px] text-slate-500">{t('Vibrations on action')}</p>
                            </div>
                            <button onClick={toggleHaptic} className={`w-12 h-6 rounded-full relative transition-colors ${haptic ? 'bg-teal-500' : 'bg-slate-700'}`}>
                                <motion.div animate={{ x: haptic ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full mt-0.5 shadow-sm" />
                            </button>
                        </div>
                        {/* Only offered inside the app: a browser tab cannot
                            wake anyone up, and a switch that does nothing is
                            worse than no switch. */}
                        {isNative() && (
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-300">{t('Daily Reminder')}</p>
                                    <p className="text-[10px] text-slate-500">
                                        {reminders.enabled
                                            ? `${t('Every day at')} ${String(reminders.hour ?? 20).padStart(2, '0')}:${String(reminders.minute ?? 0).padStart(2, '0')}`
                                            : t('A nudge so your streak survives')}
                                    </p>
                                </div>
                                <button onClick={toggleReminders} className={`w-12 h-6 rounded-full relative transition-colors ${reminders.enabled ? 'bg-teal-500' : 'bg-slate-700'}`}>
                                    <motion.div animate={{ x: reminders.enabled ? 24 : 2 }} className="w-5 h-5 bg-white rounded-full mt-0.5 shadow-sm" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Language */}
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
                        <h3 className="text-xs font-black text-slate-500 tracking-wider mb-4 uppercase">{t('Language')}</h3>
                        <div className="flex gap-2">
                            <button onClick={() => handleLocale('en')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${locale === 'en' ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>🇬🇧 English</button>
                            <button onClick={() => handleLocale('tr')} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${locale === 'tr' ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>🇹🇷 Türkçe</button>
                        </div>
                        <p className="text-[9px] text-slate-500 text-center mt-3">{t('Changing language will reload the app.')}</p>
                    </div>

                    {/* Legal & About */}
                    <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 space-y-2">
                        <h3 className="text-xs font-black text-slate-500 tracking-wider mb-3 uppercase">{t('Legal & About')}</h3>
                        <button onClick={() => openExternal('https://rheo-mvp-2026.web.app/privacy.html')}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700/40 text-slate-300 text-xs font-bold hover:bg-slate-700/40 transition-colors">
                            <span className="flex items-center gap-2">🔒 {t('Privacy Policy')}</span>
                            <span className="text-slate-500">↗</span>
                        </button>
                        <button onClick={() => openExternal('https://rheo-mvp-2026.web.app/terms.html')}
                            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700/40 text-slate-300 text-xs font-bold hover:bg-slate-700/40 transition-colors">
                            <span className="flex items-center gap-2">📖 {t('Terms of Service')}</span>
                            <span className="text-slate-500">↗</span>
                        </button>
                    </div>

                    {/* Danger Zone / Account & Data Deletion */}
                    <div className="bg-red-950/20 rounded-2xl p-4 border border-red-900/30">
                        <h3 className="text-xs font-black text-red-500/50 tracking-wider mb-4 uppercase">{t('Danger Zone')}</h3>
                        <button onClick={handleReset} className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 transition-colors">
                            🗑️ {t('DELETE ACCOUNT & RESET DATA')}
                        </button>
                    </div>
                </div>

                <button onClick={onClose} className="w-full py-4 rounded-xl bg-slate-700 font-black text-sm text-white border-b-[4px] border-slate-800 active:translate-y-[4px] active:border-b-0 transition-all">
                    {t('Done')}
                </button>
            </motion.div>
        </motion.div>
    )
}

/* ═══════════════ LANGUAGE MASTERY ═══════════════ */
function LanguageMastery() {
    const langs = languages.map(l => {
        const elo = getLangElo(l.id)
        const tier = getLeagueTier(elo)
        return { ...l, elo, tier }
    }).sort((a, b) => b.elo - a.elo)

    const maxElo = Math.max(1500, langs[0]?.elo || 0)

    return (
        <div className="space-y-3">
            {langs.map((l, i) => {
                const pct = Math.min((l.elo / maxElo) * 100, 100)
                return (
                    <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3">
                        <span className="text-2xl w-8 text-center">{l.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-black text-slate-300">{l.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold" style={{ color: l.tier.color }}>{l.tier.name}</span>
                                    <span className="text-[10px] font-black text-slate-500">{l.elo} <span className="text-[8px]">ELO</span></span>
                                </div>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-900 overflow-hidden relative" style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                    className="absolute inset-y-0 left-0 rounded-full relative overflow-hidden" style={{ background: l.tier.color }}>
                                    <div className="absolute inset-0 bg-white/20 w-full h-1/3" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
