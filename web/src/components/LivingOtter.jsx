import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL || '/'

/** Official mascot asset. Legacy visual props remain accepted for callers;
 * they never replace, redraw, or add body parts to the supplied character. */
// Preserve the official mascot artwork; moods change motion, never its identity.
export default function LivingOtter({ mood = 'idle', size = 64, showGlow = true, showSparkles = false, showTablet = false, className = '' }) {
    const reducedMotion = useReducedMotion()
    const celebrating = mood === 'happy' || mood === 'celebrate'
    return <motion.img src={`${BASE}mascot_happy.png`} alt="Rheo" draggable={false}
        className={`shrink-0 object-contain rounded-xl ${className}`}
        style={{ width: size, height: size }}
        animate={reducedMotion ? { y: 0, scale: 1 } : celebrating ? { y: [0, -3, 0], scale: [1, 1.03, 1] } : { y: 0, scale: 1 }}
        transition={{ duration: 0.45 }} />
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
