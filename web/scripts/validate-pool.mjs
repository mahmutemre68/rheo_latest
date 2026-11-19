import { normalizeExercise } from '../src/data/normalizeExercise.js'
import { exerciseProblems } from './lib/exerciseRules.mjs'
import { readFileSync } from 'node:fs'
/* Soru havuzu tutarlılık denetimi.
   Her alıştırma tipinin kendi şeması var; buradaki kontroller "uygulama
   çökmeden çalışır mı" değil, "soru cevaplanabilir mi" sorusuna bakıyor:
   doğru şık aralıkta mı, doldurma kutusundaki cevap bankada var mı, vs.

   Çalıştırmak için: node scripts/validate-pool.mjs   (rheo-web dizininden) */

const problems = []
const stats = { total: 0, withExplanation: 0, withHint: 0, byType: {} }

function checkExercise(lang, nodeId, i, rawExercise) {
    const ex = normalizeExercise(rawExercise)
    stats.total++
    stats.byType[ex.type] = (stats.byType[ex.type] || 0) + 1
    if (ex.explanation) stats.withExplanation++
    if (ex.hint) stats.withHint++
    problems.push(...exerciseProblems(rawExercise, `${lang} node ${nodeId} #${i + 1} (${ex.type}): `))
}

const banks = [
    ['python', await import('../src/exercises_python.js').then(m => m.pyExercises)],
    ['python', await import('../src/exercises_python2.js').then(m => m.pyExercisesCh6to10)],
    ['js', await import('../src/exercises_js.js').then(m => m.jsExercises)],
    ['js', await import('../src/exercises_js2.js').then(m => m.jsExercisesCh6to10)],
    ['java', await import('../src/exercises_java.js').then(m => m.javaExercises)],
    ['java', await import('../src/exercises_java2.js').then(m => m.javaExercisesCh6to10)],
    // Approved AI items (tools/question-gen) are held to the same rules.
    ['python ai', JSON.parse(readFileSync(new URL('../src/generated/ai_python.json', import.meta.url)))],
    ['js ai', JSON.parse(readFileSync(new URL('../src/generated/ai_javascript.json', import.meta.url)))],
    ['java ai', JSON.parse(readFileSync(new URL('../src/generated/ai_java.json', import.meta.url)))],
]

const perLang = {}
for (const [lang, bank] of banks) {
    for (const [nodeId, list] of Object.entries(bank)) {
        perLang[lang] = perLang[lang] || { nodes: {}, total: 0 }
        perLang[lang].nodes[nodeId] = list.length
        perLang[lang].total += list.length
        list.forEach((ex, i) => checkExercise(lang, nodeId, i, ex))
    }
}

console.log('── Havuz ──')
for (const [lang, d] of Object.entries(perLang)) {
    const thin = Object.entries(d.nodes).filter(([, n]) => n < 6).map(([id, n]) => `${id}:${n}`)
    console.log(`${lang.padEnd(7)} ${String(d.total).padStart(4)} soru | 6'nın altındaki node'lar: ${thin.length ? thin.join(' ') : '—'}`)
}
console.log('\n── Tipler ──')
console.log(Object.entries(stats.byType).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}:${n}`).join('  '))
console.log(`\naçıklamalı ${stats.withExplanation}/${stats.total} · ipuçlu ${stats.withHint}/${stats.total}`)
console.log(`\n── Sorunlar (${problems.length}) ──`)
problems.forEach(p => console.log(' ✗', p))
if (problems.length > 40) console.log(`   … ve ${problems.length - 40} tane daha`)
if (!problems.length) console.log(' temiz')
process.exitCode = problems.length ? 1 : 0

if (process.argv.includes('--self-test')) {
    const baseline = problems.length
    const fixtures = [
        { type: 'complexity', explanation: 'x', optionA: { label: 'A', code: 'a' }, correct: 'A' },
        { type: 'complexity', explanation: 'x', optionA: { label: 'A', code: 'a' }, optionB: { label: 'B', code: 'b' }, correct: 'Z' },
        { type: 'complexity', explanation: 'x', optionA: { label: 'A' }, optionB: { label: 'B', code: 'b' }, correct: 'A' },
        { type: 'fillgap', explanation: 'x', codeParts: [{type:'gap', id:'g1', text:'a'}, {type:'gap', id:'g2', text:'b'}], bank:['a'], correctFill:{g1:'a'} },
    ]
    for (const [i, fixture] of fixtures.entries()) {
        const before = problems.length
        checkExercise('fixture', -1, i, fixture)
        if (problems.length === before) throw new Error(`Invalid fixture ${i} escaped validation`)
    }
    console.log('Negative fixtures rejected: missing branch, unknown answer key, missing code, unanswerable second gap.')
    process.exitCode = baseline ? 1 : 0
}
