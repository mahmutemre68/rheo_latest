// A small code-reading sample, not a validated level/placement assessment.
const samples = {
    python: ['x = 2\nx = x + 3\nprint(x)', 'x = 3\nif x > 5:\n    print("A")\nelse:\n    print("B")', 'total = 0\nfor n in [1, 2, 3]:\n    total += n\nprint(total)'],
    javascript: ['let x = 2;\nx = x + 3;\nconsole.log(x);', 'const x = 3;\nif (x > 5) {\n  console.log("A");\n} else {\n  console.log("B");\n}', 'let total = 0;\nfor (const n of [1, 2, 3]) {\n  total += n;\n}\nconsole.log(total);'],
    java: ['int x = 2;\nx = x + 3;\nSystem.out.println(x);', 'int x = 3;\nif (x > 5) {\n    System.out.println("A");\n} else {\n    System.out.println("B");\n}', 'int total = 0;\nfor (int n : new int[]{1, 2, 3}) {\n    total += n;\n}\nSystem.out.println(total);'],
}
export function getPlacementQuestions(language) {
    if (!samples[language]) throw new Error('Unsupported placement language')
    return [
        { topic: 'variables', code: samples[language][0], options: ['2', '5', '3'], correct: 1, explanation: 'x starts at 2. Adding 3 leaves x at 5.' },
        { topic: 'conditionals', code: samples[language][1], options: ['A', 'B', 'A and B'], correct: 1, explanation: '3 is not greater than 5, so only the else branch runs.' },
        { topic: 'loops', code: samples[language][2], options: ['3', '123', '6'], correct: 2, explanation: 'The loop adds 1, then 2, then 3: the total is 6.' },
    ]
}
export function summarizePlacement(questions, answers) {
    const correctCount = questions.filter((q, i) => Number.isInteger(answers[i]) && answers[i] === q.correct).length
    const answeredCount = questions.filter((q, i) => Number.isInteger(answers[i]) && answers[i] >= 0 && answers[i] < q.options.length).length
    const firstGap = questions.find((q, i) => answers[i] !== q.correct)
    return { correctCount, answeredCount, total: questions.length, topic: firstGap?.topic || 'mixed' }
}
export const placementSuggestion = {
    variables: 'Trace how a variable changes, one line at a time.',
    conditionals: 'Practise which branch runs and why.',
    loops: 'Track the total after each loop iteration.',
    mixed: 'Try a longer trace with more than one concept.',
}
