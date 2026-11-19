/* ══════════════════════════════════════════════════════════════════
   Rheo — Adaptive placement

   A short computerized adaptive test on the SAME rating scale as the rest of
   the app (adaptive.js): a learner's ability and every item's difficulty are
   Elo numbers, 1000 = average.

     1. Ask about experience → a starting estimate (new learners skip the test).
     2. Serve up to PLACEMENT_LENGTH real journey questions, each the unused one
        whose difficulty sits closest to the current estimate, one per chapter,
        so the test climbs or drops across the whole journey. After every answer
        the estimate is refit to ALL answers so far (maximum a posteriori under
        the app's Elo/logistic model, with the self-report as a weak prior) —
        every answer counts equally, so a strong start cannot carry a learner
        who then misses everything.
     3. Map the estimate to a starting chapter: every chapter whose typical
        question the learner would get right PASS_PROBABILITY of the time is
        passed. Passed chapters unlock (never complete — no stars, XP or badges
        are granted for skipping) and the ability ratings are seeded, so the
        first lessons already sit at the right difficulty.

   Placement only ever moves a learner forward: completed or unlocked nodes are
   never locked again, and ratings backed by real answers are not overwritten.
   ══════════════════════════════════════════════════════════════════ */

import { journeyNodes, getExercisesForNode, saveProgress } from './core.js'
import { getDifficulty, expectedScore, chapterBaseRating, seedAbility } from './adaptive.js'
import { logEvent } from '../nativeBridge.js'

export const PLACEMENT_LENGTH = 8
export const PASS_PROBABILITY = 0.7
const MAX_CHAPTER = 10
const THETA_MIN = 600, THETA_MAX = 2100
const PRIOR_SD = 300   // how far the self-report is trusted, in rating points

/** Starting estimate per self-reported experience. `new` skips the test. */
export const EXPERIENCE_START = { new: null, some: 1100, experienced: 1350 }

const PLACEMENT_TYPES = new Set(['trace', 'output'])

/** Every question usable in placement for a language: auto-gradable, short,
 *  from lesson/boss nodes, with plain-string options. Bank must be loaded. */
export function buildPlacementPool(lang) {
    const pool = []
    for (const node of journeyNodes) {
        if (node.type !== 'lesson' && node.type !== 'boss') continue
        for (const ex of getExercisesForNode(node.id, lang)) {
            if (!PLACEMENT_TYPES.has(ex.type) || ex.source === 'ai') continue
            if (!Array.isArray(ex.code) || ex.code.length > 10) continue
            // Real code only: items written as commented pseudo-code read badly
            // out of context, and long lines do not fit a phone.
            const lines = ex.code.map(l => String(l.text ?? ''))
            if (lines.filter(t => t.trim() && !/^\s*(\/\/|#)/.test(t)).length < 2) continue
            if (lines.some(t => t.length > 46)) continue
            if (!Array.isArray(ex.options) || ex.options.length < 3 || ex.options.some(o => typeof o !== 'string')) continue
            pool.push({ item: ex, chapter: node.chapter, difficulty: getDifficulty(ex, lang) })
        }
    }
    return pool
}

export function createPlacementSession(experience, pool) {
    const start = EXPERIENCE_START[experience]
    if (start == null) throw new Error(`no placement for experience "${experience}"`)
    return { experience, theta: start, pool, asked: [] }
}

/** The unused question closest to the current estimate, one per chapter. */
export function nextPlacementItem(session) {
    const usedChapters = new Set(session.asked.map(a => a.chapter))
    const usedItems = new Set(session.asked.map(a => a.item))
    let best = null, bestGap = Infinity
    for (const entry of session.pool) {
        if (usedItems.has(entry.item)) continue
        // Allow a chapter to repeat only once every chapter has been used.
        const chapterPenalty = usedChapters.has(entry.chapter) && usedChapters.size < MAX_CHAPTER ? 10000 : 0
        const gap = Math.abs(entry.difficulty - session.theta) + chapterPenalty
        if (gap < bestGap) { best = entry; bestGap = gap }
    }
    return best
}

/** MAP ability estimate for a set of answers: grid search over the rating
 *  range, Elo response model, normal prior centred on the self-report. */
export function estimateAbility(asked, priorMean) {
    let best = priorMean, bestLL = -Infinity
    for (let theta = THETA_MIN; theta <= THETA_MAX; theta += 5) {
        let ll = -((theta - priorMean) ** 2) / (2 * PRIOR_SD ** 2)
        for (const a of asked) {
            const p = expectedScore(theta, a.difficulty)
            ll += Math.log(a.correct ? p : 1 - p)
        }
        if (ll > bestLL) { bestLL = ll; best = theta }
    }
    return best
}

export function answerPlacement(session, entry, correct) {
    const asked = [...session.asked, { item: entry.item, chapter: entry.chapter, difficulty: entry.difficulty, correct: !!correct }]
    return { ...session, asked, theta: estimateAbility(asked, EXPERIENCE_START[session.experience]) }
}

/** Done after PLACEMENT_LENGTH answers, or early when the first three are all
 *  wrong — that learner belongs at the start and more questions only hurt. */
export function isPlacementDone(session) {
    const n = session.asked.length
    if (n >= PLACEMENT_LENGTH) return true
    if (n >= 3 && session.asked.slice(0, 3).every(a => !a.correct)) return true
    return !nextPlacementItem(session)
}

/** Highest chapter whose typical question the learner passes, +1 = where to start. */
export function startChapterFor(theta) {
    let passed = 0
    for (let ch = 1; ch <= MAX_CHAPTER; ch++) {
        if (expectedScore(theta, chapterBaseRating(ch)) >= PASS_PROBABILITY) passed = ch
        else break
    }
    return Math.min(MAX_CHAPTER, passed + 1)
}

export function placementResult(session) {
    const correct = session.asked.filter(a => a.correct).length
    // No correct answer is no evidence of anything passed, whatever the
    // self-report said: start at the beginning, rated no higher than chapter 1.
    const theta = Math.round(correct === 0 ? Math.min(session.theta, chapterBaseRating(1)) : session.theta)
    const startChapter = correct === 0 ? 1 : startChapterFor(theta)
    return {
        theta, startChapter,
        passedChapters: startChapter - 1,
        correct,
        answered: session.asked.length,
        experience: session.experience,
    }
}

/** Apply a result: unlock passed chapters, activate the start, seed ratings. */
export function applyPlacement(result, lang) {
    const { startChapter, theta } = result
    if (startChapter > 1) {
        for (const node of journeyNodes) {
            if (node.chapter < startChapter && (node.status === 'locked' || node.status === 'active')) node.status = 'available'
        }
        const alreadyAhead = journeyNodes.some(n => n.chapter >= startChapter && (n.status === 'active' || n.status === 'completed'))
        const first = journeyNodes.find(n => n.chapter === startChapter)
        if (first && !alreadyAhead && first.status === 'locked') first.status = 'active'
        saveProgress()
    }
    seedAbility(theta)
    logEvent('placement_completed', {
        lang, experience: result.experience, theta, start_chapter: startChapter,
        answered: result.answered, correct: result.correct,
    })
}

/** Is there anything placement could still unlock? (hides the entry point) */
export function canStillPlaceForward() {
    return journeyNodes.some(n => n.chapter > 1 && n.status === 'locked')
}
