# Rheo

Gamified code-reading app ("Duolingo for reading code"): a Flutter shell that
hosts the React Journey in a WebView, for Python, JavaScript and Java, in
English and Turkish.

This repo merges the full project from `Furkanahii/Rheo-MVP` (main @ b7ee3ad,
7 Aug 2026) with the newer `web/` source reconstructed here on 8 Oct 2026.

## Layout

| path | what |
| --- | --- |
| `web/` | React Journey (Vite, React 19, Tailwind 4, framer-motion) — the app's main UI |
| `rheo_app/` | Flutter shell (iOS/Android, Firebase, Hive, notifications); serves `assets/journey-web/` to a WebView over localhost |
| `tools/question-gen/` | offline AI question generation: generate → machine gates → human review → `web/src/generated/` ([README](tools/question-gen/README.md)) |
| `tools/verify_journey_bundle.py` | checks a web build and writes the stable `asset-manifest.json` the Flutter shell falls back to |
| `build_and_sync.js` | build `web/` and replace `rheo_app/assets/journey-web/` |
| `backend/` | legacy template-based question generator from the MVP (old schema; not used by the app) |
| `rheo-dashboard*/`, `rheo-pitchdeck/`, `AppStore_Upload/`, `appstore_assets/`, `presentation_screenshots/`, `docs/` | MVP project material |
| `qa/` | v5 browser evidence (predates the October changes) |

## Run

```sh
cd web
npm ci
npm run dev          # browser
npm test             # pool validator, schema, generated-bank merge, mounted cards, daily reward, share
cd ..
node build_and_sync.js            # rebuild the bundle the Flutter app ships
cd rheo_app && flutter pub get && flutter analyze && flutter test
```

## Notes

- Journey banks are code-split per language: only the active language's
  exercises load (main JS ~200 KB, was 1.46 MB).
- AI questions are generated offline and only reach the app after review. No
  API key is in the app; the old client-side Gemini service was removed.
- Each answer sends `exercise_answered` to Firebase Analytics via the native
  bridge, which is how AI items are calibrated and retired.
- Placement and Debug Mission are local prototypes, not verified store features.
  The official mascot assets are preserved.

## Not verified

Flutter `pub get` / `analyze` / `test` / `build` could not run where this merge
was made (no Flutter SDK or pub.dev access), so run them before any release —
`pubspec.lock` still lists the removed `flutter_dotenv` and `http` until
`flutter pub get` rewrites it. Physical iOS/Android QA, the Firebase Analytics
pipeline end to end, and store builds are also unverified. Do not publish store
updates before these are done.

History of the October reconstruction: [IMPORT-STATUS.md](IMPORT-STATUS.md).
