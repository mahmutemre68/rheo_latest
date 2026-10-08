import { createContext, useContext, useState, useCallback } from 'react'
import { showXP } from './XPToast'

/* ══════════════════════════════════════════
   AppContext — replaces window.__ globals
   ══════════════════════════════════════════ */
const AppContext = createContext(null)

export function AppProvider({ children }) {
    const [lessonNodeId, setLessonNodeId] = useState(null)
    const [, setTick] = useState(0)

    const openLesson = useCallback((nodeId) => setLessonNodeId(nodeId || 1), [])
    const closeLesson = useCallback(() => setLessonNodeId(null), [])
    const refreshApp = useCallback(() => setTick(n => n + 1), [])

    return (
        <AppContext.Provider value={{ lessonNodeId, openLesson, closeLesson, refreshApp, showXP }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be inside AppProvider')
    return ctx
}
