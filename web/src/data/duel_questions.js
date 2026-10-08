/* ══════════════════════════════════════════════════════════════════
   DUEL QUESTION POOL — Index Module
   Imports per-language question files and exports unified pool
   Total: 240+ questions across 3 languages × 3 difficulty levels
   ══════════════════════════════════════════════════════════════════ */
import { pythonQuestions } from './questions_python.js'
import { javascriptQuestions } from './questions_javascript.js'
import { javaQuestions } from './questions_java.js'

export const duelQuestionPool = {
    python: pythonQuestions,
    javascript: javascriptQuestions,
    java: javaQuestions,
}
