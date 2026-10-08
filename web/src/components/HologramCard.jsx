import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/* ══════════════════════════════════════════════
   HOLOGRAM CARD — 3D Tilt + Rainbow Shimmer
   Pokémon/FIFA rare card style
   ══════════════════════════════════════════════ */

// Inject hologram CSS once
const HOLO_CSS = `
@keyframes holo-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes holo-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
.holo-glare {
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255,255,255,0.03) 30%,
    rgba(255,255,255,0.12) 38%,
    rgba(255,255,255,0.03) 46%,
    transparent 56%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: holo-shimmer 4s ease-in-out infinite;
}
.holo-rainbow {
  background: linear-gradient(
    120deg,
    rgba(255,0,0,0.06) 0%,
    rgba(255,154,0,0.06) 12%,
    rgba(208,222,33,0.06) 24%,
    rgba(79,220,74,0.06) 36%,
    rgba(63,218,216,0.06) 48%,
    rgba(47,201,226,0.06) 60%,
    rgba(28,127,238,0.06) 72%,
    rgba(95,21,242,0.06) 84%,
    rgba(186,12,248,0.06) 100%
  );
  background-size: 300% 300%;
  animation: holo-shimmer 6s ease infinite;
}
`

if (typeof document !== 'undefined' && !document.getElementById('holo-styles')) {
    const style = document.createElement('style')
    style.id = 'holo-styles'
    style.textContent = HOLO_CSS
    document.head.appendChild(style)
}

/**
 * HologramCard — 3D tilt + rainbow shimmer achievement card
 * @param {boolean} unlocked - if false, shows locked/grayscale state
 * @param {string} color - accent color
 * @param {ReactNode} children - card content
 * @param {string} className - extra CSS
 */
export default function HologramCard({ unlocked = false, color = '#14b8a6', children, className = '', onClick }) {
    const cardRef = useRef(null)
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMove = (e) => {
        if (!cardRef.current || !unlocked) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setTilt({
            x: (y - 0.5) * -15, // ±7.5 degrees
            y: (x - 0.5) * 15,
        })
    }

    const handleTouchMove = (e) => {
        if (!cardRef.current || !unlocked) return
        const touch = e.touches[0]
        const rect = cardRef.current.getBoundingClientRect()
        const x = (touch.clientX - rect.left) / rect.width
        const y = (touch.clientY - rect.top) / rect.height
        setTilt({
            x: (y - 0.5) * -10,
            y: (x - 0.5) * 10,
        })
    }

    const resetTilt = () => {
        setTilt({ x: 0, y: 0 })
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={resetTilt}
            onTouchMove={handleTouchMove}
            onTouchEnd={resetTilt}
            className={`relative overflow-hidden cursor-pointer ${className}`}
            style={{
                perspective: 600,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateX: tilt.x,
                rotateY: tilt.y,
                scale: isHovered && unlocked ? 1.05 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileTap={unlocked ? { scale: 0.98 } : {}}>

            {/* Card body */}
            <div className={`relative rounded-2xl border-b-[3px] transition-all duration-300 ${unlocked
                    ? 'bg-slate-800/80 border-slate-950'
                    : 'bg-slate-900/40 border-slate-950 opacity-45'
                }`}
                style={unlocked ? {
                    border: `1px solid ${color}30`,
                    boxShadow: isHovered
                        ? `0 10px 30px ${color}20, 0 0 15px ${color}15, inset 0 1px 1px ${color}10`
                        : `0 4px 12px ${color}10, 0 0 1px ${color}20`,
                } : {}}>

                {/* Rainbow shimmer overlay — only on unlocked */}
                {unlocked && (
                    <>
                        <div className="absolute inset-0 rounded-2xl holo-rainbow pointer-events-none" />
                        <div className="absolute inset-0 rounded-2xl holo-glare pointer-events-none" />
                    </>
                )}

                {/* Holographic edge glow */}
                {unlocked && isHovered && (
                    <div className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                            background: `linear-gradient(${135 + tilt.y * 5}deg, ${color}15, transparent 40%, transparent 60%, ${color}15)`,
                        }} />
                )}

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>

                {/* Unlock checkmark */}
                {unlocked && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}>
                        <span className="text-[7px] font-black text-white">✓</span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
