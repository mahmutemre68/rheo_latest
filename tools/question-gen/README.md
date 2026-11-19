# Rheo question generation (offline)

AI writes candidate exercises → machine gates check them → a person approves →
only approved items ship. Nothing is generated on the device and no API key
ever goes into the app.

```
generate.mjs ──► candidates/<lang>-n<node>-<time>.json ──► review.mjs approve ──► web/src/generated/ai_<lang>.json ──► app
                 (status: pass / manual / fail)                               (appended after authored items, source: 'ai')
```

## Setup

```sh
cd tools/question-gen
npm install
export ANTHROPIC_API_KEY=...        # your key; never commit it
```

`python3`, `node` and a JDK (`java`) must be on PATH: the execution gate runs the code.

## Generate

```sh
node generate.mjs --lang python --node 9 --type trace --count 5
node generate.mjs --lang java --node 5 --type bug --count 3 --model claude-opus-5-5
node generate.mjs --lang javascript --node 17 --from-file batch.json   # gate items written elsewhere
```

Supported types: `trace`, `output`, `bug` (the most common types in the bank and
the ones whose answer can be proven by running code). Few-shot examples come
from the same node, then the same chapter. Default model: `claude-sonnet-5-5`
(override with `--model` or `RHEO_GEN_MODEL`).

## Gates

| gate | what it rejects |
| --- | --- |
| schema | anything `web/scripts/lib/exerciseRules.mjs` rejects (the same rules as `npm run validate`), plus: no hint / hint that contains the answer, thin explanation, not 4 options, code longer than 14 lines |
| execution — trace/output | `verify.program` (default: the shown code) must run, print **exactly** the correct option, and no distractor may equal that output; `terminalOutput` must match reality |
| execution — bug | with `verify.fix`, the fix must run (and print `verify.expected_stdout` if given) and the flagged line must change behaviour |
| duplicate | same code as an existing item in the node, or token similarity ≥ 0.75 |

`pass` = every gate green. `manual` = schema/duplicate fine but the answer key
could not be proven by running code (e.g. a bug item without `verify.fix`);
approving it needs `--checked-key`, i.e. you checked the answer yourself.
`fail` cannot be approved.

The runner is a dev/CI tool, not a security sandbox (temp dir, stripped env,
timeout). Don't run it on a machine with secrets you would not show the model.

## Review

```sh
node review.mjs                                # batches and what is waiting
node review.mjs show python-n9-....json        # see items as a learner would, with gate results
node review.mjs approve python-n9-....json 0 2 --by Maho
node review.mjs reject  python-n9-....json 1 --by Maho --reason "too close to #4"
```

Approval re-runs the gates against the current pool, strips `verify`, adds
`source: 'ai'`, `model`, `generatedAt`, `reviewedBy`, `reviewedAt`, and appends
to `web/src/generated/ai_<lang>.json`. Then from the repo root:

```sh
cd web && npm test && cd .. && node build_and_sync.js
```

## Rules for the generated banks

- **Never delete or reorder** items in `ai_<lang>.json`. Item ratings and the
  weak-exercise queue are keyed by position. To pull a bad item, set
  `"retired": true`; it keeps its slot and is no longer served.
- Difficulty needs no hand tuning: new items start from the chapter/type prior
  in `adaptive.js` and self-calibrate from answers (Elo).
- Every answer sends `exercise_answered` (lang, node_id, item_index, source,
  correct, prior, difficulty, ability) through the native bridge to Firebase
  Analytics. Aggregate p-correct per `source = ai` item there to find items to
  retire. On a single device, `getGeneratedItemCalibration()` shows the same.

## Tests

```sh
npm test    # gates: positive and negative fixtures in python, javascript and java
```
