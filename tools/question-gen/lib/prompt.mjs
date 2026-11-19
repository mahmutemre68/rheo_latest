// Prompt + tool schema for the generator. The model answers through a single
// tool call so the output is structured JSON, not prose to be parsed.
import { codeText } from './runner.mjs'

const LANG_NAME = { python: 'Python', javascript: 'JavaScript', java: 'Java' }

const codeLines = {
    type: 'array', minItems: 2, maxItems: 14,
    items: {
        type: 'object', required: ['text'],
        properties: { text: { type: 'string' }, highlight: { type: 'boolean' }, hasError: { type: 'boolean' } },
    },
}

const verify = {
    type: 'object',
    description: 'Machine check of the answer. Never shown to learners.',
    properties: {
        program: { type: 'string', description: 'trace/output: a complete program whose stdout is EXACTLY the correct option text. Omit when the shown code already prints exactly that. bug: optional full program containing the buggy line verbatim.' },
        fix: { type: 'string', description: 'bug only: replacement for the buggy line that makes the program correct.' },
        expected_stdout: { type: 'string', description: 'bug only: what the fixed program prints. Required for logic bugs (code that runs but is wrong).' },
    },
}

export const TOOL = {
    name: 'submit_questions',
    description: 'Submit the generated Rheo code-reading exercises.',
    input_schema: {
        type: 'object', required: ['questions'],
        properties: {
            questions: {
                type: 'array',
                items: {
                    type: 'object',
                    required: ['type', 'prompt', 'code', 'explanation', 'hint', 'verify'],
                    properties: {
                        type: { enum: ['trace', 'output', 'bug'] },
                        prompt: { type: 'string', description: 'The question, one short sentence. Inline code in backticks.' },
                        code: codeLines,
                        terminalOutput: { type: 'string', description: 'output type only: exactly what the code prints.' },
                        options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4, description: 'trace/output: four options, plain strings.' },
                        correct: { type: 'integer', minimum: 0, maximum: 3, description: 'trace/output: index of the correct option.' },
                        correctLine: { type: 'integer', minimum: 0, description: 'bug: 0-based index of the one line with hasError: true.' },
                        explanation: { type: 'string', description: '2–3 sentences: why the answer is right AND which misconception each tempting distractor encodes.' },
                        hint: { type: 'string', description: 'A nudge toward the method, never the answer itself.' },
                        verify,
                    },
                },
            },
        },
    },
}

export const SYSTEM = `You write exercises for Rheo, a mobile app that teaches people to READ code (think Duolingo for code reading). Learners are beginners to intermediates on a phone screen.

Rules:
- Code fits a phone: 2–14 short lines, no line longer than ~44 characters, no comments that give the answer away.
- Code must be correct, deterministic, runnable as shown (Java: statements run inside main(); you may declare static methods). No input(), randomness, time, files or network.
- trace/output: the four options are plausible. Each distractor encodes a specific, common misconception (off-by-one, mutation vs copy, integer vs float division, scope, short-circuiting…). Never "None of the above".
- The answer key is machine-checked: verify.program must print EXACTLY the correct option text. If the shown code already prints exactly that, omit verify.program.
- bug: exactly one line has hasError: true and correctLine points at it; give verify.fix (the corrected line). For a logic bug also give verify.expected_stdout (what the fixed program prints).
- explanation teaches; hint nudges. Write both in clear, friendly English.
- Do not reuse the examples' code or scenario; vary variable names and real-world framing.`

export function userPrompt({ lang, node, type, count, examples }) {
    const shots = examples.map((ex, i) => `Example ${i + 1}:\n${JSON.stringify(stripInternal(ex), null, 1)}`).join('\n\n')
    const existing = examples.length ? '' : '\n(No examples of this type exist for this node yet; follow the schema.)'
    return `Write ${count} new "${type}" exercise(s) in ${LANG_NAME[lang]}.

Journey position: chapter ${node.chapter}, node ${node.id} "${node.title}", skill: ${node.skill}.
Difficulty should match that position — earlier chapters are gentler.

Here are existing exercises from this part of the journey, to match tone and level (do not copy them):${existing}

${shots}

Call submit_questions with exactly ${count} question(s).`
}

export function stripInternal(ex) {
    const { _nodeId, _exerciseIndex, source, model, generatedAt, reviewedBy, reviewedAt, verify, ...rest } = ex
    return rest
}

/** Pick few-shot examples: same type in this node first, then same chapter. */
export function pickExamples(type, nodeId, bankByNode, nodes, max = 3) {
    const node = nodes.find(n => n.id === nodeId)
    const sameNode = (bankByNode[nodeId] || []).filter(e => e.type === type)
    const sameChapter = nodes.filter(n => n.chapter === node.chapter && n.id !== nodeId)
        .flatMap(n => (bankByNode[n.id] || []).filter(e => e.type === type))
    return [...sameNode, ...sameChapter].filter(e => codeText(e)).slice(0, max)
}
