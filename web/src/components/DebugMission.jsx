import { useEffect, useRef, useState } from 'react'
import { getLocale } from '../data'
import { debugMission, verifyDebugFix } from '../data/debugMission'
import LivingOtter from './LivingOtter'

export default function DebugMission({ language, onClose }) {
    const tr = getLocale() === 'tr'
    const text = (en, turkish) => tr ? turkish : en
    const [stage, setStage] = useState(0)
    const [feedback, setFeedback] = useState('')
    const [operator, setOperator] = useState(null)
    const heading = useRef(null), dialog = useRef(null), transition = useRef(false)
    useEffect(() => { const previous = document.activeElement; return () => previous?.focus() }, [])
    useEffect(() => { transition.current = false; heading.current?.focus() }, [stage])
    const next = () => { if (transition.current) return; transition.current = true; setFeedback(''); setStage(s => s + 1) }
    const supported = Boolean(debugMission.code[language])
    const result = operator ? verifyDebugFix(operator) : null
    const code = debugMission.code[language] || []
    // One consistent guide: contextual support rather than an unrelated cheer.
    const guide = !supported
        ? text('Your selected language stays unchanged. Exit when you are ready.', 'Seçili dilin değişmez. Hazır olduğunda pratikten çıkabilirsin.')
        : feedback || (stage === 0
            ? text('Start with score = 4. Follow the condition one line at a time.', 'score = 4 ile başla. Koşulu satır satır izle.')
            : stage === 1
                ? text('You found the condition. Explain what happens when score equals 4.', 'Koşulu buldun. score 4 olduğunda ne olduğunu açıkla.')
                : stage === 2
                    ? text('A fix should work below, at and above the boundary. Check 3, 4 and 5.', 'Düzeltme sınırın altında, sınırda ve üstünde çalışmalı. 3, 4 ve 5 değerlerini kontrol et.')
                    : result?.passed
                        ? text('All three cases match. >= includes 4 and still accepts 5.', 'Üç durum eşleşti. >= hem 4 hem de 5 değerini kapsıyor.')
                        : text('A case still fails. Compare the expected and actual outputs, then try another fix.', 'Bir durum hâlâ yanlış. Beklenen ve gerçek çıktıları karşılaştır; ardından başka düzeltme dene.'))
    return <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="debug-title"
        onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
            if (event.key !== 'Tab') return
            const buttons = [...dialog.current.querySelectorAll('button:not(:disabled)')]
            const first = buttons[0], last = buttons.at(-1)
            if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) {
                event.preventDefault(); last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }} className="fixed inset-0 z-[300] flex flex-col bg-slate-950 text-white">
        <header className="flex justify-between items-center px-5 py-4 border-b border-slate-800" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
            <span className="text-sm text-teal-300">Debug Mission · {language}</span>
            <button onClick={onClose} className="min-h-12 px-3 rounded-lg">{text('Exit practice', 'Pratikten çık')}</button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
            <div className="max-w-md mx-auto space-y-4">

                <h1 ref={heading} tabIndex={-1} id="debug-title" className="text-xl font-bold outline-none">{text('Find it. Explain it. Verify it.', 'Bul. Açıkla. Doğrula.')}</h1>
                <p className="text-sm text-slate-400">{text('Optional prototype · no timer, hearts or rewards.', 'İsteğe bağlı prototip · süre, kalp ve ödül yok.')}</p>
                <div className="flex items-start gap-3 rounded-2xl border border-teal-900 bg-teal-950/30 p-3">
                    <span aria-hidden="true"><LivingOtter size={48} mood="thinking" showGlow={false} /></span>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-teal-300">Rheo</p>
                        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm leading-relaxed text-slate-200">{guide}</p>
                    </div>
                </div>
                {!supported ? <p>{text('This prototype supports Python and JavaScript. Your selected language stays unchanged.', 'Bu prototip Python ve JavaScript destekler. Seçili dilin değişmez.')}</p> : <>
                    <p className="text-teal-200">{text('Requirement: print A when score is at least 4; otherwise print B.', 'Kural: score en az 4 ise A, değilse B yazdır.')}</p>
                    <pre className="font-mono text-sm bg-slate-900 p-4 rounded-xl overflow-x-auto" aria-label={text('Mission code', 'Görev kodu')}>{code.map((line, i) => `${i + 1}  ${stage >= 2 && i === debugMission.bugLine && operator ? line.replace(' > ', ` ${operator} `) : line}`).join('\n')}</pre>
                    {stage === 0 && <>
                        <h2 className="font-bold">{text('Which line violates the requirement?', 'Hangi satır kuralı karşılamıyor?')}</h2>
                        <div className="grid grid-cols-3 gap-2">{code.map((_, i) => <button key={i} className="min-h-12 rounded-xl bg-slate-800" onClick={() => i === debugMission.bugLine ? next() : setFeedback(text('Trace score = 4 through the condition.', 'score = 4 için koşulu adım adım izle.'))}>{text('Line', 'Satır')} {i + 1}</button>)}</div>
                    </>}
                    {stage === 1 && <>
                        <h2 className="font-bold">{text('Why does it fail?', 'Neden kuralı karşılamıyor?')}</h2>
                        {[text('The condition excludes score = 4.', 'Koşul score = 4 değerini dışlıyor.'), text('The variable has no value.', 'Değişkenin değeri yok.'), text('The else branch never runs.', 'else dalı hiç çalışmaz.')].map((label, i) => <button key={i} className="w-full min-h-12 text-left rounded-xl bg-slate-800 p-3" onClick={() => i === 0 ? next() : setFeedback(text('4 > 4 is false, so the code prints B.', '4 > 4 yanlış; bu yüzden kod B yazdırıyor.'))}>{label}</button>)}
                    </>}
                    {stage === 2 && <>
                        <h2 className="font-bold">{text('Choose a fix, then check all three cases.', 'Düzeltmeyi seç, ardından üç durumu kontrol et.')}</h2>
                        <div className="flex gap-3">{['>', '>=', '=='].map(op => <button key={op} aria-pressed={operator === op} onClick={() => { setOperator(op); setFeedback('') }} className={`min-h-12 flex-1 font-mono rounded-xl border ${operator === op ? 'border-teal-300' : 'border-slate-700'}`}>{op}</button>)}</div>
                        <button disabled={!operator} onClick={next} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950 disabled:opacity-40">{text('Verify cases', 'Durumları doğrula')}</button>
                    </>}
                    {stage === 3 && <>
                        <table className="w-full text-sm"><caption className="text-left mb-2">{text('Checked against the requirement', 'Kurala göre kontrol')}</caption><thead><tr><th>score</th><th>{text('Expected', 'Beklenen')}</th><th>{text('Result', 'Sonuç')}</th></tr></thead><tbody>{debugMission.inputs.map((n, i) => <tr key={n}><td className="py-2 text-center">{n}</td><td className="text-center">{debugMission.expected[i]}</td><td className="text-center">{result.actual[i]}</td></tr>)}</tbody></table>

                        {result.passed ? <button onClick={onClose} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950">{text('Back to journey', 'Yolculuğa dön')}</button> : <button onClick={() => { setStage(2); setOperator(null) }} className="w-full min-h-12 rounded-xl bg-teal-400 text-slate-950">{text('Try another fix', 'Başka düzeltme dene')}</button>}
                    </>}

                </>}
            </div>
        </div>
    </section>
}
