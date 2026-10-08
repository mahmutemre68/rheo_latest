/* ═══ Arena SVG Icon Library ═══
   Replaces all emojis with premium gradient SVG icons */

const BASE = import.meta.env.BASE_URL || '/'

export function ShieldIcon({ color = '#14b8a6', size = 24, tier }) {
    const colors = { bronze: ['#cd7f32','#a0522d'], silver: ['#c0c0c0','#808080'], gold: ['#ffd700','#daa520'], diamond: ['#b9f2ff','#4fc3f7'], hacker: ['#00ff41','#008f11'] }
    const [c1, c2] = colors[tier] || [color, color + '88']
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs><linearGradient id={`sh-${tier||'d'}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill={`url(#sh-${tier||'d'})`} opacity="0.9"/>
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
        </svg>
    )
}

export function SwordIcon({ size = 20, color = '#ef4444' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M6.92 5L5 7l6 6-3.5 3.5 1.42 1.42L12.42 14.42 14 16l2-2-6-6 4-4-2-2-5.08 3z" fill={color}/>
            <path d="M19 3l-6 6 2 2 6-6-2-2z" fill={color} opacity="0.7"/>
        </svg>
    )
}

export function BoltIcon({ size = 16, color = '#eab308' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h7l-2 8 10-12h-7l2-8z" fill={color}/>
        </svg>
    )
}

export function TrophyIcon({ size = 20, color = '#fbbf24' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs><linearGradient id="tr-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd700"/><stop offset="100%" stopColor="#b8860b"/></linearGradient></defs>
            <path d="M7 4V2h10v2h3v4c0 1.5-1 3-3 3h-1c-.5 2-2 3.5-4 4v3h3v2H9v-2h3v-3c-2-.5-3.5-2-4-4H7c-2 0-3-1.5-3-3V4h3z" fill="url(#tr-g)"/>
        </svg>
    )
}

export function FireIcon({ size = 16, color = '#f97316' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M12 23c-4.97 0-9-3.13-9-7 0-2.38 1.19-4.47 3-5.74 0 0 .5 2.74 3 4.74 0-5 4-8 4-8s-1 3 2 5c2.5 1.67 3 4 3 4 .6-.85 1-1.85 1-3C19 13 17 11 17 11s2 4-1 7c-1.5 1.5-4 2-4 2s3-1.5 3-4c0-1.5-1-3-3-4-1 1-2 2-2 3.5 0 1 .5 2 1.5 2.5" fill={color}/>
        </svg>
    )
}

export function ClockIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    )
}

export function ChartIcon({ size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 9l-5 5-2-2-4 4"/></svg>
    )
}

export function StarIcon({ size = 14, color = '#fbbf24', filled = true }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    )
}

export function DiceIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#dice-g)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <defs><linearGradient id="dice-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
            <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.9"/><circle cx="16" cy="8" r="1.5" fill="white" opacity="0.9"/>
            <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9"/>
            <circle cx="8" cy="16" r="1.5" fill="white" opacity="0.9"/><circle cx="16" cy="16" r="1.5" fill="white" opacity="0.9"/>
        </svg>
    )
}

export function CalendarIcon({ size = 16, day }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" fill="#0d9488" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
            <rect x="3" y="4" width="18" height="6" rx="2" fill="#14b8a6"/>
            <text x="12" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{day||'?'}</text>
        </svg>
    )
}

export function MedalIcon({ rank, size = 18 }) {
    const colors = { 1: ['#ffd700','#daa520'], 2: ['#c0c0c0','#808080'], 3: ['#cd7f32','#a0522d'] }
    const [c1, c2] = colors[rank] || ['#475569','#334155']
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <defs><linearGradient id={`md-${rank}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
            <circle cx="12" cy="14" r="7" fill={`url(#md-${rank})`} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{rank}</text>
            <path d="M8 2l2 5h-4l4 3-2 5" fill={c1} opacity="0.3"/>
            <path d="M16 2l-2 5h4l-4 3 2 5" fill={c1} opacity="0.3"/>
        </svg>
    )
}

export function UserAvatar({ name, size = 36, color = '#14b8a6', isUser = false }) {
    const initials = (name || '?').split(/[\s_]/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const bgColors = ['#dc2626','#ea580c','#ca8a04','#16a34a','#0891b2','#7c3aed','#be185d','#0d9488']
    const bg = isUser ? color : bgColors[name?.charCodeAt(0) % bgColors.length || 0]
    return (
        <svg width={size} height={size} viewBox="0 0 40 40">
            <defs>
                <linearGradient id={`av-${name?.slice(0,3)||'u'}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={bg}/>
                    <stop offset="100%" stopColor={bg + 'aa'}/>
                </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill={`url(#av-${name?.slice(0,3)||'u'})`}/>
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <text x="20" y="25" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="system-ui">{initials}</text>
        </svg>
    )
}

export function OtterMascot({ size = 48, tier, glow, bodyColor }) {
    const tierColor = tier?.color || '#14b8a6'
    const mainColor = bodyColor || '#14b8a6'
    const darkColor = bodyColor ? shadeColor(bodyColor, -30) : '#0d7d6b'
    const bellyColor = bodyColor ? shadeColor(bodyColor, 40) : '#5eead4'
    return (
        <svg width={size} height={size} viewBox="0 0 48 48">
            <defs>
                <radialGradient id={`ot-bg-${mainColor.slice(1)}`}><stop offset="0%" stopColor={tierColor} stopOpacity="0.3"/><stop offset="100%" stopColor={tierColor} stopOpacity="0.05"/></radialGradient>
                <linearGradient id={`ot-body-${mainColor.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={mainColor}/><stop offset="100%" stopColor={darkColor}/></linearGradient>
            </defs>
            {glow && <circle cx="24" cy="24" r="23" fill={`url(#ot-bg-${mainColor.slice(1)})`}/>}
            {/* Body */}
            <circle cx="24" cy="24" r="20" fill={`url(#ot-body-${mainColor.slice(1)})`} stroke={tierColor} strokeWidth="1.5" opacity="0.9"/>
            {/* Belly */}
            <ellipse cx="24" cy="28" rx="10" ry="8" fill={bellyColor} opacity="0.3"/>
            {/* Ears */}
            <circle cx="13" cy="10" r="4" fill={darkColor}/><circle cx="35" cy="10" r="4" fill={darkColor}/>
            <circle cx="13" cy="10" r="2.5" fill={bellyColor} opacity="0.4"/><circle cx="35" cy="10" r="2.5" fill={bellyColor} opacity="0.4"/>
            {/* Eyes */}
            <ellipse cx="18" cy="20" rx="3" ry="3.5" fill={darkColor}/>
            <ellipse cx="30" cy="20" rx="3" ry="3.5" fill={darkColor}/>
            <circle cx="19" cy="19" r="1.3" fill="white"/><circle cx="31" cy="19" r="1.3" fill="white"/>
            {/* Nose */}
            <ellipse cx="24" cy="24" rx="2.5" ry="1.5" fill={darkColor} opacity="0.7"/>
            {/* Whiskers */}
            <line x1="10" y1="23" x2="16" y2="24" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <line x1="10" y1="25" x2="16" y2="25" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <line x1="38" y1="23" x2="32" y2="24" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            <line x1="38" y1="25" x2="32" y2="25" stroke="white" strokeWidth="0.5" opacity="0.3"/>
            {/* Mouth */}
            <path d="M20 27 Q24 30 28 27" fill="none" stroke={darkColor} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            {/* Cheeks */}
            <circle cx="14" cy="26" r="2.5" fill="#FFB7B2" opacity="0.12"/>
            <circle cx="34" cy="26" r="2.5" fill="#FFB7B2" opacity="0.12"/>
        </svg>
    )
}
function shadeColor(c,p){let r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);r=Math.max(0,Math.min(255,r+p));g=Math.max(0,Math.min(255,g+p));b=Math.max(0,Math.min(255,b+p));return`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`}


/* ═══ BP Road Icons ═══ */
export function GemSVG({ size = 16, color = '#06b6d4' }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6 3h12l4 7-10 11L2 10l4-7z" fill={color} opacity="0.8"/>
        <path d="M2 10h20M12 21L6 3M12 21l6-18M6 3l6 7 6-7" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none"/>
    </svg>
}
export function XPStar({ size = 16, color = '#fbbf24' }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.5 5.5H20l-4.5 3.5 1.5 6L12 14l-5 3 1.5-6L4 7.5h5.5L12 2z" fill={color}/>
        <path d="M12 2l2.5 5.5H20l-4.5 3.5 1.5 6L12 14l-5 3 1.5-6L4 7.5h5.5L12 2z" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none"/>
    </svg>
}
export function CrownSVG({ size = 16, color = '#f59e0b' }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 16L3 5l5 4 4-6 4 6 5-4-2 11H5z" fill={color} opacity="0.9"/>
        <rect x="4" y="16" width="16" height="3" rx="1" fill={color}/>
        <path d="M5 16L3 5l5 4 4-6 4 6 5-4-2 11H5z" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none"/>
    </svg>
}

export function VSBadge({ size = 40 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40">
            <defs><linearGradient id="vs-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#dc2626"/></linearGradient></defs>
            <circle cx="20" cy="20" r="18" fill="url(#vs-g)" opacity="0.9"/>
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="system-ui">VS</text>
        </svg>
    )
}
