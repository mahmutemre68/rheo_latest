// Quality gates every candidate passes before a human sees it.
//
//   schema      — the app's own answerability rules (web/scripts/lib/exerciseRules.mjs)
//                 plus generator-only requirements (explanation, hint, 4 options…)
//   execution   — trace/output: run verify.program (default: the shown code);
//                 stdout must equal the correct option and differ from every
//                 distractor. bug: the flagged line must break the program and
//                 verify.fix must repair it.
//   duplicate   — not identical to, or a near copy of, anything in the node's pool
//
// A candidate is `pass` (all gates green), `manual` (no automatic proof of the
// answer is possible for its type — a reviewer must check the key), or `fail`.
import { exerciseProblems } from '../../../web/scripts/lib/exerciseRules.mjs'
import { runProgram, codeText, normalizeOutput } from './runner.mjs'

export const EXECUTABLE_TYPES = new Set(['trace', 'output'])
export const SUPPORTED_TYPES = ['trace', 'output', 'bug']
const MAX_CODE_LINES = 14

function check(name, ok, detail = '') { return { name, ok: !!ok, detail } }

export function schemaGate(ex) {
    const checks = []
    const problems = exerciseProblems(ex, '')
    checks.push(check('app-rules', problems.length === 0, problems.join('; ')))
    checks.push(check('supported-type', SUPPORTED_TYPES.includes(ex.type), ex.type))
    checks.push(check('prompt', typeof ex.prompt === 'string' && ex.prompt.trim().length >= 8))
    checks.push(check('explanation', typeof ex.explanation === 'string' && ex.explanation.trim().length >= 40, 'at least 40 chars'))
    checks.push(check('hint', typeof ex.hint === 'string' && ex.hint.trim().length >= 10 && !ex.hint.includes(String(ex.options?.[ex.correct] ?? '\u0000')), 'present and does not give the answer away'))
    if (Array.isArray(ex.code)) checks.push(check('code-length', ex.code.length >= 2 && ex.code.length <= MAX_CODE_LINES, `${ex.code.length} lines`))
    if (ex.type === 'trace' || ex.type === 'output')
        checks.push(check('four-options', Array.isArray(ex.options) && ex.options.length === 4))
    return checks
}

const collapse = s => normalizeOutput(s).replace(/\s+/g, ' ')
const optionText = o => (typeof o === 'string' ? o : o?.label ?? o?.code ?? '')

export function executionGate(ex, lang) {
    if (EXECUTABLE_TYPES.has(ex.type)) {
        const program = ex.verify?.program ?? codeText(ex)
        const run = runProgram(lang, program)
        if (!run.ok) return [check('runs', false, run.timedOut ? 'timed out' : run.stderr.trim().split('\n').slice(-3).join(' | '))]
        const got = collapse(run.stdout)
        const correct = collapse(optionText(ex.options[ex.correct]))
        const checks = [check('runs', true), check('stdout-equals-correct-option', got === correct, `stdout=${JSON.stringify(got)} correct=${JSON.stringify(correct)}`)]
        const clashes = ex.options.filter((o, i) => i !== ex.correct && collapse(optionText(o)) === got)
        checks.push(check('distractors-are-wrong', clashes.length === 0, clashes.length ? `distractor equals output: ${JSON.stringify(clashes)}` : ''))
        if (ex.type === 'output' && ex.terminalOutput != null)
            checks.push(check('terminal-output-matches', collapse(ex.terminalOutput) === got, `terminalOutput=${JSON.stringify(ex.terminalOutput)}`))
        return checks
    }
    if (ex.type === 'bug' && ex.verify?.fix != null) {
        const lines = ex.code.map(l => l.text)
        const broken = runProgram(lang, ex.verify.program ?? lines.join('\n'))
        const fixedLines = [...lines]; fixedLines[ex.correctLine] = ex.verify.fix
        const fixedSrc = ex.verify.program ? ex.verify.program.replace(lines[ex.correctLine], ex.verify.fix) : fixedLines.join('\n')
        const fixed = runProgram(lang, fixedSrc)
        const checks = [check('fix-runs', fixed.ok, fixed.ok ? '' : fixed.stderr.trim().split('\n').slice(-2).join(' | '))]
        if (ex.verify.expected_stdout != null) {
            checks.push(check('fix-prints-expected', fixed.ok && collapse(fixed.stdout) === collapse(ex.verify.expected_stdout), `got ${JSON.stringify(collapse(fixed.stdout))}`))
            checks.push(check('bug-changes-behaviour', !broken.ok || collapse(broken.stdout) !== collapse(ex.verify.expected_stdout), 'the flagged line must matter'))
        } else {
            checks.push(check('bug-breaks-program', !broken.ok, 'without expected_stdout the bug must be a crash or syntax error'))
        }
        return checks
    }
    return null // no automatic proof for this type → manual review of the key
}

const tokens = s => new Set(String(s).toLowerCase().match(/[a-z_]+|\d+|[^\s\w]/g) || [])
function jaccard(a, b) {
    if (!a.size && !b.size) return 1
    let inter = 0
    for (const t of a) if (b.has(t)) inter++
    return inter / (a.size + b.size - inter)
}
const fingerprint = ex => `${ex.prompt ?? ''}\n${codeText(ex)}\n${(ex.options || []).map(optionText).join('|')}`

export function duplicateGate(ex, pool) {
    const mine = tokens(fingerprint(ex))
    const squash = s => s.replace(/\s+/g, '')
    let best = 0, bestPrompt = ''
    for (const other of pool) {
        if (squash(codeText(other)) && squash(codeText(other)) === squash(codeText(ex)))
            return [check('not-duplicate', false, `same code as "${other.prompt}"`)]
        const sim = jaccard(mine, tokens(fingerprint(other)))
        if (sim > best) { best = sim; bestPrompt = other.prompt }
    }
    return [check('not-near-duplicate', best < 0.75, `closest ${best.toFixed(2)} "${bestPrompt}"`)]
}

export function runGates(ex, lang, pool) {
    const gates = { schema: schemaGate(ex) }
    const schemaOk = gates.schema.every(c => c.ok)
    gates.execution = schemaOk ? executionGate(ex, lang) : [check('skipped', false, 'schema failed')]
    gates.duplicate = duplicateGate(ex, pool)
    const all = [...gates.schema, ...(gates.execution || []), ...gates.duplicate]
    const status = all.every(c => c.ok) ? (gates.execution ? 'pass' : 'manual') : 'fail'
    return { status, gates }
}
