/* ══════════════════════════════════════════
   Rheo — Storage Utilities
   ══════════════════════════════════════════ */

export const STORAGE_KEY = 'rheo_progress'
export const STATS_KEY = 'rheo_stats'
export const ONBOARDING_KEY = 'rheo_onboarding_done'

export function loadSaved(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch (e) { return fallback }
}

export function saveTo(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)) } catch (e) { }
}
