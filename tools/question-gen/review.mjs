#!/usr/bin/env node
// Human review of generated candidates. Only approved items reach the app
// (web/src/generated/ai_<lang>.json); the app appends them after the authored
// exercises of the same node, tagged source: 'ai'.
//
//   node review.mjs                                   list batches and pending counts
//   node review.mjs show <batch.json> [index]         print candidates as a learner would see them
//   node review.mjs approve <batch.json> 0 2 --by Maho [--checked-key]
//   node review.mjs reject  <batch.json> 1 --by Maho --reason "too easy"
//
// `pass` items can be approved directly. `manual` items (no machine proof of
// the answer, e.g. a bug without a fix) need --checked-key: you confirm you
// verified the answer yourself. `fail` items cannot be approved.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { authoredBank, generatedBank, writeGeneratedBank } from './lib/bank.mjs'
import { runGates } from './lib/gates.mjs'
import { stripInternal } from './lib/prompt.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const CANDIDATES = path.join(HERE, 'candidates')
const argv = process.argv.slice(2)
const flag = name => { const i = argv.indexOf(`--${name}`); return i < 0 ? undefined : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) }
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && ['by', 'reason'].includes(argv[i - 1].slice(2))))
const [cmd, file, ...rest] = positional

const resolveBatch = f => (path.isAbsolute(f) || f.includes('/') ? f : path.join(CANDIDATES, f))
const load = f => JSON.parse(readFileSync(resolveBatch(f), 'utf8'))
const save = (f, batch) => writeFileSync(resolveBatch(f), JSON.stringify(batch, null, 2) + '\n')

function render(c, i) {
    const ex = c.exercise
    const lines = [`── #${i} [${c.status}${c.review ? ` · ${c.review.decision} by ${c.review.by}` : ''}] ${ex.type}: ${ex.prompt}`]
    for (const [n, l] of (ex.code || []).entries()) lines.push(`   ${String(n).padStart(2)} ${l.hasError ? '✗' : l.highlight ? '›' : ' '} ${l.text}`)
    if (ex.terminalOutput != null) lines.push(`   output: ${JSON.stringify(ex.terminalOutput)}`)
    for (const [n, o] of (ex.options || []).entries()) lines.push(`   ${n === ex.correct ? '✓' : ' '} ${String.fromCharCode(65 + n)}. ${typeof o === 'string' ? o : o.label}`)
    if (ex.type === 'bug') lines.push(`   bug line: ${ex.correctLine}${ex.verify?.fix ? `  fix: ${ex.verify.fix}` : ''}`)
    lines.push(`   explanation: ${ex.explanation}`, `   hint: ${ex.hint}`)
    const bad = Object.values(c.gates).flat().filter(g => g && !g.ok)
    lines.push(bad.length ? `   gates ✗ ${bad.map(b => `${b.name}: ${b.detail}`).join(' | ')}` : `   gates ✓ ${c.status === 'manual' ? '(answer key needs a human check)' : ''}`)
    return lines.join('\n')
}

if (!cmd) {
    const files = readdirSync(CANDIDATES).filter(f => f.endsWith('.json')).sort()
    if (!files.length) console.log('no candidate batches yet — run generate.mjs')
    for (const f of files) {
        const b = load(f)
        const pending = b.candidates.filter(c => !c.review && c.status !== 'fail').length
        const counts = ['pass', 'manual', 'fail'].map(s => `${s} ${b.candidates.filter(c => c.status === s).length}`).join(' · ')
        console.log(`${f}  ${b.lang} node ${b.nodeId} "${b.nodeTitle}"  ${counts}  → ${pending} awaiting review`)
    }
} else if (cmd === 'show') {
    const b = load(file)
    const which = rest.length ? rest.map(Number) : b.candidates.map((_, i) => i)
    console.log(`${b.lang} · node ${b.nodeId} "${b.nodeTitle}" (chapter ${b.chapter}) · ${b.model}\n`)
    for (const i of which) console.log(render(b.candidates[i], i) + '\n')
} else if (cmd === 'approve' || cmd === 'reject') {
    const by = flag('by')
    if (!by || by === true) { console.error('--by <name> is required'); process.exit(2) }
    const b = load(file)
    const idx = rest.map(Number)
    if (!idx.length || idx.some(i => !(i >= 0 && i < b.candidates.length))) { console.error('give candidate indices'); process.exit(2) }
    const bank = generatedBank(b.lang)
    const pool = [...((await authoredBank(b.lang))[b.nodeId] || []), ...(bank[b.nodeId] || [])]
    for (const i of idx) {
        const c = b.candidates[i]
        if (c.review) { console.log(`#${i}: already ${c.review.decision}`); continue }
        if (cmd === 'reject') {
            c.review = { decision: 'rejected', by, at: new Date().toISOString(), reason: flag('reason') || '' }
            console.log(`#${i}: rejected`)
            continue
        }
        // Re-gate against the CURRENT pool: something similar may have been approved since.
        const fresh = runGates(c.exercise, b.lang, pool)
        if (fresh.status === 'fail') { console.log(`#${i}: fails gates now — not approved\n${render({ ...c, ...fresh }, i)}`); continue }
        if (fresh.status === 'manual' && !flag('checked-key')) { console.log(`#${i}: needs --checked-key (no machine proof of the answer)`); continue }
        const item = {
            ...stripInternal(c.exercise),
            source: 'ai', model: b.model, generatedAt: b.createdAt,
            reviewedBy: by, reviewedAt: new Date().toISOString(),
            ...(fresh.status === 'manual' ? { keyCheckedBy: by } : {}),
        }
        bank[b.nodeId] = [...(bank[b.nodeId] || []), item]
        pool.push(item)
        c.review = { decision: 'approved', by, at: item.reviewedAt }
        console.log(`#${i}: approved → web/src/generated/ai_${b.lang}.json node ${b.nodeId}`)
    }
    writeGeneratedBank(b.lang, bank)
    save(file, b)
} else {
    console.error(`unknown command ${cmd}`); process.exit(2)
}
