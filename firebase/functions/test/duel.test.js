import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { memoryDb } from './memoryDb.js'
import * as D from '../src/duel.js'

const pool = JSON.parse(readFileSync(new URL('../src/questions.json', import.meta.url), 'utf8'))
const ctx = { pool, rand: () => 0.42 }

async function matchUp(db, a = 'alice', b = 'bob', lang = 'python') {
    assert.deepEqual(await D.joinQueue(db, a, { lang, name: 'Alice' }, ctx), { status: 'queued' })
    const r = await D.joinQueue(db, b, { lang, name: 'Bob' }, ctx)
    assert.equal(r.status, 'matched')
    await db.presence(r.matchId, a, true)
    await db.presence(r.matchId, b, true)
    return r.matchId
}
const priv = (db, id) => db.get(`matchesPrivate/${id}`)
const pub = (db, id) => db.get(`matches/${id}`)

test('pairing: second player is matched, queue empties, both know the match', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    assert.equal(await db.get('users/alice/currentMatch'), id)
    assert.equal(await db.get('users/bob/currentMatch'), id)
    assert.equal(await db.get('queue/python'), null)
    // A player already in a match gets it back instead of a second one.
    assert.deepEqual(await D.joinQueue(db, 'alice', { lang: 'python' }, ctx), { status: 'matched', matchId: id })
})

test('answers never reach the public node until a round closes', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    const p = await pub(db, id)
    const json = JSON.stringify(p)
    assert.equal(p.questions.length, 3)
    assert.ok(p.questions.every(q => !('correct' in q)), 'no correct index in public questions')
    assert.ok(!json.includes('"answers"') && !json.includes('"picks"'), 'no answers or picks published')
    assert.deepEqual(p.results ?? {}, {})
})

test('a full match: too-early, correct vs wrong, reveal, finish, ELO and stats', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    const m0 = await priv(db, id)
    assert.deepEqual(await D.submitAnswer(db, 'alice', { matchId: id, round: 0, choice: 0 }), { accepted: false, reason: 'too-early' })
    for (let r = 0; r < 3; r++) {
        const m = await priv(db, id)
        db.advance(m.roundStartsAt - db.now() + 1200)
        const right = m.answers[r], wrong = (right + 1) % m.questions[r].options.length
        assert.deepEqual(await D.submitAnswer(db, 'alice', { matchId: id, round: r, choice: right }), { accepted: true })
        assert.deepEqual(await D.submitAnswer(db, 'alice', { matchId: id, round: r, choice: right }), { accepted: false, reason: 'already-answered' })
        // after one answer: the opponent can see that Alice locked in, not what she picked
        const p = await pub(db, id)
        assert.equal(p.answered[r].alice, true)
        assert.equal(p.results?.[r], undefined)
        db.advance(800)
        await D.submitAnswer(db, 'bob', { matchId: id, round: r, choice: wrong })
        const after = await pub(db, id)
        // every round, the last one included, ends with a reveal
        assert.equal(after.state, 'reveal')
        assert.equal(after.results[r].correct, right)
        assert.equal(after.results[r].picks.alice.ok, true)
        assert.equal(after.results[r].picks.bob.ok, false)
        db.advance(D.REVEAL_MS + 10)
        await D.tick(db, 'bob', { matchId: id })
        const nxt = await pub(db, id)
        if (r < 2) { assert.equal(nxt.round, r + 1); assert.equal(nxt.state, 'round') }
        else assert.equal(nxt.state, 'done')
    }
    const done = await pub(db, id)
    assert.equal(done.winner, 'alice')
    assert.deepEqual(done.score, { alice: 3, bob: 0 })
    assert.deepEqual(done.eloDelta, { alice: 16, bob: -16 })
    assert.equal(await db.get('users/alice/elo/python'), 1016)
    assert.equal(await db.get('users/bob/elo/python'), 984)
    assert.deepEqual(await db.get('users/alice/stats'), { wins: 1, losses: 0, draws: 0 })
    assert.equal(await db.get('users/alice/currentMatch'), null)
    assert.equal((await db.get('users/bob/history'))[id].result, 'loss')
    // settling happens once, however many ticks arrive afterwards
    await D.tick(db, 'alice', { matchId: id }); await D.tick(db, 'bob', { matchId: id })
    assert.equal(await db.get('users/alice/elo/python'), 1016)
    assert.ok(m0)
})

test('timeouts: nothing closes before the deadline plus grace; then unanswered = wrong', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    const m = await priv(db, id)
    db.advance(m.roundDeadline - db.now() + D.GRACE_MS - 50)
    await D.tick(db, 'alice', { matchId: id })
    assert.equal((await pub(db, id)).state, 'round')
    // inside the grace window an answer still counts
    assert.deepEqual(await D.submitAnswer(db, 'bob', { matchId: id, round: 0, choice: m.answers[0] }), { accepted: true })
    db.advance(100)
    await D.tick(db, 'alice', { matchId: id })
    const p = await pub(db, id)
    assert.equal(p.state, 'reveal')
    // RTDB drops nulls: an unanswered pick is just { ok: false }
    assert.deepEqual(p.results[0].picks.alice, { ok: false })
    assert.equal(p.results[0].picks.bob.ok, true)
    // after the deadline, a late answer for that round is refused
    assert.deepEqual(await D.submitAnswer(db, 'alice', { matchId: id, round: 0, choice: 1 }), { accepted: false, reason: 'round-closed' })
})

test('disconnect: offline longer than the forfeit window loses', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    db.advance(2000)
    await db.presence(id, 'bob', false)
    db.advance(D.FORFEIT_AFTER_MS - 100)
    await D.tick(db, 'alice', { matchId: id })
    assert.equal((await pub(db, id)).state, 'round', 'short drop-outs are tolerated')
    await db.presence(id, 'bob', true) // came back
    db.advance(5000)
    await D.tick(db, 'alice', { matchId: id })
    assert.equal((await pub(db, id)).state, 'round')
    await db.presence(id, 'bob', false)
    db.advance(D.FORFEIT_AFTER_MS + 1)
    await D.tick(db, 'alice', { matchId: id })
    const p = await pub(db, id)
    assert.equal(p.state, 'done'); assert.equal(p.winner, 'alice'); assert.equal(p.endReason, 'forfeit')
    assert.ok(p.presence, 'publishing kept the presence the clients wrote')
})

test('a player who never connects forfeits', async () => {
    const db = memoryDb()
    await D.joinQueue(db, 'alice', { lang: 'java' }, ctx)
    const { matchId } = await D.joinQueue(db, 'bob', { lang: 'java' }, ctx)
    await db.presence(matchId, 'alice', true)
    db.advance(D.FORFEIT_AFTER_MS + 1)
    await D.tick(db, 'alice', { matchId })
    const p = await pub(db, matchId)
    assert.equal(p.winner, 'alice'); assert.equal(p.endReason, 'forfeit')
})

test('resign counts as a loss; outsiders cannot act on a match', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    await assert.rejects(D.submitAnswer(db, 'mallory', { matchId: id, round: 0, choice: 0 }), e => e.code === 'permission-denied')
    await assert.rejects(D.tick(db, 'mallory', { matchId: id }), e => e.code === 'permission-denied')
    await assert.rejects(D.submitAnswer(db, 'alice', { matchId: id, round: 0, choice: 'x' }), e => e.code === 'invalid-argument')
    const m = await priv(db, id)
    db.advance(m.roundStartsAt - db.now() + 10)
    await assert.rejects(D.submitAnswer(db, 'alice', { matchId: id, round: 0, choice: 99 }), e => e.code === 'invalid-argument')
    await D.resign(db, 'bob', { matchId: id })
    const p = await pub(db, id)
    assert.equal(p.winner, 'alice'); assert.equal(p.endReason, 'resign')
})

test('draw: equal score and no correct answers → no rating change between equals', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    for (let r = 0; r < 3; r++) {
        const m = await priv(db, id)
        db.advance(Math.max(m.roundDeadline, m.revealUntil ?? 0) - db.now() + D.GRACE_MS + 10)
        await db.presence(id, 'alice', true); await db.presence(id, 'bob', true)
        await D.tick(db, 'alice', { matchId: id })
        const after = await priv(db, id)
        if (after.state === 'reveal') { db.advance(D.REVEAL_MS + 10); await db.presence(id, 'alice', true); await db.presence(id, 'bob', true); await D.tick(db, 'bob', { matchId: id }) }
    }
    const p = await pub(db, id)
    assert.equal(p.state, 'done'); assert.equal(p.winner, 'draw'); assert.deepEqual(p.eloDelta, { alice: 0, bob: 0 })
})

test('tie on score is broken by speed of correct answers', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    for (let r = 0; r < 3; r++) {
        const m = await priv(db, id)
        db.advance(Math.max(0, m.roundStartsAt - db.now()) + 1000)
        await D.submitAnswer(db, 'bob', { matchId: id, round: r, choice: m.answers[r] }) // bob faster
        db.advance(2000)
        await D.submitAnswer(db, 'alice', { matchId: id, round: r, choice: m.answers[r] })
        db.advance(D.REVEAL_MS + 10); await D.tick(db, 'alice', { matchId: id })
    }
    const p = await pub(db, id)
    assert.deepEqual(p.score, { alice: 3, bob: 3 })
    assert.equal(p.winner, 'bob')
})

test('simultaneous answers close the round exactly once', async () => {
    const db = memoryDb()
    const id = await matchUp(db)
    const m = await priv(db, id)
    db.advance(m.roundStartsAt - db.now() + 500)
    await Promise.all([
        D.submitAnswer(db, 'alice', { matchId: id, round: 0, choice: m.answers[0] }),
        D.submitAnswer(db, 'bob', { matchId: id, round: 0, choice: m.answers[0] }),
    ])
    const p = await priv(db, id)
    assert.deepEqual(p.score, { alice: 1, bob: 1 })
    assert.equal(p.state, 'reveal')
})

test('matchmaking respects the ELO window, widens it with waiting, drops stale entries', async () => {
    const db = memoryDb()
    await db.set('users/pro/elo/python', 1700)
    await db.set('users/mid/elo/python', 1300)
    await D.joinQueue(db, 'newbie', { lang: 'python' }, ctx)           // 1000
    db.advance(1000)
    assert.equal((await D.joinQueue(db, 'pro', { lang: 'python' }, ctx)).status, 'queued', '700 apart: never paired')
    db.advance(2000)
    assert.equal((await D.joinQueue(db, 'mid', { lang: 'python' }, ctx)).status, 'queued', '300 apart after 3 s: too far yet')
    db.advance(5000)
    // heartbeats keep entries fresh and retry pairing with the widened window
    await D.joinQueue(db, 'newbie', { lang: 'python' }, ctx)
    const r = await D.joinQueue(db, 'mid', { lang: 'python' }, ctx)
    assert.equal(r.status, 'matched', '300 apart after 8 s: fair enough')
    const q = await db.get('queue/python')
    assert.deepEqual(Object.keys(q), ['pro'])
    // a queue entry nobody refreshed for 15 s is ignored
    db.advance(D.QUEUE_STALE_MS + 1)
    await db.set('users/late/elo/python', 1690)
    assert.equal((await D.joinQueue(db, 'late', { lang: 'python' }, ctx)).status, 'queued')
    await D.leaveQueue(db, 'late', { lang: 'python' })
    assert.deepEqual(Object.keys(await db.get('queue/python')), ['pro'])
})

test('pure helpers', () => {
    assert.equal(D.eloDelta(1000, 1000, 1), 16)
    assert.equal(D.eloDelta(1000, 1400, 1), 29)
    assert.equal(D.acceptableGap(0), 100)
    assert.equal(D.acceptableGap(60_000), 600)
    assert.equal(D.sanitizeName('  <b>Zeynep</b>\u0000 ', 'abcd1234'), 'bZeynepb')
    assert.equal(D.sanitizeName('', 'abcd1234'), 'Player-abcd')
    const qs = D.pickQuestions(pool.python, 1000, 3, () => 0.1)
    assert.equal(qs.length, 3); assert.ok(qs.every(q => q.difficulty === 1))
})
