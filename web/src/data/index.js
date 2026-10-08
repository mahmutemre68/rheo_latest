/* ══════════════════════════════════════════
   Rheo — Barrel Re-export Index
   All imports from '../data' resolve here
   ══════════════════════════════════════════ */

// Layer 1: Utilities
export { loadSaved, saveTo, STORAGE_KEY, STATS_KEY, ONBOARDING_KEY } from './storage.js'

// Layer 2: Internationalization
export { getLocale, setLocale, t } from './i18n.js'

// Layer 3: Core (journey, profile, quests, league — everything else)
export * from './core.js'

// Layer 4: Adaptive difficulty (item + learner ratings, lesson selection)
export * from './adaptive.js'
