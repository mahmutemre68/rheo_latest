import { useState, useEffect, useRef } from 'react'
import { t } from '../data'
import LivingOtter from './LivingOtter'
import { getPlacementQuestions, summarizePlacement, placementSuggestion } from '../data/placement.js'

export default function PlacementCheck({ language, onClose }) {
    const [questions] = useState(() => getPlacementQuestions(language))
    const [step, setStep] = useState(-1)
    const [answers, setAnswers] = useState([])
    const [selection, setSelection] = useState(undefined)
    const submitted = useRef(undefined)
    const heading = useRef(null)
    const dialog = useRef(null)
    useEffect(() => {
        const previous = document.activeElement
        return () => { previous?.focus() }
    }, [])
    useEffect(() => { heading.current?.focus() }, [step])
    const done = step === questions.length
    const question = questions[step]
    const submit = choice => {
        if (submitted.current !== undefined) return
        submitted.current = choice
        setSelection(choice)
        setAnswers(prev => [...prev, choice])
    }
    const next = () => {
        if (submitted.current === undefined) return
        submitted.current = undefined
        setSelection(undefined)
        setStep(s => s + 1)
    }
    const result = done ? summarizePlacement(questions, answers) : null
    return <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="placement-title"
        onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
            if (event.key !== 'Tab') return
            const buttons = [...dialog.current.querySelectorAll('button:not(:disabled)')]
            const first = buttons[0], last = buttons.at(-1)
            if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
                event.preventDefault(); last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first?.focus()
            }
        }}
        className="fixed inset-0 z-[300] flex flex-col bg-slate-950 text-white">
        <header className="flex justify-between items-center px-5 py-4 border-b border-slate-800" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
            <span className="text-sm font-bold text-teal-300">{t('Quick code check')} · {language}</span>
            <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-slate-300">{t('Skip for now')}</button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="max-w-md mx-auto space-y-5">
                <LivingOtter size={72} mood="thinking" showGlow={false} />
                <h1 id="placement-title" ref={heading} tabIndex={-1} className="text-2xl font-bold outline-none">
                    {t(step < 0 ? 'Find your next practice' : done ? 'Suggested practice' : 'What does this print?')}
                </h1>
                {step < 0 ? <>
                    <p className="text-slate-300 leading-relaxed">{t('Three short questions. No timer, no hearts, no rewards.')}</p>
                    <p className="text-sm text-slate-400">{t('This is a small sample, not a level certificate. Your journey stays unchanged.')}</p>
                    <button onClick={() => setStep(0)} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold">{t('Try 3 questions')}</button>
                </> : done ? <>
                    <p className="text-sm text-slate-400">{t('Answered')}: {result.answeredCount}/{result.total} · {t('Correct')}: {result.correctCount}/{result.total}</p>
                    <p className="text-lg leading-relaxed text-teal-200">{t(placementSuggestion[result.topic])}</p>
                    <p className="text-sm text-slate-400">{t('This is a small sample, not a level certificate. Your journey stays unchanged.')}</p>
                    <button onClick={onClose} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold">{t('Back to journey')}</button>
                </> : <>
                    <p className="text-xs text-slate-400">{step + 1}/{questions.length} · {t('No timer')}</p>
                    {language === 'java' && <p className="text-xs text-slate-400">{t('Java snippet runs inside main().')}</p>}
                    <pre className="font-mono text-sm leading-6 bg-slate-900 rounded-2xl p-4 overflow-x-auto" aria-label={t('Question code')}>{question.code}</pre>
                    <div className="flex flex-col gap-3">
                        {question.options.map((option, index) => <button key={index} disabled={selection !== undefined} onClick={() => submit(index)}
                            className={`min-h-12 rounded-xl px-4 py-3 border text-left font-mono ${selection === index ? 'border-teal-300 bg-teal-500/15' : 'border-slate-700 bg-slate-900'}`}>{option}</button>)}
                        {selection === undefined && <button onClick={() => submit(null)} className="min-h-12 rounded-xl text-sm text-slate-400">{t('Not sure yet')}</button>}
                    </div>
                    {selection !== undefined && <div role="status" className="rounded-xl bg-slate-900 p-4 space-y-3">
                        <p className="font-bold text-teal-200">{selection === question.correct ? t('Correct!') : t('Let’s trace it together.')}</p>
                        <p className="text-sm leading-relaxed text-slate-300">{t(question.explanation)}</p>
                        <button onClick={next} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 font-bold">{t(step === questions.length - 1 ? 'See suggestion' : 'CONTINUE')}</button>
                    </div>}
                </>}
            </div>
        </div>
    </section>
}
