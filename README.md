# Rheo development source

Reconstructed on 2026-10-08 from the authorized UX v4 full web source and v5 source deltas.

## Run

```sh
cd web
npm ci
npm run build
node scripts/validate-pool.mjs
node scripts/test-exercise-schema.mjs
```

`web/` is the complete React web project. `flutter-assets/` is a staged Journey bundle; `flutter-patch/` contains integration changes, **not a complete Flutter application**. No store release is implied.

Placement and Debug Mission are local prototypes, not verified App Store features. The official mascot assets are preserved.

## Validation and remaining gates

The reconstructed source built successfully and the 1,108-question validator returned zero schema/content validation issues. Existing v5 browser evidence is in `qa/`; this import does not claim a new browser or physical-device run. Main JS remains approximately 1.46 MB.

Physical iOS/Android, Flutter analyze/test/build and production analytics remain unverified. Revenue is zero per CEO; downloads, activation and D1/D7 are unknown. Do not publish store updates before these gates are completed.

## 8 October follow-up fixes

Daily reward persistence now validates day/date fields and rejects duplicate same-turn claims. Corrupt saved days no longer index outside the reward table; valid same-day claims remain protected. `npm run test:daily` exercises malformed state, date boundaries, mounted double-click and same-day reopen.

The share target previously returned HTTP 404. Shares now use the official App Store ID link; `npm run test:share` checks native message, browser share and clipboard payloads. These are JavaScript checks, not real OS share-sheet tests.

**The checked-in `flutter-assets/` bundle and `qa/` v5 evidence predate these follow-up source fixes. Rebuild and replace the staged bundle before any native release.** Full Flutter source/SDK, physical device QA and a writable production hosting target remain unavailable. No live deploy or Store submission occurred.
