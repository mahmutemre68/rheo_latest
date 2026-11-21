// In-memory stand-in for the Realtime Database, with a controllable clock.
// Transactions are atomic like RTDB's. With nullFirst (default on), the first
// call of every transaction sees null even when data exists, as the Admin SDK
// does without a local cache, so handlers must cope with it.
export function memoryDb({ start = 1_700_000_000_000, nullFirst = true } = {}) {
    let root = {}
    let clock = start
    let ids = 0
    const parts = p => (p ? p.split('/').filter(Boolean) : [])
    const clone = v => (v === undefined ? undefined : structuredClone(v))
    function read(p) {
        let cur = root
        for (const k of parts(p)) { if (cur == null || typeof cur !== 'object') return null; cur = cur[k] }
        return cur === undefined ? null : clone(cur)
    }
    function write(p, v) {
        const ks = parts(p)
        if (!ks.length) { root = clean(clone(v)) ?? {}; return }
        let cur = root
        for (const k of ks.slice(0, -1)) { if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}; cur = cur[k] }
        const last = ks[ks.length - 1]
        const val = clean(clone(v))
        if (val == null) delete cur[last]; else cur[last] = val
    }
    // RTDB stores no nulls and no empty objects.
    function clean(v) {
        if (v === null || v === undefined) return null
        if (Array.isArray(v)) v = Object.fromEntries(v.map((x, i) => [i, x]))
        if (typeof v !== 'object') return v
        const out = {}
        for (const [k, x] of Object.entries(v)) { const c = clean(x); if (c != null) out[k] = c }
        return Object.keys(out).length ? out : null
    }
    // Arrays come back as arrays when keys are 0..n-1, like the RTDB SDKs.
    function arrays(v) {
        if (v == null || typeof v !== 'object') return v
        const keys = Object.keys(v)
        const out = Object.fromEntries(keys.map(k => [k, arrays(v[k])]))
        if (keys.length && keys.every((k, i) => String(i) === k)) return keys.map(k => out[k])
        return out
    }
    const db = {
        now: () => clock,
        advance: ms => { clock += ms },
        newId: () => `m${++ids}`,
        get: async p => arrays(read(p)),
        set: async (p, v) => write(p, v),
        update: async (p, obj) => { for (const [k, v] of Object.entries(obj)) write([p, k].filter(Boolean).join('/'), v) },
        transaction: async (p, fn) => {
            const actual = arrays(read(p))
            if (nullFirst && actual != null) {
                const guess = fn(null)
                if (guess === undefined) return { committed: false, value: actual } // aborted on a null view
                // the server would reject the guess and rerun with real data
            }
            const out = fn(clone(actual))
            if (out === undefined) return { committed: false, value: actual }
            write(p, out)
            return { committed: true, value: arrays(read(p)) }
        },
        dump: () => clone(root),
        // client-side presence write (what the web app does)
        presence: async (matchId, uid, online) => write(`matches/${matchId}/presence/${uid}`, { online, at: clock }),
    }
    return db
}
