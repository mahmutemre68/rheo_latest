/* ═══════════════════════════════════════════
   SOUND EFFECTS — Web Audio API
   Tiny synthesized sounds, no external files
   ═══════════════════════════════════════════ */

let audioCtx = null
let muted = false

// Sync with settings on load
try { muted = localStorage.getItem('rheo_setting_sound') === 'false' } catch (e) { }

function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    return audioCtx
}

export function toggleMute() {
    muted = !muted
    try { localStorage.setItem('rheo_setting_sound', muted ? 'false' : 'true') } catch (e) { }
    return muted
}
export function isMuted() { return muted }

function play(fn) {
    if (muted) return
    try { fn(getCtx()) } catch (e) { }
}

/* ── Correct answer — cheerful ding ── */
export function playCorrect() {
    play(ctx => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain).connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, ctx.currentTime)
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.3)
    })
}

/* ── Wrong answer — soft buzz ── */
export function playWrong() {
    play(ctx => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain).connect(ctx.destination)
        osc.type = 'square'
        osc.frequency.setValueAtTime(200, ctx.currentTime)
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.25)
    })
}

/* ── Streak milestone — rising tone ── */
export function playStreak() {
    play(ctx => {
        const notes = [523, 659, 784, 1047]
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain).connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
            gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.1)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2)
            osc.start(ctx.currentTime + i * 0.1)
            osc.stop(ctx.currentTime + i * 0.1 + 0.2)
        })
    })
}

/* ── Speed bonus — quick ascending ── */
export function playSpeedBonus() {
    play(ctx => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain).connect(ctx.destination)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.12, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.25)
    })
}

/* ── Lesson complete — celebration fanfare ── */
export function playCelebration() {
    play(ctx => {
        const melody = [523, 659, 784, 1047, 784, 1047]
        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain).connect(ctx.destination)
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12)
            gain.gain.setValueAtTime(0.13, ctx.currentTime + i * 0.12)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
            osc.start(ctx.currentTime + i * 0.12)
            osc.stop(ctx.currentTime + i * 0.12 + 0.3)
        })
    })
}
