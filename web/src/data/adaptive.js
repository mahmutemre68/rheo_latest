/* ══════════════════════════════════════════════════════════════════
   Rheo — Adaptive difficulty

   Every exercise carries a difficulty rating and every learner carries an
   ability rating, both on the SAME scale as the arena ELO (1000 = an average
   learner). One number means one thing everywhere in the app.

   After each answer both ratings move, exactly like a chess result: beating a
   hard question raises you a lot and lowers the question a little; losing to an
   easy question does the reverse. Item ratings therefore self-calibrate from
   real answers, so a newly authored question does not need a hand-picked
   difficulty — a rough prior is enough and the data corrects it.

   Selection then targets a success probability just under certainty
   (TARGET_SUCCESS): high enough that a learner keeps their streak, low enough
   that they are still working. Fail a few and the next questions get easier;
   run a streak and they get harder. No server, no model download, no network.
   ══════════════════════════════════════════════════════════════════ */

import { loadSaved, saveTo } from './storage.js'
import { journeyNodes, getActiveLanguage, getExercisesForNode } from './core.js'

const ABILITY_KEY = 'rheo_ability'
const ITEM_KEY = 'rheo_item_difficulty'
const ACTIVITY_KEY = 'rheo_activity'

const START_RATING = 1000        // same baseline as duelStats.elo
const TARGET_SUCCESS = 0.78      // the band where learning is fastest
export const LESSON_LENGTH = 6   // questions served per lesson
export const SHORT_LESSON_LENGTH = 4   // chest and playground nodes

// Elo has no natural floor or ceiling: a long unlucky run can drive a rating
// somewhere meaningless (a simulated all-wrong learner reached 383) and it then
// takes hundreds of answers to climb back. Clamp both ratings to a range that
// still spans well past every band.
const RATING_MIN = 500
const RATING_MAX = 2800
const clamp = r => Math.min(RATING_MAX, Math.max(RATING_MIN, r))

/* ── Difficulty priors ──────────────────────────────────────────────
   A first guess only. Chapter carries most of the signal (the journey is
   already ordered by difficulty); exercise type adjusts it, because "spot the
   bug" is harder than "match the pairs" even on identical material.          */
const CHAPTER_BASE = ch => 780 + (Math.min(Math.max(ch, 1), 10) - 1) * 115  // CH1 780 … CH10 1815

const TYPE_OFFSET = {
    concept: -220, pair: -130, output: -40, trace: 0, fillgap: 20,
    realworld: 40, scramble: 50, errordecode: 80, bug: 90,
    refactor: 110, algostep: 120, terminal: 130, complexity: 150,
}

/* ── Level bands ────────────────────────────────────────────────────
   Reuses the league thresholds so a learner never has to reconcile two
   different ladders: Bronze → Junior, Silver+Gold → Mid, Diamond+ → Senior. */
export const levelBands = [
    { id: 'junior', label: 'Junior', minRating: 0, color: '#38BDF8' },
    { id: 'mid', label: 'Mid', minRating: 1200, color: '#14B8A6' },
    { id: 'senior', label: 'Senior', minRating: 1800, color: '#C084FC' },
]

export function getBand(rating) {
    for (let i = levelBands.length - 1; i >= 0; i--) {
        if (rating >= levelBands[i].minRating) return levelBands[i]
    }
    return levelBands[0]
}

/* Progress towards the next band, 0..1 — for a progress bar. */
export function getBandProgress(rating) {
    const band = getBand(rating)
    const next = levelBands[levelBands.indexOf(band) + 1]
    if (!next) return { band, next: null, progress: 1, remaining: 0 }
    const span = next.minRating - band.minRating
    return {
        band, next,
        progress: Math.min(1, Math.max(0, (rating - band.minRating) / span)),
        remaining: Math.max(0, Math.round(next.minRating - rating)),
    }
}

/* ── Learner ability ──────────────────────────────────────────────── */
function _loadAbility() {
    const saved = loadSaved(ABILITY_KEY, null)
    return saved && typeof saved.overall === 'number'
        ? saved
        : { overall: START_RATING, attempts: 0, skills: {} }
}
let _ability = _loadAbility()

function _skillOf(nodeId) {
    return journeyNodes.find(n => n.id === nodeId)?.skill || 'mixed'
}

/** Ability on a single skill, falling back to overall for skills never seen. */
export function getAbility(skill) {
    if (!skill) return _ability.overall
    const s = _ability.skills[skill]
    return typeof s?.rating === 'number' ? s.rating : _ability.overall
}

export function getOverallAbility() { return _ability.overall }

/** Every skill the learner has actually attempted, strongest first. */
export function getAbilityBySkill() {
    return Object.entries(_ability.skills)
        .map(([skill, s]) => ({ skill, rating: Math.round(s.rating), attempts: s.attempts }))
        .sort((a, b) => b.rating - a.rating)
}

export function resetAdaptive() {
    _ability = { overall: START_RATING, attempts: 0, skills: {} }
    saveTo(ABILITY_KEY, _ability)
    saveTo(ITEM_KEY, {})
    _items = {}
}

/* ── Item difficulty ──────────────────────────────────────────────── */
let _items = loadSaved(ITEM_KEY, {}) || {}

function _itemKey(item, lang) {
    return `${lang || getActiveLanguage()}:${item._nodeId}:${item._exerciseIndex}`
}

/** Prior difficulty from the item's place in the journey and its type. */
export function priorDifficulty(item) {
    const node = journeyNodes.find(n => n.id === item._nodeId)
    const base = CHAPTER_BASE(node?.chapter ?? 1)
    return base + (TYPE_OFFSET[item.type] ?? 0)
}

/** Current difficulty: the calibrated value once we have data, else the prior. */
export function getDifficulty(item, lang) {
    if (item?._nodeId == null) return START_RATING
    const rec = _items[_itemKey(item, lang)]
    return typeof rec?.d === 'number' ? rec.d : priorDifficulty(item)
}

/** How many real answers back this item's rating — 0 means "still a guess". */
export function getDifficultyConfidence(item, lang) {
    return _items[_itemKey(item, lang)]?.n || 0
}

/* ── The update rule ──────────────────────────────────────────────── */
export function expectedScore(ability, difficulty) {
    return 1 / (1 + 10 ** ((difficulty - ability) / 400))
}

// The learner moves fast while we know little about them, then settles, so an
// unlucky answer on question 200 does not undo a term's worth of evidence.
const _kUser = attempts => 12 + 40 / (1 + attempts / 25)
// An item moves more slowly than a learner: one person should not redefine a
// question, but fifty should.
const _kItem = n => 4 + 28 / (1 + n / 8)

/**
 * Fold one answer into both ratings.
 * Returns what changed, so the UI can show it if we ever want to.
 */
export function recordAttempt(item, correct, lang) {
    // Activity is logged for every answered question, even one we cannot rate.
    recordActivity(correct)
    if (!item || item._nodeId == null) return null

    const l = lang || getActiveLanguage()
    const key = _itemKey(item, l)
    const skill = _skillOf(item._nodeId)

    const difficulty = getDifficulty(item, l)
    const ability = getAbility(skill)
    const expected = expectedScore(ability, difficulty)
    const actual = correct ? 1 : 0
    const surprise = actual - expected

    // Learner: per-skill and overall move together, overall more slowly since
    // it aggregates every skill.
    const skillRec = _ability.skills[skill] || { rating: _ability.overall, attempts: 0 }
    const kU = _kUser(skillRec.attempts)
    skillRec.rating = clamp(ability + kU * surprise)
    skillRec.attempts += 1
    _ability.skills[skill] = skillRec

    _ability.attempts += 1
    _ability.overall = clamp(_ability.overall + _kUser(_ability.attempts) * 0.5 * surprise)
    saveTo(ABILITY_KEY, _ability)

    // Item: drifts against the learner. Answered right more often than expected
    // => the question is easier than we thought.
    const rec = _items[key] || { d: difficulty, n: 0 }
    rec.d = clamp(difficulty - _kItem(rec.n) * surprise)
    rec.n += 1
    _items[key] = rec
    saveTo(ITEM_KEY, _items)

    return {
        skill,
        ability: Math.round(skillRec.rating),
        abilityDelta: Math.round(skillRec.rating - ability),
        difficulty: Math.round(rec.d),
        expected,
    }
}

/* ── Daily activity ─────────────────────────────────────────────────
   One row per day: how many questions were answered and how many were right.
   Keyed by local YYYY-MM-DD, because a contribution grid is about the learner's
   calendar day, not UTC. Kept for two years, which is far past what the grid
   renders and still trivial in size (a few hundred short rows).               */
const ACTIVITY_RETENTION_DAYS = 730

export function dayKey(date = new Date()) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

let _activity = loadSaved(ACTIVITY_KEY, {}) || {}

export function recordActivity(correct) {
    const key = dayKey()
    const row = _activity[key] || { n: 0, ok: 0 }
    row.n += 1
    if (correct) row.ok += 1
    _activity[key] = row

    // Drop anything older than the retention window.
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - ACTIVITY_RETENTION_DAYS)
    const cutoffKey = dayKey(cutoff)
    for (const k of Object.keys(_activity)) if (k < cutoffKey) delete _activity[k]

    saveTo(ACTIVITY_KEY, _activity)
    return row
}

export function getDayActivity(date = new Date()) {
    return _activity[dayKey(date)] || { n: 0, ok: 0 }
}

/** Intensity bucket for the grid. 0 = nothing that day. */
export function activityLevel(n) {
    if (!n) return 0
    if (n < 4) return 1
    if (n < 10) return 2
    if (n < 20) return 3
    return 4
}

/**
 * The last `weeks` weeks as GitHub-style columns.
 * Each column is one week starting Monday; each cell one day. Days after today
 * are returned with `future: true` so the grid can leave them blank instead of
 * showing an unearned empty square.
 */
export function getActivityGrid(weeks = 53) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Walk back to the Monday of the current week, then back `weeks - 1` more.
    const mondayOffset = (today.getDay() + 6) % 7
    const start = new Date(today)
    start.setDate(start.getDate() - mondayOffset - (weeks - 1) * 7)

    const columns = []
    let total = 0, activeDays = 0
    const cursor = new Date(start)
    for (let w = 0; w < weeks; w++) {
        const col = []
        for (let d = 0; d < 7; d++) {
            const key = dayKey(cursor)
            const row = _activity[key] || { n: 0, ok: 0 }
            const future = cursor > today
            if (!future) { total += row.n; if (row.n) activeDays++ }
            col.push({
                key, future,
                date: new Date(cursor),
                month: cursor.getMonth(),
                n: future ? 0 : row.n,
                ok: future ? 0 : row.ok,
                level: future ? 0 : activityLevel(row.n),
            })
            cursor.setDate(cursor.getDate() + 1)
        }
        columns.push(col)
    }
    return { columns, total, activeDays, weeks }
}

/* ── Selection ────────────────────────────────────────────────────── */
/**
 * Pick the questions for one lesson out of that node's pool.
 *
 * Ranks by how close each item sits to TARGET_SUCCESS for this learner, then
 * serves them easiest-first so the lesson ramps instead of opening on its
 * hardest question. When the pool is no bigger than the lesson it degrades to
 * "everything, in difficulty order" — which is still better than authored order.
 */
export function selectExercisesForNode(nodeId, lang, count = LESSON_LENGTH) {
    const l = lang || getActiveLanguage()
    const pool = getExercisesForNode(nodeId, l)
    if (!pool.length) return pool

    const ability = getAbility(_skillOf(nodeId))
    const byDifficulty = (a, b) => getDifficulty(a, l) - getDifficulty(b, l)

    if (pool.length <= count) return [...pool].sort(byDifficulty)

    const ranked = [...pool].sort((a, b) => {
        const da = Math.abs(expectedScore(ability, getDifficulty(a, l)) - TARGET_SUCCESS)
        const db = Math.abs(expectedScore(ability, getDifficulty(b, l)) - TARGET_SUCCESS)
        if (da !== db) return da - db
        // Tie-break towards items we know least about, so new questions get
        // calibrated instead of being starved by well-measured ones.
        return getDifficultyConfidence(a, l) - getDifficultyConfidence(b, l)
    })

    return ranked.slice(0, count).sort(byDifficulty)
}

/** Predicted success rate on a node — powers the "how hard is this for me" badge. */
export function nodeDifficultyForUser(nodeId, lang) {
    const l = lang || getActiveLanguage()
    const pool = getExercisesForNode(nodeId, l)
    if (!pool.length) return null
    const ability = getAbility(_skillOf(nodeId))
    const avg = pool.reduce((s, ex) => s + getDifficulty(ex, l), 0) / pool.length
    return {
        rating: Math.round(avg),
        expected: expectedScore(ability, avg),
        band: getBand(avg),
    }
}
