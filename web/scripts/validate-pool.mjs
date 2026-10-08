import { normalizeExercise } from '../src/data/normalizeExercise.js'
/* Soru havuzu tutarlılık denetimi.
   Her alıştırma tipinin kendi şeması var; buradaki kontroller "uygulama
   çökmeden çalışır mı" değil, "soru cevaplanabilir mi" sorusuna bakıyor:
   doğru şık aralıkta mı, doldurma kutusundaki cevap bankada var mı, vs.

   Çalıştırmak için: node scripts/validate-pool.mjs   (rheo-web dizininden) */

const problems = []
const stats = { total: 0, withExplanation: 0, withHint: 0, byType: {} }

function checkExercise(lang, nodeId, i, rawExercise) {
    const ex = normalizeExercise(rawExercise)
    const at = `${lang} node ${nodeId} #${i + 1} (${ex.type})`
    stats.total++
    stats.byType[ex.type] = (stats.byType[ex.type] || 0) + 1
    if (ex.explanation) stats.withExplanation++
    if (ex.hint) stats.withHint++

    const needsExplanation = ex.type !== 'concept' && ex.type !== 'terminal'
    if (needsExplanation && !ex.explanation) problems.push(`${at}: açıklama yok`)

    switch (ex.type) {
        case 'trace':
        case 'output':
        case 'errordecode':
        case 'realworld':
        case 'refactor':
        case 'algostep':
        case 'complexity': {
            const opts = ex.options
            if (!Array.isArray(opts) || opts.length < 2) { problems.push(`${at}: en az 2 şık gerekli`); break }
            if (typeof ex.correct !== 'number' || ex.correct < 0 || ex.correct >= opts.length)
                problems.push(`${at}: correct=${ex.correct} şık aralığı dışında (0..${opts.length - 1})`)
            if (ex.type === 'complexity' && opts.some(o => !o || typeof o.code !== 'string' || !o.code.trim() || typeof o.label !== 'string' || !o.label.trim()))
                problems.push(`${at}: seçenek kodu veya etiketi eksik`)
            const labels = opts.map(o => (typeof o === 'string' ? o : o.label ?? o.code))
            if (new Set(labels).size !== labels.length) problems.push(`${at}: aynı şık iki kez var`)
            break
        }
        case 'bug': {
            if (!Array.isArray(ex.code)) { problems.push(`${at}: code satırları yok`); break }
            if (typeof ex.correctLine !== 'number' || ex.correctLine < 0 || ex.correctLine >= ex.code.length)
                problems.push(`${at}: correctLine=${ex.correctLine} kod aralığı dışında (0..${ex.code.length - 1})`)
            const flagged = ex.code.map((l, idx) => (l.hasError ? idx : -1)).filter(idx => idx >= 0)
            if (flagged.length !== 1) problems.push(`${at}: hasError işaretli satır sayısı ${flagged.length}, 1 olmalı`)
            else if (flagged[0] !== ex.correctLine) problems.push(`${at}: hasError satırı ${flagged[0]} ama correctLine ${ex.correctLine}`)
            break
        }
        case 'pair': {
            if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) { problems.push(`${at}: en az 2 eşleşme gerekli`); break }
            const lefts = ex.pairs.map(p => p.left), rights = ex.pairs.map(p => p.right)
            if (new Set(lefts).size !== lefts.length) problems.push(`${at}: sol tarafta tekrar var`)
            if (new Set(rights).size !== rights.length) problems.push(`${at}: sağ tarafta tekrar var`)
            break
        }
        case 'fillgap': {
            const gaps = (ex.codeParts || []).filter(p => p.type === 'gap')
            if (!gaps.length) { problems.push(`${at}: gap tanımlı değil`); break }
            for (const g of gaps) {
                const answer = ex.correctFill?.[g.id]
                if (answer == null) { problems.push(`${at}: ${g.id} için correctFill yok`); continue }
                if (!ex.bank?.includes(answer)) problems.push(`${at}: doğru cevap "${answer}" bankada yok`)
                if (g.text !== answer) problems.push(`${at}: gap metni doğru cevapla uyuşmuyor`)
            }
            if (ex.bank && new Set(ex.bank).size !== ex.bank.length) problems.push(`${at}: bankada tekrar var`)
            break
        }
        case 'scramble': {
            const ids = (ex.pieces || []).map(p => p.id)
            if (!ex.correctOrder?.length) { problems.push(`${at}: correctOrder yok`); break }
            for (const id of ex.correctOrder) if (!ids.includes(id)) problems.push(`${at}: correctOrder'daki "${id}" parça listesinde yok`)
            if (ex.correctOrder.length !== ids.length) problems.push(`${at}: ${ids.length} parça var, correctOrder ${ex.correctOrder.length}`)
            const distractorIds = (ex.distractors || []).map(d => d.id)
            for (const id of distractorIds) if (ids.includes(id)) problems.push(`${at}: çeldirici id "${id}" parçalarla çakışıyor`)
            break
        }
        case 'terminal': {
            if (!ex.expectedCommands?.length) problems.push(`${at}: expectedCommands yok`)
            break
        }
        case 'concept': {
            if (typeof ex.chapter !== 'number') problems.push(`${at}: chapter alanı yok`)
            break
        }
        default:
            problems.push(`${at}: bilinmeyen tip`)
    }
}

const banks = [
    ['python', await import('../src/exercises_python.js').then(m => m.pyExercises)],
    ['python', await import('../src/exercises_python2.js').then(m => m.pyExercisesCh6to10)],
    ['js', await import('../src/exercises_js.js').then(m => m.jsExercises)],
    ['js', await import('../src/exercises_js2.js').then(m => m.jsExercisesCh6to10)],
    ['java', await import('../src/exercises_java.js').then(m => m.javaExercises)],
    ['java', await import('../src/exercises_java2.js').then(m => m.javaExercisesCh6to10)],
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
