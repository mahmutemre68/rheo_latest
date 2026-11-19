// Approved AI items must be appended after authored items (indices stable),
// tagged, validated, and `retired` items must keep their slot but not be served.
// Uses a temporary fixture in src/generated/ai_java.json and restores it.
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../src/generated/ai_java.json', import.meta.url)
const original = readFileSync(file, 'utf8')
const item = (prompt, extra = {}) => ({
    type: 'trace', prompt, code: [{ text: 'int a = 2;' }, { text: 'System.out.println(a * 3);' }],
    options: ['6', '5', '23', '8'], correct: 0, explanation: 'x'.repeat(40), hint: 'Multiply first.', source: 'ai', ...extra,
})
const existing = JSON.parse(original)
const nodeId = 5
const before = (existing[nodeId] || []).length
try {
    writeFileSync(file, JSON.stringify({ ...existing, [nodeId]: [...(existing[nodeId] || []), item('fixture live A'), item('fixture retired', { retired: true }), item('fixture live B')] }))
    const store = new Map()
    globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) }
    globalThis.window = { addEventListener() {}, dispatchEvent() {}, localStorage: globalThis.localStorage }
    const { loadLanguageBank, getExercisesForNode } = await import('../src/data/core.js')
    const { javaExercises } = await import('../src/exercises_java.js')
    await loadLanguageBank('java')
    const authored = javaExercises[nodeId].length
    const served = getExercisesForNode(nodeId, 'java')
    const ai = served.filter(e => e.source === 'ai')
    assert.equal(served.length, authored + before + 2, 'authored + live AI items served, retired one skipped')
    assert.ok(served.slice(0, authored).every(e => e.source !== 'ai'), 'authored items come first')
    const a = ai.find(e => e.prompt === 'fixture live A'), b = ai.find(e => e.prompt === 'fixture live B')
    assert.equal(a._exerciseIndex, authored + before)
    assert.equal(b._exerciseIndex, authored + before + 2, 'retired item keeps its slot')
    assert.ok(!served.some(e => e.prompt === 'fixture retired'))
    console.log(`generated merge: ${authored} authored + AI appended with stable indices; retired item skipped`)
} finally {
    writeFileSync(file, original)
}
