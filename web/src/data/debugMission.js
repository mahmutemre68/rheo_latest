// Local, reward-free prototype. No arbitrary user code is executed.
export const debugMission = {
    inputs: [3, 4, 5], expected: ['B', 'A', 'A'], bugLine: 1,
    code: {
        python: ['score = 4', 'if score > 4:', '    print("A")', 'else:', '    print("B")'],
        javascript: ['const score = 4;', 'if (score > 4) {', '  console.log("A");', '} else {', '  console.log("B");', '}'],
    },
}
export function verifyDebugFix(operator) {
    const compare = { '>': n => n > 4, '>=': n => n >= 4, '==': n => n === 4 }[operator]
    if (!compare) return null
    const actual = debugMission.inputs.map(n => compare(n) ? 'A' : 'B')
    return { actual, passed: actual.every((v, i) => v === debugMission.expected[i]) }
}
