#!/usr/bin/env node
// Generate candidate exercises for one journey node and run them through the
// gates. Nothing here touches the app: results land in candidates/ for review.
//
//   ANTHROPIC_API_KEY=... node generate.mjs --lang python --node 9 --type trace --count 5
//   node generate.mjs --lang python --node 9 --from-file my_batch.json   # gate hand-written/other-model items
//
// Options: --model (default $RHEO_GEN_MODEL or claude-sonnet-5-5), --out <file>
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { journeyNodes, authoredBank, generatedBank, LANGS } from './lib/bank.mjs'
import { runGates, SUPPORTED_TYPES } from './lib/gates.mjs'
import { SYSTEM, TOOL, userPrompt, pickExamples } from './lib/prompt.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true])
    return acc
}, []))

function fail(msg) { console.error(msg); process.exit(2) }

const lang = args.lang
const nodeId = Number(args.node)
if (!LANGS.includes(lang)) fail(`--lang must be one of ${LANGS.join(', ')}`)
const nodes = await journeyNodes()
const node = nodes.find(n => n.id === nodeId)
if (!node) fail(`--node ${args.node} is not a journey node (1..${nodes.length})`)
if (!['lesson', 'boss', 'daily', 'chest'].includes(node.type)) fail(`node ${nodeId} is a ${node.type} node; generate for lesson/boss/daily/chest nodes`)

const authored = await authoredBank(lang)
const approved = generatedBank(lang)
const pool = [...(authored[nodeId] || []), ...(approved[nodeId] || [])]

let questions, model
if (args['from-file']) {
    const raw = JSON.parse(readFileSync(args['from-file'], 'utf8'))
    questions = Array.isArray(raw) ? raw : raw.questions
    model = raw.model || args.model || 'unknown'
} else {
    const type = args.type || 'trace'
    if (!SUPPORTED_TYPES.includes(type)) fail(`--type must be one of ${SUPPORTED_TYPES.join(', ')}`)
    const count = Math.min(Number(args.count || 5), 10)
    if (!process.env.ANTHROPIC_API_KEY) fail('ANTHROPIC_API_KEY is not set (or use --from-file)')
    model = args.model || process.env.RHEO_GEN_MODEL || 'claude-sonnet-5-5'
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic()
    const examples = pickExamples(type, nodeId, authored, nodes)
    const res = await client.messages.create({
        model,
        max_tokens: 8000,
        system: SYSTEM,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: TOOL.name },
        messages: [{ role: 'user', content: userPrompt({ lang, node, type, count, examples }) }],
    })
    const call = res.content.find(b => b.type === 'tool_use')
    if (!call) fail('model did not call submit_questions')
    questions = call.input.questions || []
    console.error(`model ${model}: ${questions.length} question(s), ${res.usage?.input_tokens ?? '?'} in / ${res.usage?.output_tokens ?? '?'} out tokens`)
}

const seen = [...pool]
const candidates = questions.map(q => {
    const result = runGates(q, lang, seen)
    if (result.status !== 'fail') seen.push(q) // later items in the batch must not copy earlier ones
    return { status: result.status, gates: result.gates, review: null, exercise: q }
})

const batch = { lang, nodeId, nodeTitle: node.title, chapter: node.chapter, model, createdAt: new Date().toISOString(), candidates }
mkdirSync(path.join(HERE, 'candidates'), { recursive: true })
const out = args.out || path.join(HERE, 'candidates', `${lang}-n${nodeId}-${batch.createdAt.replace(/[:.]/g, '-')}.json`)
writeFileSync(out, JSON.stringify(batch, null, 2) + '\n')

const tally = candidates.reduce((t, c) => ((t[c.status] = (t[c.status] || 0) + 1), t), {})
console.log(`${path.relative(process.cwd(), out)}  pass ${tally.pass || 0} · manual ${tally.manual || 0} · fail ${tally.fail || 0}`)
for (const [i, c] of candidates.entries()) {
    const bad = Object.values(c.gates).flat().filter(g => g && !g.ok)
    console.log(` ${String(i).padStart(2)} ${c.status.padEnd(6)} ${c.exercise.type.padEnd(6)} ${c.exercise.prompt}${bad.length ? `\n      ✗ ${bad.map(b => `${b.name}: ${b.detail}`).join('\n      ✗ ')}` : ''}`)
}
