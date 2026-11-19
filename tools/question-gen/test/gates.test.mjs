// Gate regression tests: every gate must accept a good item and reject the
// specific defect it exists for. Runs real python3 / node / java.
import assert from 'node:assert/strict'
import { runGates } from '../lib/gates.mjs'
import { runProgram, wrapJava } from '../lib/runner.mjs'

const L = text => ({ text })
const base = {
    explanation: 'Three of range(5)\'s values are even: 0, 2 and 4. Forgetting that 0 is even gives 2.',
    hint: 'List i on each pass, then mark the even ones.',
}
const statusOf = (ex, lang = 'python', pool = []) => runGates(ex, lang, pool)
const failed = r => Object.values(r.gates).flat().filter(g => g && !g.ok).map(g => g.name)

const goodPy = { ...base, type: 'trace', prompt: 'How many even values does the loop count?', code: [L('count = 0'), L('for i in range(5):'), L('    if i % 2 == 0:'), L('        count += 1'), { text: 'print(count)', highlight: true }], options: ['2', '3', '5', '4'], correct: 1 }
let r = statusOf(goodPy)
assert.equal(r.status, 'pass', `good python trace passes: ${failed(r)}`)

r = statusOf({ ...goodPy, correct: 0 })
assert.equal(r.status, 'fail'); assert.ok(failed(r).includes('stdout-equals-correct-option'), 'wrong key caught')

r = statusOf({ ...goodPy, options: ['3', '3', '5', '4'], correct: 0 })
assert.equal(r.status, 'fail', 'duplicate option rejected by app rules')

r = statusOf({ ...goodPy, code: [...goodPy.code.slice(0, 4), L('print(cnt)')] })
assert.equal(r.status, 'fail'); assert.ok(failed(r).includes('runs'), 'crashing program caught')

r = statusOf({ ...goodPy, hint: 'The answer is 3.' })
assert.ok(failed(r).includes('hint'), 'hint that leaks the answer rejected')

r = statusOf({ ...goodPy, explanation: 'Because.' })
assert.ok(failed(r).includes('explanation'), 'thin explanation rejected')

r = statusOf({ ...goodPy, prompt: 'Count the evens' }, 'python', [goodPy])
assert.ok(failed(r).includes('not-duplicate'), 'same code as an existing item rejected')

// verify.program: answer checked with a different program than the one shown
const conceptual = { ...base, type: 'trace', prompt: 'How many lines does this print?', code: [L('for i in range(3):'), L('    for j in range(4):'), L('        print(i, j)')], options: ['7', '12', '3', '4'], correct: 1,
    verify: { program: 'n = 0\nfor i in range(3):\n    for j in range(4):\n        n += 1\nprint(n)' } }
r = statusOf(conceptual)
assert.equal(r.status, 'pass', `verify.program path: ${failed(r)}`)

// output type: terminalOutput must agree with reality
const outJs = { ...base, type: 'output', prompt: 'What does this log?', code: [L('const a = [3, 1, 2];'), L('const b = a;'), L('b.push(4);'), L('console.log(a.length);')], terminalOutput: '4', options: ['3', '4', '1', 'undefined'], correct: 1 }
r = statusOf(outJs, 'javascript')
assert.equal(r.status, 'pass', `good js output passes: ${failed(r)}`)
r = statusOf({ ...outJs, terminalOutput: '3' }, 'javascript')
assert.ok(failed(r).includes('terminal-output-matches'), 'lying terminalOutput caught')

// Java: snippet runs inside main(), static methods allowed
const javaSrc = 'public static int twice(int x) {\n    return x * 2;\n}\nint y = twice(7) / 4;\nSystem.out.println(y);'
assert.match(wrapJava(javaSrc), /public class Main/)
const jr = runProgram('java', javaSrc)
assert.equal(jr.stdout.trim(), '3', `java wrapper runs methods + body: ${jr.stderr}`)
const javaTrace = { ...base, type: 'trace', prompt: 'What is printed after integer division?', code: javaSrc.split('\n').map(L), options: ['3.5', '3', '4', '14'], correct: 1 }
r = statusOf(javaTrace, 'java')
assert.equal(r.status, 'pass', `java trace passes: ${failed(r)}`)

// bug: flagged line must break it, the fix must repair it
const bug = { ...base, type: 'bug', prompt: 'One line makes the total wrong — which?', code: [L('prices = [4, 6, 10]'), L('total = 0'), { text: 'for p in prices[1:]:', hasError: true }, L('    total += p'), L('print(total)')].map(l => ({ hasError: false, ...l })), correctLine: 2,
    verify: { fix: 'for p in prices:', expected_stdout: '20' } }
r = statusOf(bug)
assert.equal(r.status, 'pass', `logic bug with fix passes: ${failed(r)}`)
r = statusOf({ ...bug, verify: { fix: 'for p in prices[2:]:', expected_stdout: '20' } })
assert.ok(failed(r).includes('fix-prints-expected'), 'a fix that does not fix is caught')
r = statusOf({ ...bug, verify: undefined })
assert.equal(r.status, 'manual', 'bug without machine proof goes to manual review')

// unsupported type never auto-passes
r = statusOf({ ...base, type: 'pair', prompt: 'Match the pairs please', pairs: [{ left: 'a', right: 'b' }, { left: 'c', right: 'd' }] })
assert.ok(failed(r).includes('supported-type'))

console.log('question-gen gates: 17 checks passed (python, javascript, java)')
