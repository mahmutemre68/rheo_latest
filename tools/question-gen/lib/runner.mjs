// Run a code snippet and capture stdout, for the execution gate.
//
// This is a dev-machine / CI tool, NOT a security sandbox: candidates come from
// a model, so it runs each program in a throwaway directory with a stripped
// environment, no stdin and a hard timeout. Do not point it at untrusted input
// on a machine holding secrets.
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

/** The snippet as shown to the learner. */
export function codeText(ex) {
    return Array.isArray(ex.code) ? ex.code.map(line => line.text).join('\n') : String(ex.code ?? '')
}

/** Java snippets are written as the body of main() (see PlacementCheck copy).
 *  Methods may be declared too; those lines move to class level. */
export function wrapJava(source) {
    if (/\bclass\s+Main\b/.test(source)) return source
    const lines = source.split('\n')
    const members = [], body = []
    let depth = 0, inMember = false
    for (const line of lines) {
        const startsMember = depth === 0 && /^(public|private|protected|static)\b.*\(.*\)\s*(throws\s+[\w.,\s]+)?\{\s*$/.test(line.trim())
        if (startsMember) inMember = true
        ;(inMember ? members : body).push(line)
        depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length
        if (inMember && depth === 0) inMember = false
    }
    const memberSrc = members.map(l => (/^(public|private|protected)\s/.test(l.trim()) && !/\bstatic\b/.test(l) ? l.replace(/(public|private|protected)\s/, '$1 static ') : l)).join('\n')
    return `import java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\n\npublic class Main {\n${memberSrc}\n    public static void main(String[] args) throws Exception {\n${body.join('\n')}\n    }\n}\n`
}

const COMMANDS = {
    python: { file: 'main.py', cmd: ['python3', ['-I', 'main.py']] },
    javascript: { file: 'main.js', cmd: ['node', ['main.js']] },
    java: { file: 'Main.java', cmd: ['java', ['-Xshare:auto', 'Main.java']] },
}

export function runProgram(lang, source, { timeoutMs = 10000 } = {}) {
    const spec = COMMANDS[lang]
    if (!spec) throw new Error(`no runner for ${lang}`)
    const dir = mkdtempSync(path.join(tmpdir(), 'rheo-gate-'))
    try {
        writeFileSync(path.join(dir, spec.file), lang === 'java' ? wrapJava(source) : source)
        const res = spawnSync(spec.cmd[0], spec.cmd[1], {
            cwd: dir,
            input: '',
            timeout: timeoutMs,
            encoding: 'utf8',
            env: { PATH: process.env.PATH, HOME: dir, LANG: 'C.UTF-8', PYTHONHASHSEED: '0', JAVA_TOOL_OPTIONS: '' },
            maxBuffer: 1 << 20,
        })
        return {
            ok: res.status === 0 && !res.error,
            status: res.status,
            timedOut: res.error?.code === 'ETIMEDOUT' || res.signal === 'SIGTERM',
            stdout: res.stdout ?? '',
            stderr: (res.stderr ?? '').replace(/^Picked up JAVA_TOOL_OPTIONS.*\n/m, ''),
        }
    } finally {
        rmSync(dir, { recursive: true, force: true })
    }
}

/** Compare printed output the way a learner reads it. */
export function normalizeOutput(s) {
    return String(s).replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n').trim()
}
