// Read-only access to the app's question data from Node: journey nodes, the
// authored banks and the approved AI banks. core.js expects a browser, so a
// minimal localStorage/window shim is installed before it is imported.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
export const WEB_SRC = path.join(REPO, 'web', 'src')
export const LANGS = ['python', 'javascript', 'java']

if (!globalThis.localStorage) {
    const store = new Map()
    globalThis.localStorage = {
        getItem: k => store.get(k) ?? null,
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: k => store.delete(k),
    }
}
if (!globalThis.window) globalThis.window = { addEventListener() {}, dispatchEvent() {}, localStorage: globalThis.localStorage }

const AUTHORED = {
    python: [['exercises_python.js', 'pyExercises'], ['exercises_python2.js', 'pyExercisesCh6to10']],
    javascript: [['exercises_js.js', 'jsExercises'], ['exercises_js2.js', 'jsExercisesCh6to10']],
    java: [['exercises_java.js', 'javaExercises'], ['exercises_java2.js', 'javaExercisesCh6to10']],
}

export async function journeyNodes() {
    const core = await import(path.join(WEB_SRC, 'data', 'core.js'))
    return core.journeyNodes
}

/** Authored exercises for a language: { [nodeId]: exercise[] } */
export async function authoredBank(lang) {
    const bank = {}
    for (const [file, name] of AUTHORED[lang]) Object.assign(bank, (await import(path.join(WEB_SRC, file)))[name])
    return bank
}

export const generatedPath = lang => path.join(WEB_SRC, 'generated', `ai_${lang}.json`)

/** Approved AI exercises for a language: { [nodeId]: exercise[] } */
export function generatedBank(lang) {
    return JSON.parse(readFileSync(generatedPath(lang), 'utf8'))
}

export function writeGeneratedBank(lang, bank) {
    const sorted = Object.fromEntries(Object.entries(bank).sort((a, b) => Number(a[0]) - Number(b[0])))
    writeFileSync(generatedPath(lang), JSON.stringify(sorted, null, 2) + '\n')
}

/** Everything a learner can currently be served for a node. */
export async function nodePool(lang, nodeId) {
    const authored = (await authoredBank(lang))[nodeId] || []
    const generated = generatedBank(lang)[nodeId] || []
    return [...authored, ...generated]
}
