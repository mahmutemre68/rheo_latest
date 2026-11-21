// Copy the app's duel question pool (with answers) into the functions bundle.
// The server is the only place answers live during a live duel. Re-run after
// editing web/src/data/questions_*.js:  npm run sync-questions
import { writeFileSync } from 'node:fs'
const { duelQuestionPool } = await import('../../../web/src/data/duel_questions.js')
const out = {}
for (const [lang, list] of Object.entries(duelQuestionPool)) {
    out[lang] = list.map(({ text, code, options, correct, type, difficulty }) => ({ text, ...(code ? { code } : {}), options, correct, type, difficulty }))
}
writeFileSync(new URL('../src/questions.json', import.meta.url), JSON.stringify(out) + '\n')
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])))
