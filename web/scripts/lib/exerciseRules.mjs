import { normalizeExercise } from '../../src/data/normalizeExercise.js'
/* Answerability rules for one exercise, shared by validate-pool.mjs and the
   offline question generator (tools/question-gen). Each type has its own
   schema; the checks ask "can this be answered", not "does it render":
   correct option in range, fill-in answer present in the bank, etc.
   Returns a list of problems (Turkish, as the pool report is); empty = ok.
   `at` is a prefix such as "python node 3 #2 (trace): ". */

export const KNOWN_TYPES = ['trace', 'output', 'errordecode', 'realworld', 'refactor', 'algostep', 'complexity',
    'bug', 'pair', 'fillgap', 'scramble', 'terminal', 'concept']

export function exerciseProblems(rawExercise, at = '') {
    const ex = normalizeExercise(rawExercise)
    const problems = []

    const needsExplanation = ex.type !== 'concept' && ex.type !== 'terminal'
    if (needsExplanation && !ex.explanation) problems.push(`${at}açıklama yok`)

    switch (ex.type) {
        case 'trace':
        case 'output':
        case 'errordecode':
        case 'realworld':
        case 'refactor':
        case 'algostep':
        case 'complexity': {
            const opts = ex.options
            if (!Array.isArray(opts) || opts.length < 2) { problems.push(`${at}en az 2 şık gerekli`); break }
            if (typeof ex.correct !== 'number' || ex.correct < 0 || ex.correct >= opts.length)
                problems.push(`${at}correct=${ex.correct} şık aralığı dışında (0..${opts.length - 1})`)
            if (ex.type === 'complexity' && opts.some(o => !o || typeof o.code !== 'string' || !o.code.trim() || typeof o.label !== 'string' || !o.label.trim()))
                problems.push(`${at}seçenek kodu veya etiketi eksik`)
            const labels = opts.map(o => (typeof o === 'string' ? o : o.label ?? o.code))
            if (new Set(labels).size !== labels.length) problems.push(`${at}aynı şık iki kez var`)
            break
        }
        case 'bug': {
            if (!Array.isArray(ex.code)) { problems.push(`${at}code satırları yok`); break }
            if (typeof ex.correctLine !== 'number' || ex.correctLine < 0 || ex.correctLine >= ex.code.length)
                problems.push(`${at}correctLine=${ex.correctLine} kod aralığı dışında (0..${ex.code.length - 1})`)
            const flagged = ex.code.map((l, idx) => (l.hasError ? idx : -1)).filter(idx => idx >= 0)
            if (flagged.length !== 1) problems.push(`${at}hasError işaretli satır sayısı ${flagged.length}, 1 olmalı`)
            else if (flagged[0] !== ex.correctLine) problems.push(`${at}hasError satırı ${flagged[0]} ama correctLine ${ex.correctLine}`)
            break
        }
        case 'pair': {
            if (!Array.isArray(ex.pairs) || ex.pairs.length < 2) { problems.push(`${at}en az 2 eşleşme gerekli`); break }
            const lefts = ex.pairs.map(p => p.left), rights = ex.pairs.map(p => p.right)
            if (new Set(lefts).size !== lefts.length) problems.push(`${at}sol tarafta tekrar var`)
            if (new Set(rights).size !== rights.length) problems.push(`${at}sağ tarafta tekrar var`)
            break
        }
        case 'fillgap': {
            const gaps = (ex.codeParts || []).filter(p => p.type === 'gap')
            if (!gaps.length) { problems.push(`${at}gap tanımlı değil`); break }
            for (const g of gaps) {
                const answer = ex.correctFill?.[g.id]
                if (answer == null) { problems.push(`${at}${g.id} için correctFill yok`); continue }
                if (!ex.bank?.includes(answer)) problems.push(`${at}doğru cevap "${answer}" bankada yok`)
                if (g.text !== answer) problems.push(`${at}gap metni doğru cevapla uyuşmuyor`)
            }
            if (ex.bank && new Set(ex.bank).size !== ex.bank.length) problems.push(`${at}bankada tekrar var`)
            break
        }
        case 'scramble': {
            const ids = (ex.pieces || []).map(p => p.id)
            if (!ex.correctOrder?.length) { problems.push(`${at}correctOrder yok`); break }
            for (const id of ex.correctOrder) if (!ids.includes(id)) problems.push(`${at}correctOrder'daki "${id}" parça listesinde yok`)
            if (ex.correctOrder.length !== ids.length) problems.push(`${at}${ids.length} parça var, correctOrder ${ex.correctOrder.length}`)
            const distractorIds = (ex.distractors || []).map(d => d.id)
            for (const id of distractorIds) if (ids.includes(id)) problems.push(`${at}çeldirici id "${id}" parçalarla çakışıyor`)
            break
        }
        case 'terminal': {
            if (!ex.expectedCommands?.length) problems.push(`${at}expectedCommands yok`)
            break
        }
        case 'concept': {
            if (typeof ex.chapter !== 'number') problems.push(`${at}chapter alanı yok`)
            break
        }
        default:
            problems.push(`${at}bilinmeyen tip`)
    }
    return problems
}
