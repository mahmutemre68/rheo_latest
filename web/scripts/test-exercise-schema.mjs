import assert from 'node:assert/strict'
import { normalizeExercise } from '../src/data/normalizeExercise.js'
const store = new Map()
globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, String(value)), removeItem:key=>store.delete(key) }
globalThis.window = { addEventListener() {}, dispatchEvent() {}, localStorage: globalThis.localStorage }
const { getExercisesForNode } = await import('../src/data/core.js')
const banks = [
 ['python', (await import('../src/exercises_python.js')).pyExercises],
 ['python', (await import('../src/exercises_python2.js')).pyExercisesCh6to10],
 ['javascript', (await import('../src/exercises_js.js')).jsExercises],
 ['javascript', (await import('../src/exercises_js2.js')).jsExercisesCh6to10],
 ['java', (await import('../src/exercises_java.js')).javaExercises],
 ['java', (await import('../src/exercises_java2.js')).javaExercisesCh6to10],
]
let legacy = 0, total = 0
for (const [language, bank] of banks) for (const [node, list] of Object.entries(bank)) {
 const ready = getExercisesForNode(Number(node), language)
 list.forEach((raw, index) => {
  total++
  if (raw.type !== 'complexity') return
  const exercise=ready[index], original=JSON.stringify(raw)
  assert.ok(Array.isArray(exercise.options) && exercise.options.length >= 2)
  assert.ok(Number.isInteger(exercise.correct) && exercise.correct >= 0 && exercise.correct < exercise.options.length)
  if (raw.optionA) {
   legacy++
   assert.equal(exercise.options[exercise.correct].code, raw[raw.correct === 'A' ? 'optionA' : 'optionB'].code)
  }
  normalizeExercise(raw)
  assert.equal(JSON.stringify(raw),original,'authored banks not mutated')
  assert.equal(exercise._nodeId,Number(node));assert.equal(exercise._exerciseIndex,index)
 })
}
assert.equal(legacy,55)
for(const malformed of [{type:'complexity',optionA:{code:'a'},correct:'A'},{type:'complexity',optionA:{code:'a'},optionB:{code:'b'},correct:'Z'}]) {
 const ex=normalizeExercise(malformed)
 assert.ok(!Array.isArray(ex.options) || !Number.isInteger(ex.correct),'malformed cards must remain invalid for validator')
}
const split=banks[4][1][18].find(ex=>ex.type==='fillgap' && ex.prompt==='Complete: split a sentence into words')
assert.equal(split.correctFill.g1,'split(" ")')
assert.ok(split.bank.includes(split.correctFill.g1))
assert.equal(split.codeParts.filter(part=>part.type==='gap')[0].text,split.correctFill.g1)
assert.equal(split.codeParts.map(part=>part.type==='gap'?split.correctFill[part.id]:part.text).join(''),'String s = "one two three";\nString[] parts = s.split(" ");\nSystem.out.println(parts.length); // 3')
console.log(`${total} questions inspected; 55 legacy complexity cards render-ready with shuffled correct mapping; malformed cards remain invalid; Java split assembled source passed.`)
