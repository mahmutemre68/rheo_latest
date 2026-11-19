// Adaptive placement: simulated learners with a known ability take the test;
// the estimate must land near the truth, extremes must behave, and applying a
// result must only ever move a learner forward.
import assert from 'node:assert/strict'

const store = new Map()
globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) }
globalThis.window = { addEventListener() {}, dispatchEvent() {}, localStorage: globalThis.localStorage }

const core = await import('../src/data/core.js')
const adaptive = await import('../src/data/adaptive.js')
const P = await import('../src/data/placement.js')

let seed = 12345
const rand = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32)

function runTest(lang, experience, answer) {
    let s = P.createPlacementSession(experience, P.buildPlacementPool(lang))
    while (!P.isPlacementDone(s)) {
        const entry = P.nextPlacementItem(s)
        s = P.answerPlacement(s, entry, answer(entry))
    }
    return { session: s, result: P.placementResult(s) }
}

for (const lang of ['python', 'javascript', 'java']) {
    await core.loadLanguageBank(lang)
    const pool = P.buildPlacementPool(lang)
    assert.ok(pool.length >= 50, `${lang}: placement pool has ${pool.length} items`)
    assert.ok(new Set(pool.map(p => p.chapter)).size === 10, `${lang}: every chapter represented`)

    // Extremes
    const allWrong = runTest(lang, 'some', () => false)
    assert.equal(allWrong.result.startChapter, 1, 'all wrong starts at chapter 1')
    assert.equal(allWrong.result.answered, 3, 'all wrong stops after three questions')
    for (const exp of ['some', 'experienced']) {
        const r = runTest(lang, exp, () => false).result
        assert.equal(r.startChapter, 1, `${exp}: all wrong starts at chapter 1 (got ${r.startChapter})`)
        assert.equal(r.answered, 3)
    }
    // Mostly wrong after claiming experience must still land at the start.
    let k = 0
    const oneRight = runTest(lang, 'experienced', () => (k++ === 1))
    assert.equal(oneRight.result.startChapter, 1, `1 right out of ${oneRight.result.answered} starts at chapter 1 (got ${oneRight.result.startChapter}, theta ${oneRight.result.theta})`)
    const allRight = runTest(lang, 'experienced', () => true)
    assert.ok(allRight.result.startChapter >= 7, `all right places far ahead (got ${allRight.result.startChapter})`)
    assert.equal(allRight.result.answered, P.PLACEMENT_LENGTH)
    const chapters = allRight.session.asked.map(a => a.chapter)
    assert.equal(new Set(chapters).size, chapters.length, 'one question per chapter')
    assert.ok(Math.max(...chapters) - Math.min(...chapters) >= 4, 'a strong learner is walked up the journey')

    // Simulated learners: answers follow the same Elo model the app uses.
    const rows = []
    for (const truth of [800, 1000, 1200, 1400, 1600]) {
        const want = P.startChapterFor(truth)
        let err = 0, n = 0
        for (let rep = 0; rep < 200; rep++) {
            const { result } = runTest(lang, truth >= 1300 ? 'experienced' : 'some', e => rand() < adaptive.expectedScore(truth, e.difficulty))
            err += Math.abs(result.startChapter - want); n++
        }
        rows.push(`${truth}→ch${want} ±${(err / n).toFixed(2)}`)
        assert.ok(err / n <= 1.6, `${lang} ability ${truth}: mean chapter error ${(err / n).toFixed(2)} too large`)
    }
    console.log(`${lang.padEnd(10)} pool ${pool.length} · ${rows.join('  ')}`)
}

// Mapping is monotonic and bounded
let last = 0
for (let r = 500; r <= 2200; r += 25) { const c = P.startChapterFor(r); assert.ok(c >= last && c >= 1 && c <= 10); last = c }

// Applying: forward only, nothing completed, ratings seeded
const before = core.journeyNodes.map(n => n.status)
P.applyPlacement({ theta: 1250, startChapter: 4, experience: 'some', answered: 8, correct: 5 }, 'python')
for (const n of core.journeyNodes) {
    if (n.chapter < 4) assert.notEqual(n.status, 'locked', `node ${n.id} unlocked`)
    assert.notEqual(n.status === 'completed' && before[n.id - 1] !== 'completed', true, 'placement never completes nodes')
}
assert.equal(core.journeyNodes.find(n => n.chapter === 4).status, 'active', 'first node of the start chapter is active')
assert.equal(core.journeyNodes.filter(n => n.status === 'active').length, 1, 'exactly one active node')
assert.equal(adaptive.getOverallAbility(), 1250, 'overall ability seeded')

// A later, lower placement must not lock anything again
const snapshot = core.journeyNodes.map(n => n.status)
P.applyPlacement({ theta: 900, startChapter: 1, experience: 'some', answered: 3, correct: 0 }, 'python')
assert.deepEqual(core.journeyNodes.map(n => n.status), snapshot, 'lower result changes no node')

// Ratings backed by real answers are kept
const ex = core.getExercisesForNode(5, 'python')[0]
for (let i = 0; i < 12; i++) adaptive.recordAttempt(ex, true, 'python')
const earned = adaptive.getAbility('conditionals')
adaptive.seedAbility(700)
assert.equal(adaptive.getAbility('conditionals'), earned, 'an established skill rating is not overwritten')

console.log('placement: extremes, simulated accuracy, forward-only apply and rating seeding passed')
