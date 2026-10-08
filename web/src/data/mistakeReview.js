// Snapshot answers at submission time: React selection state may not yet update.
const textOf = value => {
    if (value == null) return ''
    if (typeof value === 'object') return String(value.code ?? value.label ?? value.text ?? JSON.stringify(value))
    return String(value)
}
const linesOf = value => Array.isArray(value) ? value.map(textOf).join('\n') : textOf(value)

export function createMistakeReview(ex, answer = {}) {
    const pieces = [...(ex.pieces || []), ...(ex.distractors || [])]
    const ordered = ids => (ids || []).map(id => textOf(pieces.find(p => p.id === id))).join('\n')
    const line = idx => Number.isInteger(idx) ? `${idx + 1}: ${textOf(ex.code?.[idx])}` : ''
    const fills = values => (ex.codeParts || []).map(p => p.type === 'gap' ? textOf(values?.[p.id] ?? '___') : p.text).join('')
    let correctAnswer = answer.expectedAnswer
    let selectedAnswer = answer.selectedAnswer
    if (ex.type === 'bug') {
        correctAnswer ??= line(ex.correctLine)
        selectedAnswer ??= line(answer.selectedIndex)
    } else if (ex.type === 'scramble') {
        correctAnswer ??= ordered(ex.correctOrder)
        selectedAnswer ??= ordered(answer.placedIds)
    } else if (ex.type === 'fillgap') {
        correctAnswer ??= fills(ex.correctFill)
        selectedAnswer ??= fills(answer.fills)
    } else if (ex.type === 'pair') {
        correctAnswer ??= ex.pairs.map(p => `${p.left} → ${p.right}`).join('\n')
    } else if (ex.type === 'terminal') {
        correctAnswer ??= (ex.expectedCommands || []).join('\n')
    } else {
        correctAnswer ??= ex.options?.[ex.correct] ?? ex.correct
        selectedAnswer ??= ex.options?.[answer.selectedIndex]
    }
    return {
        // Keep a detached, complete exercise so retry uses the same code and
        // option order, without carrying the previous selection or feedback.
        exercise: JSON.parse(JSON.stringify(ex)),
        nodeId: ex._nodeId, exerciseIndex: ex._exerciseIndex, type: ex.type,
        prompt: ex.prompt ?? ex.question ?? ex.text ?? '',
        code: linesOf(ex.originalCode ?? ex.code ?? (ex.codeParts ? fills({}) : ex.pieces ?? '')),
        context: [ex.scenario, ex.errorText, ex.array ? JSON.stringify(ex.array) : null].filter(Boolean).join('\n'),
        selectedAnswer: selectedAnswer === '' ? '""' : textOf(selectedAnswer),
        correctAnswer: correctAnswer === '' ? '""' : textOf(correctAnswer),
        explanation: ex.explanation ?? '',
    }
}

export function buildMistakeRetry(wrongQuestions = []) {
    const seen = new Set()
    return wrongQuestions.flatMap(wq => {
        const ex = wq.exercise
        if (!ex || ex.type === 'concept' || ex.type === 'video') return []
        const key = JSON.stringify(ex)
        if (seen.has(key)) return []
        seen.add(key)
        return [JSON.parse(key)]
    })
}

export function mistakeGuideKey(type) {
    if (type === 'bug' || type === 'errordecode') return 'Compare the error with the code, one line at a time.'
    if (type === 'scramble' || type === 'fillgap') return 'Compare your code with the solution and follow the order.'
    return 'Compare your answer with the solution, then trace the code again.'
}
