import { useState } from 'react'
import { motion } from 'framer-motion'
import { getCodeSnippet, getOtterMood, stats, journeyNodes, getTipOfTheDay, chapterColors, getExercisesForNode, getActiveLanguage, t, isHapticEnabled, isChestOpened, openChest, LESSON_LENGTH, SHORT_LESSON_LENGTH } from '../data'
import { showXP } from './XPToast'

/* ═══════════════════════════════════════════════════════
   JourneyPath v9 — Mega Feature Pack
   Concept nodes, Playground, Code preview, moods, lesson modal
   ═══════════════════════════════════════════════════════ */

/* Haptic helper */
const haptic = () => { try { if (isHapticEnabled()) navigator.vibrate?.(15) } catch (e) { } }

/* ── SVG Icons ── */
const ICONS = {
    terminal: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M4 17l6-5-6-5" /><path d="M12 19h8" /></svg>,
    brackets: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    play: <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>,
    search: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    pattern: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    boss: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C8 2 4 5.6 4 10c0 2.4 1 4.2 1.8 5.2.2.2.2.5.1.7L4 20h4l1-2h6l1 2h4l-1.9-4.1c-.1-.2-.1-.5.1-.7C19 14.2 20 12.4 20 10c0-4.4-4-8-8-8zM9 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" /></svg>,
    scope: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></svg>,
    lock: <svg width="22" height="22" viewBox="0 0 24 24" fill="white" opacity="0.5"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" /></svg>,
    daily: <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>,
    concept: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 012-2h5v16H6a2 2 0 00-2 2z" /><path d="M20 5a2 2 0 00-2-2h-5v16h5a2 2 0 012 2z" /></svg>,
    playground: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 15l3-3-3-3" /><path d="M13 15h4" /></svg>,
    chest: null,
}

/* Node themes */
const THEMES = {
    completed: { bg: '#0D9488', border: '#115E59', size: 66, depth: 6 },
    active: { bg: '#2DD4BF', border: '#0F766E', size: 74, depth: 6 },
    locked: { bg: '#334155', border: '#0F172A', size: 64, depth: 4 },
    available: { bg: '#2DD4BF', border: '#0F766E', size: 70, depth: 6 },
    chestLock: { bg: '#44403C', border: '#1C1917', size: 66, depth: 4 },
    chest: { bg: '#D97706', border: '#78350F', size: 66, depth: 6 },
    bossLock: { bg: '#44293B', border: '#1C1017', size: 68, depth: 4 },
    boss: { bg: '#DC2626', border: '#7F1D1D', size: 68, depth: 6 },
    daily: { bg: '#D97706', border: '#78350F', size: 60, depth: 6 },
    concept: { bg: '#9333EA', border: '#581C87', size: 66, depth: 6 },
    conceptLock: { bg: '#3B1A5C', border: '#1E0A38', size: 64, depth: 4 },
    playground: { bg: '#4F46E5', border: '#312E81', size: 68, depth: 6 },
    playgroundLock: { bg: '#2A2668', border: '#1E1B4B', size: 64, depth: 4 },
}

const NODE_X = [50, 72, 55, 28, 42]
const getX = i => NODE_X[i % NODE_X.length]
const SPACING = 105

export default function JourneyPath({ nodes }) {
    const [openNodeId, setOpenNodeId] = useState(null)
    const TIP_OFFSET = 160
    const totalH = nodes.length * SPACING + TIP_OFFSET + 120
    return (
        <div className="relative w-full px-2 pt-0 pb-24 z-10" style={{ minHeight: totalH }}>
            {/* ── JOURNEY DEPTH BACKGROUND ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Nebula gradient blobs */}
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04]" style={{top:'10%',left:'-10%',background:'radial-gradient(circle,#06b6d4,transparent 70%)',filter:'blur(60px)'}}/>
                <div className="absolute w-[250px] h-[250px] rounded-full opacity-[0.03]" style={{top:'40%',right:'-5%',background:'radial-gradient(circle,#a855f7,transparent 70%)',filter:'blur(50px)'}}/>
                <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.04]" style={{bottom:'20%',left:'5%',background:'radial-gradient(circle,#14b8a6,transparent 70%)',filter:'blur(40px)'}}/>
                {/* Floating particles */}
                {[...Array(18)].map((_,i)=><div key={i} className="absolute rounded-full animate-pulse" style={{
                    width: 1.5 + (i%3), height: 1.5 + (i%3),
                    background: ['#14b8a6','#06b6d4','#a855f7','#fbbf24'][i%4],
                    opacity: 0.15 + (i%5)*0.05,
                    left: `${(i*17+5)%95}%`, top: `${(i*13+7)%90}%`,
                    animationDuration: `${2+i%4}s`, animationDelay: `${i*0.3}s`,
                    filter: 'blur(0.5px)',
                }}/>)}
                {/* Subtle dot grid */}
                <svg className="absolute inset-0 w-full h-full" style={{opacity:0.02}}>
                    <defs><pattern id="journeyDots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="0.8" fill="#94a3b8"/></pattern></defs>
                    <rect width="100%" height="100%" fill="url(#journeyDots)"/>
                </svg>
            </div>
            {/* Global backdrop to close any open popup */}
            {openNodeId != null && <div className="fixed inset-0 z-20" onClick={() => setOpenNodeId(null)} />}
            {/* path content below — close outer div is at bottom */}
            {(() => {
                const todayTip = getTipOfTheDay(); return (
                    <div className="relative z-20 mx-4 mb-4 mt-2 rounded-2xl px-4 py-3 bg-slate-800/80 border border-teal-700/30 border-b-[3px] border-b-slate-950 flex items-start gap-3">
                        <span className="text-lg mt-0.5">💡</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-extrabold text-teal-400 mb-0.5">{t('TIP OF THE DAY')}</p>
                            <p className="text-[11px] font-bold text-slate-300 leading-snug">{t(todayTip.tip)}</p>
                            <code className="text-[9px] font-mono text-teal-300/80 mt-1 block">{todayTip.code}</code>
                        </div>
                    </div>
                )
            })()}
            {/* SVG path curves */}
            <svg className="absolute top-0 left-0 w-full pointer-events-none z-0" style={{ height: totalH, top: TIP_OFFSET }}
                viewBox={`0 0 430 ${totalH - TIP_OFFSET}`} fill="none" preserveAspectRatio="xMidYMid meet">
                {nodes.map((_, i) => {
                    if (i === 0) return null
                    const px = getX(i - 1) * 4.3, py = (i - 1) * SPACING + 51
                    const cx = getX(i) * 4.3, cy = i * SPACING + 51
                    const my = (py + cy) / 2
                    const done = nodes[i - 1].status === 'completed'
                    return <path key={i} d={`M ${px} ${py} C ${px} ${my}, ${cx} ${my}, ${cx} ${cy}`}
                        stroke={done ? '#0D9488' : '#1E293B'} strokeWidth={done ? 12 : 10}
                        strokeLinecap="round" opacity={done ? 0.55 : 0.45} />
                })}
            </svg>

            {nodes.map((node, i) => {
                const firstActiveIdx = nodes.findIndex(n => n.status === 'active')
                return (
                    <div key={node.id} className="absolute" data-chapter={node.chapter} style={{ zIndex: openNodeId === node.id ? 50 : 10, left: `${getX(i)}%`, top: i * SPACING + TIP_OFFSET + 18, transform: 'translateX(-50%)' }}
                        {...(node.status === 'active' ? { 'data-active-node': true } : {})}>
                        <NodeButton node={node} index={i} openNodeId={openNodeId} setOpenNodeId={setOpenNodeId} showOtter={i === firstActiveIdx} />
                    </div>
                )
            })}

            {/* Streak Shield on path (between active and next) */}
            {stats.streakShield && (() => {
                const activeIdx = nodes.findIndex(n => n.status === 'active')
                if (activeIdx < 0) return null
                const shieldY = (activeIdx + 0.5) * SPACING + TIP_OFFSET + 18
                const shieldX = (getX(activeIdx) + getX(Math.min(activeIdx + 1, nodes.length - 1))) / 2
                return (
                    <div className="absolute z-[5] pointer-events-none" style={{ left: `${shieldX}%`, top: shieldY, transform: 'translateX(-50%)' }}>
                        <div className="w-8 h-8 rounded-full bg-amber-500 border-b-[3px] border-amber-700 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

/* ═══════════════════════════════════════════
   NODE BUTTON — all features integrated
   ═══════════════════════════════════════════ */
function NodeButton({ node, index, openNodeId, setOpenNodeId, showOtter }) {
    // Derive popup type from openNodeId — only this node's popup is visible
    const isOpen = openNodeId === node.id
    const popupType = isOpen ? (node.type === 'concept' ? 'concept' : node.type === 'playground' ? 'playground' : node.type === 'chest' ? 'chest' : 'start') : null

    const setPopup = (val) => {
        if (val) setOpenNodeId(node.id)
        else setOpenNodeId(null)
    }

    const isActive = node.status === 'active'
    const isCompleted = node.status === 'completed'
    const isLocked = node.status === 'locked'
    const isChest = node.type === 'chest'
    const isBoss = node.type === 'boss'
    const isDaily = node.type === 'daily'
    const isConcept = node.type === 'concept'
    const isPlayground = node.type === 'playground'
    const isAvailable = node.status === 'available'

    let theme
    if (isDaily) theme = THEMES.daily
    else if (isConcept) theme = isLocked ? THEMES.conceptLock : THEMES.concept
    else if (isPlayground) theme = isLocked ? THEMES.playgroundLock : THEMES.playground
    else if (isChest) theme = isLocked ? THEMES.chestLock : THEMES.chest
    else if (isBoss) theme = isLocked ? THEMES.bossLock : THEMES.boss
    else theme = THEMES[node.status] || THEMES.locked

    const handleClick = () => {
        haptic()
        if (isOpen) setOpenNodeId(null)
        else setOpenNodeId(node.id)
    }

    // Find the next node to determine otter mood
    const nextNode = journeyNodes[index + 1]
    const mood = getOtterMood(stats.streak, nextNode?.type)

    return (
        <div className="flex flex-col items-center relative" style={{ zIndex: isOpen ? 30 : 10 }}>
            {/* Otter with mood-based expression — only on the first active node */}
            {showOtter && <MoodOtter mood={mood} />}

            {/* Pulse ring */}
            {(isActive || isAvailable) && (
                <div className="absolute rounded-full border-[3px] border-teal-400 animate-soft-pulse pointer-events-none"
                    style={{ width: theme.size + 20, height: theme.size + 20, top: -10, left: '50%', transform: 'translateX(-50%)' }} />
            )}

            {/* THE BUTTON */}
            <button onClick={handleClick}
                className={`
          relative flex items-center justify-center
          ${isChest ? 'rounded-2xl' : 'rounded-full'}
          ${isDaily ? 'animate-shimmer' : ''}
          cursor-pointer active:border-b-0 active:translate-y-[var(--d)]
          transition-all duration-75
        `}
                style={{
                    width: theme.size, height: theme.size,
                    ...(!isDaily ? { backgroundColor: theme.bg } : {}),
                    borderBottom: `${theme.depth}px solid ${theme.border}`,
                    '--d': `${theme.depth}px`,
                }}>
                <span className="relative z-10 flex items-center justify-center">
                    {isBoss ? ICONS.boss
                        : isDaily ? ICONS.daily
                            : isConcept ? ICONS.concept
                                : isPlayground ? ICONS.playground
                                    : isLocked && !isChest ? ICONS.lock
                                        : isChest ? <ChestSVG locked={isLocked} />
                                            : ICONS[node.iconKey] || ICONS.terminal}
                </span>
            </button>

            {/* Daily label */}
            {isDaily && (
                <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 bg-amber-500 rounded-full px-2 py-0.5">
                    <span className="text-[8px] font-black text-amber-950">TODAY</span>
                </div>
            )}

            {/* Lesson Modal */}
            {popupType === 'start' && <LessonModal node={node} onClose={() => setPopup(null)} onStart={() => { window.__openLesson?.(node.id); setPopup(null) }} />}
            {/* Chest reward */}
            {popupType === 'chest' && <ChestModal node={node} onClose={() => setPopup(null)} onStart={() => { window.__openLesson?.(node.id); setPopup(null) }} />}
            {/* Code preview (completed) */}
            {popupType === 'code' && isCompleted && <CodePreview iconKey={node.iconKey} onClose={() => setPopup(null)} />}
            {/* Concept lesson preview */}
            {popupType === 'concept' && <ConceptPreviewModal node={node} onClose={() => setPopup(null)} onStart={() => { window.__openLesson?.(node.id); setPopup(null) }} />}
            {/* Playground */}
            {popupType === 'playground' && <PlaygroundModal node={node} onClose={() => setPopup(null)} onStart={() => { window.__openLesson?.(node.id); setPopup(null) }} />}

            {/* Stars with pop animation */}
            {!isChest && !isDaily && !isConcept && !isPlayground && !isOpen && (
                <div className="flex gap-1 mt-1.5">
                    {[0, 1, 2].map(s => (
                        <div key={s} className={`w-[18px] h-[18px] flex items-center justify-center rounded-full
              ${s < node.stars ? 'bg-yellow-400 border-b-[2px] border-yellow-600' : 'bg-slate-700 border-b-[2px] border-slate-800'}
              ${isCompleted && s < node.stars ? 'animate-star-pop' : ''}
            `} style={isCompleted && s < node.stars ? { animationDelay: `${s * 0.15}s` } : {}}>
                            <svg className={`w-[12px] h-[12px] ${s < node.stars ? 'text-yellow-700' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    ))}
                </div>
            )}

            <span className={`mt-0.5 text-[10px] font-extrabold tracking-wide ${isLocked ? 'text-slate-600' : (isActive || isAvailable) ? 'text-teal-300' : isDaily ? 'text-amber-400' : 'text-slate-400'
                }`}>{t(node.title)}</span>
        </div>
    )
}

/* ═══════════════ CODE PREVIEW POPOVER ═══════════════ */
function CodePreview({ iconKey, onClose }) {
    const snippet = getCodeSnippet(iconKey)
    if (!snippet) return null

    return (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-pop-in w-[200px]">
            <div className="bg-slate-900 border-2 border-slate-700 border-b-[4px] border-b-slate-800 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800">
                    <span className="text-[9px] font-extrabold text-slate-400">{snippet.lang}</span>
                    <button onClick={onClose} className="text-slate-500 hover:text-white text-xs cursor-pointer">✕</button>
                </div>
                {/* Code */}
                <pre className="px-3 py-2 text-[10px] font-mono leading-[1.6] text-teal-300 overflow-hidden">
                    {snippet.code}
                </pre>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-slate-700 rotate-45" />
        </div>
    )
}

/* ═══════════════ LOCKED CODE TEASER ═══════════════ */
// Unused for now but available: blurred code snippet for locked nodes

/* ═══════════════ CHEST SVG ═══════════════ */
function ChestSVG({ locked }) {
    return (
        <svg width="30" height="28" viewBox="0 0 32 28" fill="none">
            <rect x="4" y="12" width="24" height="14" rx="3" fill={locked ? '#57534E' : '#D97706'} />
            <path d="M3 14C3 10 7 6 16 6C25 6 29 10 29 14H3Z" fill={locked ? '#78716C' : '#F59E0B'} />
            <rect x="13" y="14" width="6" height="6" rx="1" fill={locked ? '#44403C' : '#92400E'} />
            <circle cx="16" cy="17" r="1.2" fill={locked ? '#292524' : '#FDE68A'} />
        </svg>
    )
}

/* ═══════════════════════════════════════════
   MOOD OTTER — TEAL/MINT colors to match Flutter mascot
   Expressions change based on context
   ═══════════════════════════════════════════ */
function MoodOtter({ mood }) {
    const eyes = {
        happy: { shape: 'round' },
        cool: { shape: 'cool' },
        sad: { shape: 'sad' },
        sleepy: { shape: 'sleepy' },
        determined: { shape: 'determined' },
        excited: { shape: 'star' },
    }
    const eye = eyes[mood.face] || eyes.happy

    return (
        <div className="absolute -right-[78px] -top-[6px] z-20 pointer-events-none animate-otter-float">
            {/* Speech bubble */}
            <div className="absolute -top-[36px] -left-[10px] animate-bubble-bounce">
                <div className="bg-white rounded-xl px-2.5 py-1 whitespace-nowrap relative">
                    <span className="text-[10px] font-extrabold text-slate-800">{mood.bubble}</span>
                    <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-white rotate-45 rounded-sm" />
                </div>
            </div>

            <div className="relative w-[56px] h-[62px]">
                {/* Body — DARKER TEAL (distinct from buttons) */}
                <div className="absolute inset-0 rounded-[18px] overflow-hidden bg-teal-700 border-b-[4px] border-teal-900">
                    {/* Belly — medium mint */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[34px] h-[28px] rounded-t-[50%] bg-teal-500" />

                    {/* Face with mood eyes */}
                    <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[38px]">
                        <div className="flex justify-center gap-[7px] mb-[2px]">
                            {[0, 1].map(i => (
                                <div key={i} className="relative">
                                    {eye.shape === 'cool' ? (
                                        <div className="w-[11px] h-[7px] bg-slate-900 rounded-sm border border-slate-700" />
                                    ) : eye.shape === 'sad' ? (
                                        <div className="w-[9px] h-[7px] rounded-full bg-white relative">
                                            <div className="absolute top-[2px] left-[2px] w-[4px] h-[4px] bg-slate-900 rounded-full" />
                                        </div>
                                    ) : eye.shape === 'sleepy' ? (
                                        <div className="w-[9px] h-[4px] bg-white rounded-b-full overflow-hidden relative">
                                            <div className="absolute bottom-[0px] left-[2px] w-[4px] h-[3px] bg-slate-900 rounded-full" />
                                        </div>
                                    ) : eye.shape === 'star' ? (
                                        <svg width="10" height="10" viewBox="0 0 20 20" fill="#FCD34D"><path d="M10 0l2.5 6.5L20 7.5l-5 4 1.5 6.5L10 14.5 3.5 18 5 11.5 0 7.5l7.5-1z" /></svg>
                                    ) : eye.shape === 'determined' ? (
                                        <div className="w-[9px] h-[10px] rounded-full bg-white relative">
                                            <div className="absolute top-[1px] left-[1px] w-[5px] h-[6px] bg-slate-900 rounded-full" />
                                            <div className="absolute -top-[3px] left-0 right-0 h-[2px] bg-teal-900 rounded-full" style={{ transform: i === 0 ? 'rotate(-15deg)' : 'rotate(15deg)' }} />
                                        </div>
                                    ) : (
                                        <div className="w-[9px] h-[10px] rounded-full bg-white relative">
                                            <div className="absolute top-[1px] left-[1px] w-[5px] h-[6px] bg-slate-900 rounded-full" />
                                            <div className="absolute top-[1px] right-[1px] w-[2px] h-[2px] bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Nose — dark */}
                        <div className="flex justify-center"><div className="w-[6px] h-[4px] bg-slate-900 rounded-full" /></div>
                        {/* Whiskers */}
                        <div className="flex justify-between mt-[1px]">
                            <div className="flex flex-col gap-[1px] -ml-3">
                                <div className="w-[10px] h-[1px] bg-white/40 -rotate-8" />
                                <div className="w-[8px] h-[1px] bg-white/25 rotate-5" />
                            </div>
                            <div className="flex flex-col gap-[1px] -mr-3">
                                <div className="w-[10px] h-[1px] bg-white/40 rotate-8" />
                                <div className="w-[8px] h-[1px] bg-white/25 -rotate-5" />
                            </div>
                        </div>
                    </div>

                    {/* Mouth */}
                    <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2">
                        {mood.face === 'sad' ? (
                            <div className="w-[10px] h-[5px] border-t-[2px] border-slate-900/50 rounded-t-full" />
                        ) : mood.face === 'excited' ? (
                            <div className="w-[10px] h-[6px] bg-slate-900/40 rounded-b-full" />
                        ) : (
                            <div className="w-[10px] h-[5px] border-b-[2px] border-slate-900/50 rounded-b-full" />
                        )}
                    </div>
                </div>

                {/* Ears — darker teal */}
                <div className="absolute -top-[5px] left-[9px] w-[11px] h-[11px] rounded-full bg-teal-700">
                    <div className="absolute top-[2px] left-[2px] w-[5px] h-[5px] rounded-full bg-teal-500" />
                </div>
                <div className="absolute -top-[5px] right-[9px] w-[11px] h-[11px] rounded-full bg-teal-700">
                    <div className="absolute top-[2px] right-[2px] w-[5px] h-[5px] rounded-full bg-teal-500" />
                </div>

                {/* Cool sunglasses bridge */}
                {mood.face === 'cool' && (
                    <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[5px] h-[1px] bg-slate-700" />
                )}

                {/* Paws */}
                <div className="absolute -bottom-[3px] left-[12px] w-[9px] h-[5px] rounded-b-full bg-teal-800" />
                <div className="absolute -bottom-[3px] right-[12px] w-[9px] h-[5px] rounded-b-full bg-teal-800" />

                {/* Code tablet — white with </> like Flutter mascot */}
                <div className="absolute bottom-[4px] -left-[16px] animate-wiggle">
                    <div className="w-[16px] h-[20px] rounded-[4px] bg-white border-b-[2px] border-slate-300 overflow-hidden flex items-center justify-center">
                        <span className="text-[7px] font-black text-slate-800">&lt;/&gt;</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════ CHEST REWARD MODAL ═══════════════ */
function ChestModal({ node, onClose, onStart }) {
    // The chest is earned: a short lesson first, then the reward. openChest()
    // records which chests have paid out, so re-opening the modal can no longer
    // hand out gems a second time.
    const [reward, setReward] = useState(null)
    const isLocked = node.status === 'locked'
    const isDone = node.status === 'completed'
    const collected = isChestOpened(node.id)

    const handleOpen = () => {
        if (collected || reward) return
        haptic()
        const pick = openChest(node.id)
        if (!pick) return
        setReward(pick)
        try { if (isHapticEnabled()) navigator.vibrate?.([50, 50, 100]) } catch (e) { }
    }

    return (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-pop-in w-[210px]">
            <div className="bg-slate-900 border-2 border-amber-600/50 border-b-[5px] border-b-amber-900 rounded-2xl overflow-hidden">
                <div className="h-2 w-full bg-amber-500" />
                <div className="p-4 text-center">
                    <div className="text-4xl mb-2">{reward ? '✨' : '📦'}</div>
                    <h3 className="text-sm font-black text-white mb-1">
                        {isLocked ? `🔒 ${t('Locked Chest')}` : reward ? t('Opened!') : t('Treasure Chest')}
                    </h3>

                    {isLocked ? (
                        <p className="text-[10px] font-bold text-slate-500 mb-3">{t('Complete previous lessons to unlock')}</p>
                    ) : reward ? (
                        <div className="my-3">
                            <span className="text-3xl">{reward.emoji}</span>
                            <p className="text-sm font-black text-amber-400 mt-2">+{reward.amount} {t(reward.label)}</p>
                        </div>
                    ) : collected ? (
                        <p className="text-[10px] font-bold text-slate-500 mb-3">{t('Already collected')}</p>
                    ) : isDone ? (
                        <p className="text-[10px] font-bold text-slate-500 mb-3">{t('Lesson done — the chest is yours.')}</p>
                    ) : (
                        <p className="text-[10px] font-bold text-slate-500 mb-3">{t('Pass a 4-question round to unlock it.')}</p>
                    )}

                    {!isLocked && !isDone && (
                        <button onClick={() => { haptic(); onStart?.() }}
                            className="w-full py-2.5 rounded-xl font-black text-sm text-white bg-amber-500 border-b-[4px] border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            🎁 {t('EARN IT')}
                        </button>
                    )}
                    {!isLocked && isDone && !collected && !reward && (
                        <button onClick={handleOpen}
                            className="w-full py-2.5 rounded-xl font-black text-sm text-white bg-amber-500 border-b-[4px] border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            🎁 {t('OPEN CHEST')}
                        </button>
                    )}
                    {(isLocked || collected || reward) && (
                        <button onClick={onClose}
                            className="w-full py-2 rounded-xl font-black text-xs text-slate-400 bg-slate-800 border-b-[3px] border-slate-900 active:border-b-0 active:translate-y-[3px] transition-all duration-75 cursor-pointer mt-2">
                            {t('CLOSE')}
                        </button>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-amber-600/50 rotate-45" />
        </div>
    )
}

/* ═══════════════ LESSON PREVIEW MODAL ═══════════════ */
function LessonModal({ node, onClose, onStart }) {
    const chapter = chapterColors[node.chapter] || chapterColors[1]
    const diffStars = node.type === 'boss' ? 3 : node.type === 'daily' ? 2 : 1
    const exercises = getExercisesForNode(node.id, getActiveLanguage())
    // This counted the whole POOL and promised it — "10 questions" above a
    // lesson that serves LESSON_LENGTH of them. It is the first concrete
    // promise the app makes and it was broken on the very first tap. Report
    // what the lesson will actually run.
    const pool = exercises.filter(e => e.type !== 'concept').length
    const roundLength = (node.type === 'chest' || node.type === 'playground')
        ? SHORT_LESSON_LENGTH : LESSON_LENGTH
    const qCount = Math.min(pool, roundLength) || 1

    return (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-pop-in w-[220px]">
            <div className="bg-slate-900 border-2 border-slate-700 border-b-[5px] border-b-slate-800 rounded-2xl overflow-hidden">
                {/* Accent header */}
                <div className="h-2 w-full" style={{ backgroundColor: chapter.accent }} />
                <div className="p-4 text-center">
                    <h3 className="text-sm font-black text-white mb-1">{t(node.title)}</h3>
                    <p className="text-[9px] font-bold text-slate-500 mb-3">{chapter.name} • {qCount} questions</p>

                    {/* Difficulty */}
                    <div className="flex items-center justify-center gap-1 mb-3">
                        <span className="text-[9px] font-extrabold text-slate-500 mr-1">Difficulty:</span>
                        {[0, 1, 2].map(s => (
                            <svg key={s} className={`w-3 h-3 ${s < diffStars ? 'text-amber-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                    </div>

                    {/* Skill tag */}
                    {node.skill && (
                        <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4">
                            <span className="text-[9px] font-extrabold" style={{ color: chapter.accent }}>{node.skill.replace('_', ' ').toUpperCase()}</span>
                        </div>
                    )}

                    {/* START button */}
                    <button onClick={() => { haptic(); onStart?.() }}
                        className="w-full py-2.5 rounded-xl font-black text-sm text-white border-b-[4px] active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer"
                        style={{ backgroundColor: chapter.accent, borderBottomColor: chapter.accent + '80' }}>
                        START
                    </button>
                </div>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-slate-700 rotate-45" />
        </div>
    )
}

/* ═══════════════ CONCEPT LESSON PREVIEW MODAL ═══════════════ */
function ConceptPreviewModal({ node, onStart }) {
    const info = node.concept || {}
    const chapter = chapterColors[node.chapter] || chapterColors[1]
    const isCompleted = node.status === 'completed'
    const isLocked = node.status === 'locked'
    const cards = info.cards || 6

    return (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-pop-in w-[240px]">
            <div className="bg-slate-900 border-2 border-purple-600/50 border-b-[5px] border-b-purple-900 rounded-2xl overflow-hidden">
                {/* Purple accent */}
                <div className="h-2 w-full bg-purple-500" />

                {/* Card-stack preview — three tilted cards, the shape of the lesson */}
                <div className="relative h-[100px] bg-purple-950 flex items-center justify-center overflow-hidden">
                    {[2, 1, 0].map(i => (
                        <div key={i} className="absolute w-[74px] h-[58px] rounded-lg bg-purple-800/70 border border-purple-500/40"
                            style={{ transform: `translateX(${(i - 1) * 16}px) rotate(${(i - 1) * 7}deg)`, opacity: 1 - i * 0.28 }} />
                    ))}
                    <div className="relative w-[74px] h-[58px] rounded-lg bg-slate-900 border border-purple-400/60 flex flex-col justify-center px-2.5 gap-1">
                        <div className="h-[3px] w-[80%] rounded-full bg-purple-400/80" />
                        <div className="h-[2px] w-[95%] rounded-full bg-slate-600" />
                        <div className="h-[2px] w-[60%] rounded-full bg-slate-600" />
                        <div className="h-[2px] w-[85%] rounded-full bg-slate-700" />
                    </div>

                    {/* Length badge */}
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                        <span className="text-[9px] font-bold text-white">{cards} {t('cards')} · ~{info.minutes || 2} {t('min')}</span>
                    </div>

                    {isCompleted && (
                        <div className="absolute top-2 left-2 bg-emerald-500 rounded-full px-2 py-0.5">
                            <span className="text-[7px] font-black text-emerald-950">✓ {t('READ')}</span>
                        </div>
                    )}
                </div>

                <div className="p-4 text-center">
                    <h3 className="text-sm font-black text-white mb-1">{t(node.title)}</h3>
                    <p className="text-[10px] font-bold text-purple-400 mb-1">{t('Swipe-through concept lesson')}</p>
                    <p className="text-[9px] font-bold text-slate-500 mb-3">{t(chapter.name)} • {t('no wrong answers')}</p>

                    {isLocked ? (
                        <p className="text-[10px] font-bold text-slate-500">{t('Complete previous lessons to unlock')}</p>
                    ) : (
                        <button onClick={() => { haptic(); onStart?.() }}
                            className="w-full py-2.5 rounded-xl font-black text-sm text-white bg-purple-600 border-b-[4px] border-purple-800 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer">
                            {isCompleted ? `↺ ${t('READ AGAIN')}` : `📖 ${t('LEARN')}`}
                        </button>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-purple-600/50 rotate-45" />
        </div>
    )
}

/* ═══════════════ PLAYGROUND MODAL ═══════════════ */
function PlaygroundModal({ node, onClose, onStart }) {
    const pg = node.playground || {}
    const lang = getActiveLanguage()
    const starterRaw = pg.starterCode
    const starter = typeof starterRaw === 'object' ? (starterRaw[lang] || starterRaw.python || '') : (starterRaw || '')
    const [code, setCode] = useState(starter)
    const [output, setOutput] = useState(null)
    const [ran, setRan] = useState(false)

    const norm = (s) => (s || '').replace(/\r/g, '').trim()

    const handleRun = () => {
        haptic()
        if (lang === 'javascript') {
            // Real execution — capture console.log from the user's code.
            const logs = []
            const fmt = (v) => (typeof v === 'object' && v !== null) ? JSON.stringify(v) : String(v)
            const sandbox = {
                log: (...a) => logs.push(a.map(fmt).join(' ')),
                error: (...a) => logs.push(a.map(fmt).join(' ')),
                warn: (...a) => logs.push(a.map(fmt).join(' ')),
                info: (...a) => logs.push(a.map(fmt).join(' ')),
            }
            try {
                // eslint-disable-next-line no-new-func
                new Function('console', code)(sandbox)
                setOutput(logs.length ? logs.join('\n') : '(no output)')
            } catch (err) {
                setOutput('⚠️ ' + (err && err.message ? err.message : String(err)))
            }
        } else if (norm(code) === norm(starter)) {
            // Python/Java can't run in-browser offline; show the reference output
            // only for the unedited starter so we never claim a fake result.
            setOutput(pg.expectedOutput || '(no output)')
        } else {
            const langName = lang === 'java' ? 'Java' : 'Python'
            setOutput(`ℹ️ ${langName} ${t('runs on your device, not in this preview.')}\n\n${t('Reference output')}:\n${pg.expectedOutput || ''}`)
        }
        setRan(true)
    }

    const isCorrect = ran && output != null && norm(output) === norm(pg.expectedOutput)

    return (
        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-40 animate-pop-in w-[280px]">
            <div className="bg-slate-900 border-2 border-indigo-600/50 border-b-[5px] border-b-indigo-900 rounded-2xl overflow-hidden">
                {/* Indigo accent */}
                <div className="h-2 w-full bg-indigo-500" />

                <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-black text-white">{t(node.title)}</h3>
                        <button onClick={onClose} className="text-slate-500 hover:text-white text-xs cursor-pointer font-bold">✕</button>
                    </div>

                    {/* Short lesson — the sandbox teaches nothing on its own, so the
                        node opens with four questions and keeps the editor below. */}
                    {node.status !== 'locked' && (
                        <button onClick={() => { haptic(); onStart?.() }}
                            className="w-full py-2 rounded-xl font-black text-xs text-white bg-indigo-500 border-b-[4px] border-indigo-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer mb-2.5">
                            📖 {node.status === 'completed' ? t('REPLAY THE ROUND') : t('4-QUESTION ROUND')}
                        </button>
                    )}

                    {/* Code editor */}
                    <div className="rounded-xl overflow-hidden border border-indigo-800/50 mb-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-[8px] font-bold text-slate-500 ml-auto">{(() => { const l = getActiveLanguage(); return l === 'java' ? 'Main.java' : l === 'javascript' ? 'main.js' : 'main.py' })()}</span>
                        </div>
                        <textarea
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full h-[90px] bg-slate-950 text-[10px] font-mono text-teal-300 p-3 border-none outline-none resize-none leading-relaxed"
                            spellCheck="false"
                        />
                    </div>

                    {/* RUN button */}
                    <button onClick={handleRun}
                        className="w-full py-2 rounded-xl font-black text-xs text-white bg-indigo-500 border-b-[4px] border-indigo-700 active:border-b-0 active:translate-y-[4px] transition-all duration-75 cursor-pointer mb-2">
                        ▶ RUN CODE
                    </button>

                    {/* Output console */}
                    {ran && (
                        <div className={`rounded-xl overflow-hidden border ${isCorrect ? 'border-emerald-600/50' : 'border-slate-700'}`}>
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800">
                                <span className="text-[8px] font-bold text-slate-500">OUTPUT</span>
                                {isCorrect && <span className="text-[8px] font-black text-emerald-400">✓ CORRECT!</span>}
                            </div>
                            <pre className="px-3 py-2 text-[10px] font-mono text-emerald-300 bg-slate-950 whitespace-pre-wrap">
                                {output}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-indigo-600/50 rotate-45" />
        </div>
    )
}
