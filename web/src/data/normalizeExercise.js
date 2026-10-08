// Legacy complexity cards use A/B fields; LessonScreen expects indexed options.
// Do not mutate authored banks or silently repair malformed answer keys.
export function normalizeExercise(ex) {
    if (ex.type !== 'complexity' || Array.isArray(ex.options)) return ex
    if (!ex.optionA || !ex.optionB) return ex
    return {
        ...ex,
        options: [
            { ...ex.optionA, complexity: ex.complexityA },
            { ...ex.optionB, complexity: ex.complexityB },
        ],
        correct: ex.correct === 'A' ? 0 : ex.correct === 'B' ? 1 : ex.correct,
    }
}
