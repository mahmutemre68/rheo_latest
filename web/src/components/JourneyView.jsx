import { useState, useEffect, useRef, useCallback } from 'react'
import { stats, journeyNodes, getSkillRadar, chapterColors, languages, setActiveLanguage, getActiveLanguage, getTipOfTheDay, getWeakExercises, t } from '../data'
import JourneyPath from './JourneyPath'
import PlacementCheck from './PlacementCheck'
import DebugMission from './DebugMission'

export default function JourneyView() {
    const [checkLanguage, setCheckLanguage] = useState(null)
    const [debugLanguage, setDebugLanguage] = useState(null)
    const scrollRef = useRef(null)
    const [visibleChapter, setVisibleChapter] = useState(() => {
        const activeIdx = journeyNodes.findIndex(n => n.status === 'active')
        return activeIdx >= 0 ? journeyNodes[activeIdx].chapter : 1
    })

    // Auto-scroll to active node on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const activeEl = scrollRef.current?.querySelector('[data-active-node]')
            activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 400)
        return () => clearTimeout(timer)
    }, [])

    // Track which chapter is visible based on scroll position
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return
        const handleScroll = () => {
            const chapterEls = container.querySelectorAll('[data-chapter]')
            const containerTop = container.scrollTop + container.offsetHeight / 3
            let currentCh = 1
            chapterEls.forEach(el => {
                if (el.offsetTop <= containerTop) {
                    currentCh = parseInt(el.dataset.chapter) || currentCh
                }
            })
            setVisibleChapter(currentCh)
        }
        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToChapter = useCallback((chapterNum) => {
        const container = scrollRef.current
        if (!container) return
        const target = container.querySelector(`[data-chapter="${chapterNum}"]`)
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [])

    const weaks = getWeakExercises()

    return (
        <>
        {checkLanguage && <PlacementCheck language={checkLanguage} onClose={() => setCheckLanguage(null)} />}
        {debugLanguage && <DebugMission language={debugLanguage} onClose={() => setDebugLanguage(null)} />}
        <div inert={checkLanguage || debugLanguage ? true : undefined} className="h-full flex flex-col overflow-hidden relative">
            <TopBar />
            <button onClick={() => setCheckLanguage(getActiveLanguage())}
                className="mx-3 mb-2 shrink-0 text-left rounded-xl border border-teal-900 bg-teal-950/40 px-4 py-3 text-sm font-bold text-teal-200">
                {t('Quick code check')} <span className="font-normal text-slate-400">· {t('3 questions · optional')}</span>
            </button>
            <button onClick={() => setDebugLanguage(getActiveLanguage())}
                className="mx-3 mb-2 shrink-0 text-left rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300">
                Debug Mission <span className="text-xs text-slate-400">· {t('Optional prototype')}</span>
            </button>
            <ChapterMap visibleChapter={visibleChapter} onChapterClick={scrollToChapter} />
            <UnitHeader visibleChapter={visibleChapter} />
            <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <EnvironmentBg />
                <JourneyPath nodes={journeyNodes} />
            </div>

            {/* Spaced Repetition Floating Button */}
            {weaks.length > 0 && (
                <div className="absolute bottom-6 right-4 z-40 pointer-events-auto">
                    <div className="relative group">
                        {/* Ping animation behind */}
                        <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>
                        <button 
                            onClick={() => window.__openLesson?.('review_weaknesses')}
                            className="relative flex items-center gap-2 px-4 py-3 bg-rose-600 text-white rounded-full shadow-lg shadow-rose-900/50 border-b-[4px] border-rose-800 active:translate-y-[4px] active:border-b-0 transition-all cursor-pointer font-black text-sm">
                            <span className="text-lg">❤️‍🩹</span>
                            <span>{t('Review')} ({weaks.length})</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}

/* ═══════════════ CHAPTER MAP — horizontal progress ═══════════════ */
function ChapterMap({ visibleChapter, onChapterClick }) {
    const chapters = Object.entries(chapterColors)

    return (
        <div className="mx-3 mb-2 shrink-0 z-10 relative">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {chapters.map(([num, ch]) => {
                    const n = parseInt(num)
                    const nodesInChapter = journeyNodes.filter(nd => nd.chapter === n)
                    const completed = nodesInChapter.filter(nd => nd.status === 'completed').length
                    const total = nodesInChapter.length
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                    const isActive = n === visibleChapter
                    const isPast = n < visibleChapter
                    const isFuture = n > visibleChapter

                    return (
                        <div key={num}
                            onClick={() => onChapterClick(n)}
                            className={`flex-1 min-w-[64px] rounded-xl px-2.5 py-2 text-center border-b-[3px] transition-all cursor-pointer active:scale-95
                                ${isActive ? 'bg-teal-500/15 border-teal-800 border border-teal-600/30'
                                    : isPast ? 'bg-slate-800/60 border-slate-950 border border-slate-700/20'
                                        : 'bg-slate-900/40 border-slate-950 border border-slate-800/20 opacity-40'}`}>
                            <p className={`text-[8px] font-extrabold tracking-wider ${isActive ? 'text-teal-400' : isPast ? 'text-slate-500' : 'text-slate-600'}`}>
                                CH {num}
                            </p>
                            <p className={`text-[9px] font-black mt-0.5 ${isActive ? 'text-white' : isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                                {t(ch.name)}
                            </p>
                            {/* Mini progress */}
                            <div className="mt-1.5 h-[4px] rounded-full bg-slate-900/60 overflow-hidden">
                                <div className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${pct}%`,
                                        backgroundColor: isActive ? '#14B8A6' : isPast ? '#475569' : '#1E293B'
                                    }} />
                            </div>
                            <p className={`text-[7px] font-bold mt-0.5 ${isActive ? 'text-teal-500/80' : 'text-slate-600/60'}`}>
                                {isPast && pct === 100 ? '✓' : `${pct}%`}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/* ═══════════════ TOP BAR — with language picker ═══════════════ */
function TopBar() {
    const [showPicker, setShowPicker] = useState(false)
    const currentLang = languages.find(l => l.id === getActiveLanguage()) || languages[0]
    const { streak, gems, energy } = stats

    const handleLangChange = (langId) => {
        setActiveLanguage(langId)
        setShowPicker(false)
        window.__refreshApp?.()
    }

    // Check if we came from main app (has referrer or URL param)
    const fromMainApp = window.location.pathname.startsWith('/journey')

    return (
        <div className="relative flex items-center justify-between px-4 pb-2 shrink-0 z-20"
            style={{ paddingTop: 'max(14px, env(safe-area-inset-top, 14px))' }}>
            {fromMainApp && (
                <button onClick={() => window.location.href = '/'}
                    className="flex items-center justify-center w-9 h-9 mr-2 rounded-xl bg-slate-800 border-b-[3px] border-slate-950 active:border-b-0 active:translate-y-[3px] transition-all duration-75 cursor-pointer">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
            <div className="relative">
                <button onClick={() => setShowPicker(p => !p)}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2 bg-slate-800 border-b-[3px] border-slate-950 active:border-b-0 active:translate-y-[3px] transition-all duration-75 font-extrabold text-sm text-white cursor-pointer">
                    <span className="text-lg">{currentLang.icon}</span>
                    <span>{currentLang.name}</span>
                    <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {/* Language Picker Dropdown */}
                {showPicker && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowPicker(false)} />
                        <div className="absolute top-full left-0 mt-2 w-52 rounded-2xl bg-slate-800 border border-slate-700/50 border-b-[4px] border-b-slate-950 overflow-hidden shadow-2xl z-40">
                            {languages.map(lang => (
                                <button key={lang.id} onClick={() => handleLangChange(lang.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition cursor-pointer
                                        ${lang.id === currentLang.id ? 'bg-teal-500/10' : ''}`}>
                                    <span className="text-xl">{lang.icon}</span>
                                    <span className="font-bold text-sm text-white">{lang.name}</span>
                                    {lang.id === currentLang.id && <span className="ml-auto text-teal-400 text-xs">✓</span>}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center gap-2">
                <StatPill icon={<FireSVG />} value={streak} bg="bg-orange-500/15" border="border-orange-800" text="text-orange-400" />
                <StatPill icon={<GemSVG />} value={gems} bg="bg-sky-500/15" border="border-sky-800" text="text-sky-400" />
                <StatPill icon={<EnergySVG />} value={energy} bg="bg-pink-500/15" border="border-pink-800" text="text-pink-400" />
            </div>
        </div>
    )
}

function StatPill({ icon, value, bg, border, text }) {
    return (
        <div className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 ${bg} border-b-[3px] ${border}`}>
            {icon}{' '}
            <span className={`text-sm font-black ${text}`}>{value}</span>
        </div>
    )
}

function FireSVG() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#FB923C"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" /></svg> }
function GemSVG() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 2L4 9l8 13 8-13-8-7z" /></svg> }
function EnergySVG() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="#F472B6"><path d="M7 2v11h3v9l7-12h-4l4-8z" /></svg> }

/* ═══════════════ UNIT HEADER — proper spacing below stats ═══════════════ */
function UnitHeader({ visibleChapter }) {
    const chapter = chapterColors[visibleChapter] || chapterColors[1]
    const chapterNum = visibleChapter
    const nodesInChapter = journeyNodes.filter(n => n.chapter === chapterNum)
    const activeNode = nodesInChapter.find(n => n.status === 'active') || nodesInChapter[0]
    const nodeTitle = activeNode ? activeNode.title : chapter?.name || 'Get Started'
    const nodeSkill = activeNode?.skill ? activeNode.skill.replace('_', ' ') : 'basics'

    return (
        <div className="mx-3 mb-2 shrink-0 z-10 relative">
            <div className="relative rounded-2xl px-5 py-4 bg-teal-600 border-b-[5px] border-teal-800 active:border-b-[1px] active:translate-y-[4px] transition-all duration-75 cursor-pointer overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex-1 pr-4">
                        <p className="text-[10px] font-extrabold text-teal-200/60 tracking-[0.2em] uppercase">{t('Chapter')} {chapterNum} • {t(chapter?.name || 'Basics')}</p>
                        <h2 className="text-[17px] font-black text-white mt-0.5 leading-tight">{t(nodeTitle)}<br /><span className="text-teal-200/70 text-[13px] capitalize">{t(nodeSkill)}</span></h2>
                    </div>
                    <SkillRadar />
                </div>
                {stats.streakShield && (
                    <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 rounded-full bg-teal-700 border border-teal-500/50 flex items-center justify-center" title="Streak Shield Active">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FCD34D"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ═══════════════ SKILL RADAR ═══════════════ */
function SkillRadar() {
    const skills = Object.values(getSkillRadar())
    const n = skills.length
    const cx = 28, cy = 28, R = 22

    const getPoint = (i, r) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
    }

    const outerPoints = skills.map((_, i) => getPoint(i, R).join(',')).join(' ')
    const midPoints = skills.map((_, i) => getPoint(i, R * 0.5).join(',')).join(' ')
    const dataPoints = skills.map((s, i) => getPoint(i, R * s.score / 100).join(',')).join(' ')

    return (
        <div className="w-14 h-14 rounded-xl bg-teal-700 border-b-[3px] border-teal-900 flex items-center justify-center shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56">
                <polygon points={outerPoints} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <polygon points={midPoints} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <polygon points={dataPoints} fill="rgba(45,212,191,0.4)" stroke="#2DD4BF" strokeWidth="1.5" />
                {skills.map((_, i) => {
                    const [x, y] = getPoint(i, R)
                    return <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.3)" />
                })}
            </svg>
        </div>
    )
}

/* ═══════════════ ENVIRONMENT BG — Time-based atmosphere ═══════════════ */
function EnvironmentBg() {
    const hour = new Date().getHours()
    // Time-based themes
    const isMorning = hour >= 6 && hour < 12
    const isAfternoon = hour >= 12 && hour < 18
    const isEvening = hour >= 18 && hour < 22
    const isNight = hour >= 22 || hour < 6

    const topGradient = isMorning ? 'rgba(234,179,8,0.08)'
        : isAfternoon ? 'rgba(6,78,59,0.08)'
            : isEvening ? 'rgba(88,28,135,0.08)'
                : 'rgba(15,23,42,0.15)'

    const midGradient = isMorning ? 'rgba(251,191,36,0.06)'
        : isAfternoon ? 'rgba(6,78,100,0.06)'
            : isEvening ? 'rgba(126,34,206,0.06)'
                : 'rgba(30,58,138,0.06)'

    const particleEmoji = isMorning ? '☀️' : isAfternoon ? '🍃' : isEvening ? '✨' : '⭐'
    const particleOpacity = isNight ? 'text-indigo-300/20' : isMorning ? 'text-amber-400/15' : isEvening ? 'text-purple-400/15' : 'text-teal-500/10'

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[400px]" style={{ background: `linear-gradient(180deg, ${topGradient} 0%, transparent 100%)` }}>
                {[...Array(4)].map((_, i) => (
                    <div key={`p-${i}`} className={`absolute animate-float-particle ${particleOpacity}`} style={{
                        left: `${15 + i * 20}%`, top: `${10 + i * 15}%`, fontSize: '12px',
                        animationDelay: `${i * 1.2}s`, animationDuration: `${3 + i}s`,
                    }}>{particleEmoji}</div>
                ))}
            </div>
            <div className="absolute top-[400px] left-0 right-0 h-[400px]" style={{ background: `linear-gradient(180deg, transparent 0%, ${midGradient} 50%, transparent 100%)` }}>
                {[...Array(5)].map((_, i) => (
                    <div key={`b-${i}`} className={`absolute rounded-full animate-float-particle ${isNight ? 'bg-indigo-400/[0.06]' : isEvening ? 'bg-purple-400/[0.08]' : isMorning ? 'bg-amber-400/[0.08]' : 'bg-sky-400/[0.08]'}`} style={{
                        width: 4 + i * 2, height: 4 + i * 2,
                        left: `${10 + i * 18}%`, top: `${20 + i * 12}%`,
                        animationDelay: `${i * 0.8}s`, animationDuration: `${4 + i}s`,
                    }} />
                ))}
            </div>
            <div className="absolute top-[800px] left-0 right-0 h-[400px]">
                {[...Array(6)].map((_, i) => (
                    <div key={`g-${i}`} className="absolute rounded-full animate-soft-pulse" style={{
                        width: 3, height: 3,
                        backgroundColor: isNight
                            ? ['#818CF8', '#A78BFA', '#38BDF8', '#818CF8', '#C084FC', '#38BDF8'][i]
                            : isEvening
                                ? ['#A78BFA', '#C084FC', '#E879F9', '#A78BFA', '#818CF8', '#C084FC'][i]
                                : isMorning
                                    ? ['#FCD34D', '#FB923C', '#EAB308', '#FCD34D', '#FBBF24', '#F59E0B'][i]
                                    : ['#2DD4BF', '#38BDF8', '#C084FC', '#2DD4BF', '#FB923C', '#34D399'][i],
                        opacity: 0.15,
                        left: `${8 + i * 16}%`, top: `${10 + (i * 17) % 80}%`,
                        animationDelay: `${i * 0.5}s`,
                    }} />
                ))}
            </div>
            {/* Night mode: moon + extra stars */}
            {isNight && (
                <>
                    <div className="absolute top-[30px] right-[40px] w-[24px] h-[24px] rounded-full bg-amber-200 shadow-lg shadow-amber-200/30" />
                    {[...Array(20)].map((_, i) => (
                        <div key={`star-${i}`} className="absolute rounded-full bg-white animate-soft-pulse" style={{
                            width: 1.5 + Math.random(), height: 1.5 + Math.random(),
                            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                            opacity: 0.1 + Math.random() * 0.15,
                            animationDelay: `${i * 0.3}s`,
                        }} />
                    ))}
                </>
            )}
            {/* Morning mode: sun glow */}
            {isMorning && (
                <div className="absolute top-[20px] right-[30px] w-[30px] h-[30px] rounded-full bg-amber-400/30 shadow-xl shadow-amber-400/20 animate-soft-pulse" />
            )}
        </div>
    )
}
