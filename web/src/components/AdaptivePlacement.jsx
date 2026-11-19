import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t, loadLanguageBank, languages } from '../data'
import { getBand } from '../data/adaptive.js'
import {
    buildPlacementPool, createPlacementSession, nextPlacementItem, answerPlacement,
    isPlacementDone, placementResult, PLACEMENT_LENGTH,
} from '../data/placement.js'
import LivingOtter from './LivingOtter'
import { haptic } from '../nativeBridge.js'

const CHAPTER_NAMES = ['Basics', 'Flow Control', 'Loops', 'Functions', 'Data Struct I', 'Algorithms I', 'Data Struct II', 'Algorithms II', 'Advanced', 'Mastery']

/**
 * Adaptive placement test.
 *   language    — journey language to place in
 *   experience  — 'some' | 'experienced'; omitted → ask first (journey entry)
 *   onDone(r)   — r = result to apply, or null to keep the journey as it is
 * No hearts, no timer, no right/wrong feedback mid-test (it would only add
 * pressure and turn the test into a lesson); the result screen explains.
 */
export default function AdaptivePlacement({ language, experience: givenExperience, onDone }) {
    const [experience, setExperience] = useState(givenExperience || null)
    const [session, setSession] = useState(null)
    const [entry, setEntry] = useState(null)
    const [picked, setPicked] = useState(null)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(false)
    const locked = useRef(false)
    const heading = useRef(null)

    useEffect(() => {
        if (!experience) return
        let cancelled = false
        loadLanguageBank(language).then(() => {
            if (cancelled) return
            const s = createPlacementSession(experience, buildPlacementPool(language))
            setSession(s)
            setEntry(nextPlacementItem(s))
        }).catch(() => !cancelled && setError(true))
        return () => { cancelled = true }
    }, [experience, language])

    useEffect(() => { heading.current?.focus() }, [entry, result])

    const answer = index => {
        if (locked.current || !entry) return
        locked.current = true
        setPicked(index)
        haptic('selection')
        const correct = index === entry.item.correct
        setTimeout(() => {
            const next = answerPlacement(session, entry, correct)
            setSession(next)
            setPicked(null)
            locked.current = false
            if (isPlacementDone(next)) { setEntry(null); setResult(placementResult(next)) }
            else setEntry(nextPlacementItem(next))
        }, 220)
    }

    const langName = languages.find(l => l.id === language)?.name || language
    const answered = session?.asked.length || 0
    const ex = entry?.item

    return (
        <motion.section role="dialog" aria-modal="true" aria-labelledby="placement-title"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); onDone(null) } }}
            className="fixed inset-0 z-[300] flex flex-col bg-slate-950 text-white">
            <header className="flex items-center gap-3 px-5 py-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
                <button onClick={() => onDone(null)} aria-label={t('Close')} className="text-slate-400 text-xl px-1">✕</button>
                <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden" aria-hidden="true">
                    <motion.div className="h-full bg-teal-400 rounded-full" animate={{ width: `${(result ? 1 : answered / PLACEMENT_LENGTH) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-400">{langName}</span>
            </header>

            <div className="flex-1 overflow-y-auto px-5 pb-8">
                <div className="max-w-md mx-auto">
                    {!experience && (
                        <div className="pt-4 space-y-5">
                            <LivingOtter size={80} mood="thinking" showGlow={false} />
                            <h1 id="placement-title" ref={heading} tabIndex={-1} className="text-2xl font-black outline-none">{t('Find your level')}</h1>
                            <p className="text-slate-300 leading-relaxed">{t('Up to 8 questions from across the journey. They get harder when you are right and easier when you are not. No hearts, no timer.')}</p>
                            <p className="text-sm text-slate-400">{t('Chapters you pass unlock. Nothing you have done is ever locked again.')}</p>
                            {[['some', 'I know the basics', 'Variables, if/else, loops'], ['experienced', 'I code regularly', 'Functions, data structures, algorithms']].map(([id, title, sub]) => (
                                <button key={id} onClick={() => setExperience(id)}
                                    className="w-full text-left rounded-2xl border-2 border-slate-700 bg-slate-900 px-4 py-4 active:scale-[0.99]">
                                    <p className="font-extrabold">{t(title)}</p>
                                    <p className="text-sm text-slate-400">{t(sub)}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {experience && !result && !ex && !error && (
                        <div className="h-64 flex items-center justify-center"><div className="w-6 h-6 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" /></div>
                    )}
                    {error && (
                        <div className="pt-10 text-center space-y-4">
                            <p className="text-slate-300">{t('Could not load lessons.')}</p>
                            <button onClick={() => onDone(null)} className="px-5 py-3 rounded-xl bg-teal-400 text-slate-950 font-bold">{t('Start from the beginning')}</button>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {ex && (
                            <motion.div key={answered} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}
                                className="pt-2 space-y-4">
                                <p className="text-[11px] font-black tracking-wider text-teal-300">{t('QUESTION')} {answered + 1} / {PLACEMENT_LENGTH}</p>
                                <h1 id="placement-title" ref={heading} tabIndex={-1} className="text-lg font-extrabold leading-snug outline-none">{t(ex.prompt)}</h1>
                                <pre className="font-mono text-[13px] leading-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto whitespace-pre-wrap break-words" aria-label={t('Question code')}>
                                    {ex.code.map((l, i) => <div key={i} className={l.highlight ? 'text-teal-200' : 'text-slate-200'}>{l.text || ' '}</div>)}
                                </pre>
                                <div className="grid grid-cols-1 gap-3">
                                    {ex.options.map((o, i) => (
                                        <button key={i} onClick={() => answer(i)} disabled={picked !== null}
                                            className={`min-h-12 rounded-xl px-4 py-3 border-2 text-left font-mono font-bold transition-colors ${picked === i ? 'border-teal-300 bg-teal-500/15' : 'border-slate-700 bg-slate-900'}`}>
                                            {o}
                                        </button>
                                    ))}
                                    <button onClick={() => answer(-1)} disabled={picked !== null} className="min-h-11 rounded-xl text-sm font-bold text-slate-400">{t("I don't know yet")}</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {result && <Result result={result} heading={heading} onDone={onDone} />}
                </div>
            </div>
        </motion.section>
    )
}

function Result({ result, heading, onDone }) {
    const band = getBand(result.theta)
    const start = result.startChapter
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-4 space-y-5">
            <LivingOtter size={88} mood={start > 1 ? 'celebrate' : 'happy'} showGlow={false} />
            <h1 id="placement-title" ref={heading} tabIndex={-1} className="text-2xl font-black outline-none">
                {start > 1 ? `${t('Start at Chapter')} ${start}` : t("Let's start from the basics")}
            </h1>
            <p className="text-slate-300">
                {result.correct}/{result.answered} {t('correct')} · <span style={{ color: band.color }} className="font-bold">{band.label}</span>
            </p>
            <div className="grid grid-cols-5 gap-1.5" aria-label={t('Chapters')}>
                {CHAPTER_NAMES.map((name, i) => {
                    const ch = i + 1, passed = ch < start, here = ch === start
                    return (
                        <div key={ch} title={t(name)} className={`rounded-lg py-2 text-center text-[11px] font-black ${here ? 'bg-teal-400 text-slate-950' : passed ? 'bg-teal-900/60 text-teal-200' : 'bg-slate-800 text-slate-400'}`}>
                            CH {ch}{passed ? ' ✓' : ''}
                        </div>
                    )
                })}
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
                {start > 1
                    ? t('Earlier chapters stay open for review. Lessons already start at your level and keep adjusting as you answer.')
                    : t('The first lessons are short. They speed up as soon as you start getting them right.')}
            </p>
            <button onClick={() => onDone(result)} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-black">
                {start > 1 ? `${t('Start at Chapter')} ${start}` : t('Start learning')}
            </button>
            {start > 1 && (
                <button onClick={() => onDone(null)} className="w-full min-h-11 rounded-xl text-sm font-bold text-slate-400">{t('Start from the beginning')}</button>
            )}
        </motion.div>
    )
}
