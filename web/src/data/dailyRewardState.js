// Persisted daily reward state is untrusted. Repair the calendar without
// changing progression, and preserve a valid same-day claim to avoid duplicates.
export function normalizeDailyRewardState(saved, now = new Date()) {
    const fresh = { currentDay: 1, lastClaimDate: null, claimedToday: false }
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return fresh
    const day = Number.isInteger(saved.currentDay) && saved.currentDay >= 1 && saved.currentDay <= 7
        ? saved.currentDay : 1
    const date = typeof saved.lastClaimDate === 'string' ? new Date(saved.lastClaimDate) : null
    if (!date || !Number.isFinite(date.getTime()) || date.toDateString() !== saved.lastClaimDate) return fresh
    const calendarDay = d => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    const gap = (calendarDay(now) - calendarDay(date)) / 86400000
    if (gap > 1) return fresh
    // Clock rollback must not permit another reward for a previously claimed day.
    return { currentDay: day, lastClaimDate: saved.lastClaimDate, claimedToday: gap <= 0 }
}
