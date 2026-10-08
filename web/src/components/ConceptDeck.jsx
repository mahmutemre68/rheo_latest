import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getLocale, t, isHapticEnabled } from '../data'
import { pickLocale } from '../data/concepts.js'
import { haptic as nativeHaptic } from '../nativeBridge'

/* ═══════════════════════════════════════════════════════
   CONCEPT DECK — swipeable micro-lesson (konu anlatımı)
   Replaces the old video byte: 6 story-style cards that teach
   the chapter, one idea per card.

   Attention model — deliberately borrowed from stories/reels:
     · one idea per screen, never a wall of text
     · segmented progress bar, so the end is always visible
     · swipe or tap to advance; the learner sets the pace
     · CONTINUE stays locked until the last card is reached
   ═══════════════════════════════════════════════════════ */

const haptic = (style = 'selection') => { if (isHapticEnabled()) nativeHaptic(style) }

const SWIPE_THRESHOLD = 55   // px of drag before it counts as a swipe

export default function ConceptDeck({ deck, accent = '#2DD4BF', onFinish }) {
    const cards = deck?.cards || []
    const locale = getLocale()
    const [index, setIndex] = useState(0)
    const [dir, setDir] = useState(1)
    const finished = useRef(false)
    const pointerStart = useRef(null)
    const swiped = useRef(false)

    const total = cards.length
    const card = cards[index]

    const go = (next) => {
        if (next < 0 || next >= total) return
        setDir(next > index ? 1 : -1)
        setIndex(next)
        haptic()
    }

    // The lesson unlocks once the learner has actually reached the last card —
    // not on mount, and not by tapping CONTINUE past it.
    useEffect(() => {
        if (finished.current) return
        if (index === total - 1 && total > 0) {
            finished.current = true
            onFinish?.()
        }
    }, [index, total, onFinish])

    // Arrow keys for anyone on a keyboard (web build, tablets with covers)
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') go(index + 1)
            else if (e.key === 'ArrowLeft') go(index - 1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    })

    if (!card) return null

    const isLast = index === total - 1

    return (
        <div className="select-none">
            {/* ── Header: title + card counter ── */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">📖</span>
                    <p className="text-sm font-black text-white truncate">
                        {locale === 'tr' ? deck.titleTr : deck.titleEn}
                    </p>
                </div>
                <span className="text-[10px] font-black text-slate-500 shrink-0">
                    {index + 1} / {total}
                </span>
            </div>

            {/* ── Segmented progress ── */}
            <div className="flex gap-1 mb-3">
                {cards.map((_, i) => (
                    <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-slate-800">
                        <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: accent }}
                            initial={false}
                            animate={{ width: i <= index ? '100%' : '0%' }}
                            transition={{ duration: 0.25 }}
                        />
                    </div>
                ))}
            </div>

            {/* ── Card stage ──
                The draggable shell is one persistent element and only its
                contents are keyed on the index. An AnimatePresence exit here
                would fight the drag gesture for the same x transform and could
                leave the outgoing card mounted forever — the deck would then
                show card 1 while the counter read 2/6. */}
            <div className="relative">
                <motion.div
                    drag="x"
                    dragElastic={0.18}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragSnapToOrigin
                    // The card follows the finger via drag, but the decision is
                    // made from the raw pointer delta: it fires for a plain
                    // press-and-move too, so a slow swipe still turns the page.
                    onPointerDown={e => { pointerStart.current = e.clientX; swiped.current = false }}
                    onPointerUp={e => {
                        const from = pointerStart.current
                        pointerStart.current = null
                        if (from == null) return
                        const dx = e.clientX - from
                        if (dx < -SWIPE_THRESHOLD) { swiped.current = true; go(index + 1) }
                        else if (dx > SWIPE_THRESHOLD) { swiped.current = true; go(index - 1) }
                    }}
                    onPointerCancel={() => { pointerStart.current = null }}
                    className="relative rounded-2xl bg-slate-900 border border-slate-700/50 border-b-[5px] border-b-slate-950 overflow-hidden cursor-grab active:cursor-grabbing"
                >
                    {/* Accent rail — the chapter colour, so the deck feels part of the map */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: dir * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="p-4 min-h-[300px] flex flex-col"
                    >
                        <CardBody card={card} locale={locale} accent={accent} />
                    </motion.div>

                    {/* Invisible tap zones: left third = back, right two-thirds = next.
                        Sits under the card content so code blocks stay scrollable.
                        A swipe ends with a click on whichever zone it started
                        over, so a completed swipe swallows that click. */}
                    <button aria-label="previous" onClick={() => { if (swiped.current) { swiped.current = false; return } go(index - 1) }}
                        className="absolute inset-y-0 left-0 w-1/3 z-0 cursor-pointer" />
                    <button aria-label="next" onClick={() => { if (swiped.current) { swiped.current = false; return } go(index + 1) }}
                        className="absolute inset-y-0 right-0 w-2/3 z-0 cursor-pointer" />
                </motion.div>
            </div>

            {/* ── Footer: swipe hint / done badge ── */}
            <div className="flex items-center justify-center gap-2 mt-3 h-5">
                {!isLast ? (
                    <motion.div
                        className="flex items-center gap-1.5"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                        <span className="text-[10px] font-black text-slate-500">{t('Swipe to continue')}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round">
                            <path d="M9 6l6 6-6 6" />
                        </svg>
                    </motion.div>
                ) : (
                    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-black" style={{ color: accent }}>
                        {t('Lesson read — tap CONTINUE')}
                    </motion.span>
                )}
            </div>
        </div>
    )
}

/* ═══════════════ CARD BODIES ═══════════════ */
function CardBody({ card, locale, accent }) {
    const title = pickLocale(card.title, locale)
    const body = pickLocale(card.body, locale)

    if (card.kind === 'hook') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2 relative z-10 pointer-events-none">
                <motion.span
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="text-6xl mb-4">{card.icon}</motion.span>
                <h3 className="text-lg font-black text-white leading-tight mb-3">{title}</h3>
                <p className="text-[13px] font-bold text-slate-400 leading-relaxed max-w-[280px]">{body}</p>
            </div>
        )
    }

    if (card.kind === 'compare') {
        return (
            <div className="relative z-10 pointer-events-none">
                <CardHeading icon={card.icon} title={title} accent={accent} />
                <div className="space-y-2.5 mb-3">
                    <ComparePane tone="bad" pane={card.bad} locale={locale} />
                    <ComparePane tone="good" pane={card.good} locale={locale} />
                </div>
                {body && <p className="text-[12px] font-bold text-slate-400 leading-relaxed">{body}</p>}
            </div>
        )
    }

    if (card.kind === 'pitfall') {
        return (
            <div className="relative z-10 pointer-events-none">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{card.icon || '⚠️'}</span>
                    <h3 className="text-[15px] font-black text-amber-400 leading-tight">{title}</h3>
                </div>
                {card.code && <CodeCard lines={card.code} tone="warn" />}
                {body && <p className="text-[12px] font-bold text-slate-400 leading-relaxed mt-3">{body}</p>}
            </div>
        )
    }

    if (card.kind === 'recap') {
        return (
            <div className="relative z-10 pointer-events-none">
                <CardHeading icon={card.icon} title={title} accent={accent} />
                <div className="space-y-2.5">
                    {(card.bullets || []).map((b, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * i }}
                            className="flex items-start gap-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40 px-3 py-2.5">
                            <span className="text-[11px] font-black shrink-0 mt-[1px]" style={{ color: accent }}>{i + 1}</span>
                            <p className="text-[12px] font-bold text-slate-300 leading-relaxed">{pickLocale(b, locale)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    // 'idea' and 'code' share the same shape: heading → body → code → caption
    return (
        <div className="relative z-10 pointer-events-none">
            <CardHeading icon={card.icon} title={title} accent={accent} />
            {body && <p className="text-[12.5px] font-bold text-slate-400 leading-relaxed mb-3">{body}</p>}
            {card.code && <CodeCard lines={card.code} />}
            {card.caption && (
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed mt-2.5">
                    💡 {pickLocale(card.caption, locale)}
                </p>
            )}
        </div>
    )
}

function CardHeading({ icon, title, accent }) {
    return (
        <div className="flex items-start gap-2 mb-2.5">
            <span className="text-lg leading-none mt-[1px]">{icon}</span>
            <h3 className="text-[15px] font-black leading-tight" style={{ color: accent }}>{title}</h3>
        </div>
    )
}

function ComparePane({ tone, pane, locale }) {
    if (!pane) return null
    const bad = tone === 'bad'
    return (
        <div className={`rounded-xl overflow-hidden border ${bad ? 'border-red-700/40 bg-red-500/5' : 'border-emerald-700/40 bg-emerald-500/5'}`}>
            <div className="flex items-center gap-1.5 px-3 py-1.5">
                <span className="text-[11px]">{bad ? '❌' : '✅'}</span>
                <span className={`text-[9px] font-black uppercase tracking-wide ${bad ? 'text-red-400' : 'text-emerald-400'}`}>
                    {pickLocale(pane.label, locale)}
                </span>
            </div>
            <pre className="px-3 pb-2.5 font-mono text-[11px] leading-[1.6] overflow-x-auto pointer-events-auto">
                {(pane.code || []).map((line, i) => <CodeLine key={i} text={line} />)}
            </pre>
        </div>
    )
}

function CodeCard({ lines, tone }) {
    return (
        <div className={`rounded-xl bg-slate-950 border overflow-hidden ${tone === 'warn' ? 'border-amber-700/40' : 'border-slate-700/50'}`}>
            <pre className="px-3.5 py-3 font-mono text-[11.5px] leading-[1.65] overflow-x-auto pointer-events-auto">
                {lines.map((line, i) => <CodeLine key={i} text={line} />)}
            </pre>
        </div>
    )
}

/* Lightweight highlighter — same palette as the exercise screens so a concept
   card and a question card read as one product. */
const KEYWORDS = ['def', 'for', 'if', 'in', 'return', 'print', 'while', 'else', 'elif', 'range', 'True', 'False', 'None',
    'import', 'from', 'class', 'and', 'or', 'not', 'self', 'lambda',
    'function', 'const', 'let', 'var', 'new', 'null', 'undefined', 'true', 'false', 'this', 'typeof', 'instanceof',
    'static', 'void', 'int', 'double', 'boolean', 'char', 'String', 'public', 'private', 'switch', 'case', 'default', 'break']
const BUILTINS = ['len', 'str', 'list', 'dict', 'append', 'pop', 'popleft', 'push', 'shift', 'console', 'log', 'System',
    'out', 'println', 'deque', 'collections', 'Node', 'Deque', 'Queue', 'ArrayDeque', 'ArrayList', 'List', 'Map', 'Set',
    'Number', 'Math', 'reduce', 'offer', 'poll', 'clear', 'remove', 'equals', 'input', 'type']

function CodeLine({ text }) {
    const trimmed = text.trimStart()
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
        return <div className="text-slate-600 whitespace-pre">{text || ' '}</div>
    }
    if (!text) return <div>{' '}</div>

    // Split off a trailing comment so its contents are not highlighted as code
    const commentAt = findCommentStart(text)
    const codePart = commentAt >= 0 ? text.slice(0, commentAt) : text
    const commentPart = commentAt >= 0 ? text.slice(commentAt) : ''

    const tokens = codePart.split(/(\s+|[()[\]{},.:;=+\-*/%<>!&|?]+|"[^"]*"|'[^']*'|`[^`]*`)/g).filter(Boolean)
    return (
        <div className="whitespace-pre text-slate-300">
            {tokens.map((token, i) => {
                const tk = token.trim()
                if (KEYWORDS.includes(tk)) return <span key={i} className="text-purple-400">{token}</span>
                if (BUILTINS.includes(tk)) return <span key={i} className="text-sky-400">{token}</span>
                if (/^\d+(\.\d+)?$/.test(tk)) return <span key={i} className="text-amber-300">{token}</span>
                if (/^["'`]/.test(tk)) return <span key={i} className="text-emerald-400">{token}</span>
                if (/^[()[\]{},.:;=+\-*/%<>!&|?]+$/.test(tk)) return <span key={i} className="text-slate-500">{token}</span>
                return <span key={i}>{token}</span>
            })}
            {commentPart && <span className="text-slate-600">{commentPart}</span>}
        </div>
    )
}

/* A # or // only starts a comment outside of a string literal. */
function findCommentStart(text) {
    let quote = null
    for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (quote) { if (c === quote) quote = null; continue }
        if (c === '"' || c === "'" || c === '`') { quote = c; continue }
        if (c === '#') return i
        if (c === '/' && text[i + 1] === '/') return i
    }
    return -1
}
