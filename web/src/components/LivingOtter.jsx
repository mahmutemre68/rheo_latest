import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL || '/'

/* ══════════════════════════════════════════════
   LIVING OTTER — the one Rheo mascot
   Every otter in the app is this component, drawn from the official poses
   (public/mascot/*.webp, background-free cut-outs of the official artwork).
   A mood picks the pose; motion adds life. The character is never redrawn.
   ══════════════════════════════════════════════ */
const POSE_FOR_MOOD = {
    idle: 'happy', happy: 'happy', cool: 'happy', proud: 'happy', rich: 'happy', king: 'happy', sparkle: 'happy', fast: 'happy',
    greeting: 'greeting', welcome: 'greeting', hello: 'greeting',
    celebrate: 'celebrating', celebrating: 'celebrating', excited: 'celebrating', champion: 'celebrating', hero: 'celebrating', victory: 'celebrating',
    encourage: 'encouraging', encouraging: 'encouraging', determined: 'encouraging', warrior: 'encouraging',
    thinking: 'thinking', sleepy: 'thinking', scholar: 'thinking', detective: 'thinking',
    sad: 'sad', defeat: 'sad',
}
export const MASCOT_POSES = ['happy', 'greeting', 'celebrating', 'encouraging', 'thinking', 'sad']
export const poseForMood = mood => POSE_FOR_MOOD[mood] || 'happy'
export const mascotSrc = mood => `${BASE}mascot/${poseForMood(mood)}.webp`

// Costume emoji sit on the pose, as fractions of the image box.
const COSTUME_SPOT = {
    hat: { top: '-6%', left: '44%', size: 0.34 },
    face: { top: '22%', left: '45%', size: 0.26 },
    body: { top: '58%', left: '44%', size: 0.30 },
}

/**
 * mood      — picks the pose (see POSE_FOR_MOOD); unknown moods fall back to happy
 * size      — px
 * bubble    — optional speech bubble text
 * equipped  — costume items ({ slot, emoji }) drawn on top of the pose
 * animate   — idle float (default true; always off with reduced motion)
 */
export default function LivingOtter({ mood = 'idle', size = 64, bubble = null, equipped = [], animate = true, className = '', alt = 'Rheo' }) {
    const reducedMotion = useReducedMotion()
    const pose = poseForMood(mood)
    const lively = animate && !reducedMotion
    const motionProps = !lively ? {} : pose === 'celebrating'
        ? { animate: { y: [0, -6, 0], rotate: [0, -2, 2, 0] }, transition: { duration: 0.9, repeat: Infinity, repeatDelay: 0.6 } }
        : pose === 'sad'
            ? { animate: { y: [0, 1, 0] }, transition: { duration: 3, repeat: Infinity } }
            : { animate: { y: [0, -3, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }
    return (
        <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
            {bubble && (
                <div className="absolute left-1/2 -translate-x-1/2 z-10 pointer-events-none" style={{ bottom: '96%' }}>
                    <div className="bg-white rounded-xl px-2.5 py-1 whitespace-nowrap relative shadow-md">
                        <span className="text-[11px] font-extrabold text-slate-800">{bubble}</span>
                        <div className="absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                    </div>
                </div>
            )}
            <motion.img src={mascotSrc(mood)} alt={alt} draggable={false} {...motionProps}
                className="w-full h-full object-contain select-none" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }} />
            {equipped.map(item => {
                const spot = COSTUME_SPOT[item.slot]
                if (!spot) return null
                return <span key={item.id || item.slot} aria-hidden="true" className="absolute -translate-x-1/2 pointer-events-none leading-none"
                    style={{ top: spot.top, left: spot.left, fontSize: size * spot.size }}>{item.emoji}</span>
            })}
        </div>
    )
}

/* ══════════════════════════════════════════════
   CODE RAIN — Matrix-style falling characters
   ══════════════════════════════════════════════ */
export function CodeRain({ color = '#06b6d4', speed = 1, density = 30, opacity = 0.15 }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        resize()

        const chars = 'const let var if else for while return function class import export async await => {} [] () 01 def print range True False None self'.split(' ')
        const fontSize = 11
        const columns = Math.floor(canvas.offsetWidth / fontSize)
        const drops = new Array(Math.min(columns, density)).fill(0).map(() => Math.random() * -100)

        let raf
        const draw = () => {
            ctx.fillStyle = `rgba(15, 23, 42, ${0.15 / speed})`
            ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
            ctx.font = `${fontSize}px "Courier New", monospace`

            drops.forEach((y, i) => {
                const x = (i / drops.length) * canvas.offsetWidth
                const char = chars[Math.floor(Math.random() * chars.length)]
                const charOpacity = Math.max(0.1, 1 - (y / canvas.offsetHeight))
                ctx.fillStyle = color + Math.round(charOpacity * opacity * 255).toString(16).padStart(2, '0')
                ctx.fillText(char, x, y)
                drops[i] = y > canvas.offsetHeight ? Math.random() * -50 : y + fontSize * 0.7 * speed
            })
            raf = requestAnimationFrame(draw)
        }
        draw()

        window.addEventListener('resize', resize)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', resize)
        }
    }, [color, speed, density, opacity])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} />
}

/* ══════════════════════════════════════════════
   SPLASH SCREEN — Code Rain + Mascot
   ══════════════════════════════════════════════ */
export function SplashScreen({ onFinish, duration = 2500 }) {
    const [phase, setPhase] = useState('loading')

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('reveal'), duration * 0.7)
        const t2 = setTimeout(() => { setPhase('done'); onFinish() }, duration)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [duration, onFinish])

    if (phase === 'done') return null

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: phase === 'reveal' ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: '#080E1A' }}>

            <CodeRain color="#06b6d4" speed={1.2} density={35} opacity={0.25} />

            <div className="relative z-10 flex flex-col items-center gap-4">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                    <LivingOtter mood="happy" size={120} showGlow={true} showTablet={true} showSparkles={true} />
                </motion.div>

                {/* RHEO title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-black tracking-wider"
                    style={{ color: '#06b6d4', textShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
                    RHEO
                </motion.h1>

                {/* Loading bar */}
                <motion.div className="w-32 h-1 rounded-full bg-slate-800 overflow-hidden mt-2">
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: duration / 1000 * 0.65, ease: 'easeInOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #06b6d4, #14b8a6)' }} />
                </motion.div>
            </div>
        </motion.div>
    )
}
