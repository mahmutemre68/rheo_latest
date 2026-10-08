import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import JourneyView from './components/JourneyView'
const QuestsView = lazy(() => import('./components/QuestsView'))
const LeagueView = lazy(() => import('./components/LeagueView'))
const ProfileView = lazy(() => import('./components/ProfileView'))
import BottomNav from './components/BottomNav'
import XPToastProvider from './components/XPToast'
import { AppProvider } from './components/AppContext'
import DailyReward from './components/DailyReward'
import Onboarding from './components/Onboarding'
import LessonScreen from './components/LessonScreen'
import { SplashScreen } from './components/LivingOtter'
import { AnimatePresence, motion } from 'framer-motion'
import { getActiveLanguage, journeyNodes, chapterColors, saveProgress, loadProgress, isOnboardingDone, setOnboardingDone, t, trackQuestEvent, useEnergy, stats, resetSeasonIfNeeded, buildReviewExercises, selectExercisesForNode, SHORT_LESSON_LENGTH, getEnergyRefillTime, MAX_ENERGY } from './data'

// Lazy loading fallback
const LazyFallback = () => <div className="h-full flex items-center justify-center"><div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" /></div>

export default function App() {
    const [activeTab, setActiveTab] = useState('journey')
    const [showOnboarding, setShowOnboarding] = useState(!isOnboardingDone())
    const [showDaily, setShowDaily] = useState(false)
    const [lessonNodeId, setLessonNodeId] = useState(null)
    const [milestoneChapter, setMilestoneChapter] = useState(null)
    const [outOfEnergy, setOutOfEnergy] = useState(false)
    const [, forceUpdate] = useState(0)

    // Check for seasonal leaderboard reset on mount
    useEffect(() => { resetSeasonIfNeeded() }, [])
    const [showSplash, setShowSplash] = useState(true)
    const handleSplashDone = useCallback(() => setShowSplash(false), [])

    // Load saved progress on mount + check daily reward
    useEffect(() => {
        loadProgress()
        forceUpdate(n => n + 1)

        // Show daily reward if onboarding already done and not yet claimed today
        if (isOnboardingDone()) {
            const today = new Date().toDateString()
            const lastClaim = localStorage.getItem('rheo_last_daily')
            if (lastClaim !== today) {
                setShowDaily(true)
            }
        }
    }, [])

    useEffect(() => {
        // Global lesson opener — for backward compat with data.js calls
        window.__openLesson = (nodeId) => setLessonNodeId(nodeId || 1)
        window.__refreshApp = () => forceUpdate(n => n + 1)
        return () => { window.__openLesson = null; window.__refreshApp = null }
    }, [])

    const views = {
        journey: <JourneyView />,
        quests: <Suspense fallback={<LazyFallback />}><QuestsView /></Suspense>,
        league: <Suspense fallback={<LazyFallback />}><LeagueView /></Suspense>,
        profile: <Suspense fallback={<LazyFallback />}><ProfileView /></Suspense>,
    }

    const handleOnboardingDone = () => {
        setShowOnboarding(false)
        setOnboardingDone()
        setShowDaily(true)
    }

    // Pick the questions ONCE, when the lesson opens. The adaptive selector reads
    // the learner's ability, which changes with every answer — recomputing on each
    // render would swap the questions out from under the lesson mid-run.
    const exercises = useMemo(() => {
        if (!lessonNodeId) return []
        if (lessonNodeId === 'review_weaknesses') return buildReviewExercises(getActiveLanguage())
        // Chest and playground nodes run a short round — they are a reward and a
        // sandbox, not a full lesson, and their pools are deliberately small.
        const node = journeyNodes.find(n => n.id === lessonNodeId)
        const short = node && (node.type === 'chest' || node.type === 'playground')
        return selectExercisesForNode(lessonNodeId, getActiveLanguage(), short ? SHORT_LESSON_LENGTH : undefined)
    }, [lessonNodeId])

    // Energy gate — consume energy when lesson screen opens.
    // A refusal used to close the lesson with no message at all: the learner
    // tapped a node, saw a flash, and landed back on the map with nothing to
    // explain it. Silent failure on the app's main progression gate reads as
    // "the app is broken", so a refusal now says so and gives the wait.
    useEffect(() => {
        if (lessonNodeId && exercises.length > 0) {
            if (!useEnergy()) {
                setLessonNodeId(null)
                setOutOfEnergy(true)
                forceUpdate(n => n + 1)
            }
        }
    }, [lessonNodeId])

    const handleLessonClose = (result) => {
        if (result?.completed && lessonNodeId) {
            const node = journeyNodes.find(n => n.id === lessonNodeId)
            if (node) {
                node.status = 'completed'
                node.stars = result.stars || 1
                // Check if chapter is complete
                const chapterNodes = journeyNodes.filter(n => n.chapter === node.chapter)
                const allDone = chapterNodes.every(n => n.status === 'completed')
                if (allDone) {
                    setMilestoneChapter(node.chapter)
                }
                // Only activate the next locked node (don't touch other active nodes like daily/available)
                const nextLocked = journeyNodes.find(n => n.id > node.id && n.status === 'locked')
                if (nextLocked) nextLocked.status = 'active'
            }
            // Save progress to localStorage
            saveProgress()
            // Track quest events for real progress
            trackQuestEvent('complete_lesson')
            trackQuestEvent('complete_exercise', result.stars || 1)
            if (result.perfect) trackQuestEvent('perfect_score')
        }
        setLessonNodeId(null)
        forceUpdate(n => n + 1)
    }

    return (
        <>
            <AppProvider>
                <XPToastProvider>
                    <div className="flex justify-center h-full" style={{ background: '#080E1A' }}>
                        <div className="w-full max-w-[430px] h-full flex flex-col relative"
                            style={{ background: '#0F172A', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}>
                            <div className="flex-1 overflow-hidden">
                                {views[activeTab] || <JourneyView />}
                            </div>
                            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showOnboarding && <Onboarding onFinish={handleOnboardingDone} />}
                    </AnimatePresence>

                    <AnimatePresence>
                        {outOfEnergy && <OutOfEnergy onClose={() => setOutOfEnergy(false)} />}
                    </AnimatePresence>

                    {/* Daily Reward — ONLY on journey tab to fix z-index overlap */}
                    <AnimatePresence>
                        {showDaily && activeTab === 'journey' && <DailyReward onClose={() => setShowDaily(false)} />}
                    </AnimatePresence>

                    {/* Lesson Screen */}
                    <AnimatePresence>
                        {lessonNodeId && <LessonScreen onClose={handleLessonClose} exercises={exercises} />}
                    </AnimatePresence>

                    {/* Chapter Milestone Celebration */}
                    <AnimatePresence>
                        {milestoneChapter && <MilestoneModal chapter={milestoneChapter} onClose={() => setMilestoneChapter(null)} />}
                    </AnimatePresence>
                </XPToastProvider>
            </AppProvider>

            {/* Splash Screen — Code Rain + Otter */}
            <AnimatePresence>
                {showSplash && <SplashScreen onFinish={handleSplashDone} duration={2500} />}
            </AnimatePresence>
        </>
    )
}

/* ═══════════════════════════════════════════
   CHAPTER MILESTONE CELEBRATION
   ═══════════════════════════════════════════ */
function MilestoneModal({ chapter, onClose }) {
    const ch = chapterColors[chapter]
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] flex items-center justify-center"
            style={{ background: 'rgba(15,23,42,0.95)' }} onClick={onClose}>
            <div className="flex flex-col items-center text-center gap-4 px-8">
                {/* Otter celebration */}
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }} className="text-7xl">🎉</motion.div>
                <motion.h1 initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="text-3xl font-black text-white">{t('Chapter Complete!')}</motion.h1>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="px-6 py-3 rounded-2xl border-b-[4px]"
                    style={{ backgroundColor: ch?.accent || '#14B8A6', borderBottomColor: (ch?.accent || '#14B8A6') + '80' }}>
                    <p className="text-xs font-extrabold text-white/60 tracking-wider">{t('CHAPTER')} {chapter}</p>
                    <p className="text-lg font-black text-white">{t(ch?.name) || t('Chapter')}</p>
                </motion.div>
                {/* Stars */}
                <div className="flex gap-3">
                    {[0, 1, 2].map(i => (
                        <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 300 }}>
                            <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </motion.div>
                    ))}
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="text-sm font-bold text-slate-400">🦦 {t('Otter is proud of you!')}</motion.p>
            </div>
        </motion.div>
    )
}


/* ═══════════════════════════════════════════
   OUT OF ENERGY
   The one screen that tells the learner why a lesson refused to open.
   It answers the two questions a locked-out user actually has: how long
   until I can play, and is there anything I can do right now.
   ═══════════════════════════════════════════ */
function OutOfEnergy({ onClose }) {
    // Recomputed on a timer so the countdown is live while the sheet is open —
    // a frozen "29 min" reads like a bug the moment it is watched.
    const [minutes, setMinutes] = useState(() => getEnergyRefillTime())
    useEffect(() => {
        const id = setInterval(() => {
            const m = getEnergyRefillTime()
            setMinutes(m)
            if (m == null || stats.energy > 0) onClose()   // refilled while waiting
        }, 30000)
        return () => clearInterval(id)
    }, [onClose])

    const label = minutes == null ? t('Ready now') : minutes >= 60
        ? `${Math.floor(minutes / 60)} ${t('h')} ${minutes % 60} ${t('min')}`
        : `${minutes} ${t('min')}`

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[350] flex items-end justify-center"
            style={{ background: 'rgba(8,14,26,0.75)' }}>
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-[430px] rounded-t-3xl bg-slate-900 border-t border-slate-700/50 px-6 pt-6 pb-8 flex flex-col items-center gap-3"
                style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))' }}>
                <span className="text-4xl">⚡</span>
                <h2 className="text-xl font-black text-white text-center">{t('Out of energy')}</h2>
                <p className="text-[13px] font-bold text-slate-400 text-center leading-relaxed max-w-[300px]">
                    {t('Lessons cost 1 energy. One refills every 30 minutes.')}
                </p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-800/40">
                    <span className="text-sm">❤️</span>
                    <span className="text-xs font-black text-pink-400">{stats.energy} / {MAX_ENERGY}</span>
                    <span className="text-[10px] font-bold text-slate-500">·</span>
                    <span className="text-[11px] font-bold text-slate-400">{t('Next in')} {label}</span>
                </div>
                {/* Everything below still works at zero energy, so say so rather
                    than leaving the learner with nothing but a wait. */}
                <p className="text-[11px] font-bold text-slate-500 text-center leading-relaxed max-w-[300px]">
                    {t('Meanwhile: duels in the League and your daily Quests cost no energy.')}
                </p>
                <button onClick={onClose}
                    className="w-full max-w-[280px] mt-2 py-3.5 rounded-2xl font-black text-sm text-white bg-teal-500 border-b-[5px] border-teal-700 active:translate-y-[5px] active:border-b-0 transition-all duration-75 cursor-pointer">
                    {t('GOT IT')}
                </button>
            </motion.div>
        </motion.div>
    )
}
