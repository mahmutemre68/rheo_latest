import assert from 'node:assert/strict'
import { normalizeDailyRewardState as normalize } from '../src/data/dailyRewardState.js'
const now = new Date(2026, 9, 8, 12)
const yesterday = new Date(2026, 9, 7, 12).toDateString()
const today = now.toDateString()
for (const value of [null, false, 12, 'bad', [], {}, { currentDay: 4, lastClaimDate: 'invalid' }]) {
 assert.deepEqual(normalize(value, now), {currentDay: 1, lastClaimDate: null, claimedToday: false})
}
for (const day of [-1, 0, 8, 99, 1.5, '3', null]) {
 assert.equal(normalize({currentDay: day, lastClaimDate: today}, now).currentDay, 1)
 assert.equal(normalize({currentDay: day, lastClaimDate: today}, now).claimedToday, true)
}
for (let day = 1; day <= 7; day++) {
 assert.equal(normalize({currentDay: day, lastClaimDate: yesterday}, now).currentDay, day)
 assert.equal(normalize({currentDay: day, lastClaimDate: yesterday, claimedToday: true}, now).claimedToday, false)
}
assert.equal(normalize({currentDay: 4, lastClaimDate: new Date(2026, 9, 6).toDateString()}, now).currentDay, 1)
assert.equal(normalize({currentDay: 4, lastClaimDate: new Date(2026, 9, 9).toDateString()}, now).claimedToday, true)
// Input must remain immutable.
const state = Object.freeze({currentDay: 3, lastClaimDate: today})
assert.equal(normalize(state, now).claimedToday, true)
console.log('Daily reward malformed-state, same-day, rollover, clock rollback and immutability checks passed')
