# Rheo backend — live duels (Firebase)

Realtime Database + callable Cloud Functions + anonymous Auth. The logic is in
`functions/src/duel.js`; how it works is described at the top of that file.

```
app (web/src/online/duelClient.js)
  ├─ signInAnonymously ─────────────► Firebase Auth
  ├─ duelJoinQueue / duelSubmitAnswer / duelTick / duelResign ─► Cloud Functions (europe-west1)
  │                                                     └─► RTDB: queue/, matchesPrivate/ (server only)
  ├─ listens users/{uid}, matches/{id} ◄──────────────── RTDB public projection
  └─ writes matches/{id}/presence/{uid} (+ onDisconnect)
```

## One-time setup (≈ 20 minutes)

1. **Create the project.** Go to [console.firebase.google.com](https://console.firebase.google.com), choose *Add project* and give it a name (for example `rheo-app`). Google Analytics is optional.
2. **Switch to the Blaze plan.** Cloud Functions require it. Then set a budget alert in Google Cloud Billing (for example $5). At current scale everything fits in the free quota: 2M function calls a month, and 1 GB stored / 10 GB downloaded for RTDB.
3. **Authentication:** *Build → Authentication → Get started → Sign-in method → Anonymous → Enable.*
4. **Realtime Database:** *Build → Realtime Database → Create database*, location **europe-west1 (Belgium)**, start in **locked mode**. The rules below replace the defaults at deploy time.
5. **Web app config:** *Project settings → Your apps → Add app → Web*. Copy the config into `web/.env.local` (template in `web/.env.example`):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=rheo-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=rheo-app
   VITE_FIREBASE_DATABASE_URL=https://rheo-app-default-rtdb.europe-west1.firebasedatabase.app
   VITE_FIREBASE_APP_ID=...
   ```
   These values are public identifiers, not secrets: they ship inside every web or mobile app. Access is enforced by the rules and the Functions. `.env.local` is still gitignored, so each environment keeps its own.
6. **Native apps (moving off `rheo-mvp-2026`):** register the iOS app (`com.rheo.codejourney`) and the Android app in the new project. Download the new `GoogleService-Info.plist` and `google-services.json` and replace the files in `rheo_app/`. Analytics and Crashlytics then move to the new project too.
7. **Deploy:**
   ```sh
   npm install -g firebase-tools
   firebase login
   cd firebase
   firebase use --add            # pick the new project, alias "default"
   cd functions && npm ci && npm test && cd ..
   firebase deploy --only database,functions
   ```
8. **Ship it in the app:**
   ```sh
   cd ..            # repo root
   node build_and_sync.js
   ```
   Then build the Flutter app as usual. **Find Match** now looks for a live opponent; every other mode stays a practice bot.

## Try it before deploying

```sh
cd web && npm run dev
# open http://localhost:5173/?duelMock=1
```
`?duelMock=1` runs the real server logic in the page, with a scripted rival.

## Behaviour

| | |
|---|---|
| Matchmaking | Per language, by ELO. The gap starts at 100 and widens by 25 per second of waiting (cap 600). The queue heartbeats every 4 s, and entries not seen for 15 s are ignored. After 25 s the app offers a practice bot. |
| Rounds | 3 questions, a 3 s countdown, then 20 s each, plus 1.5 s grace for latency. Each round is revealed for 2.5 s. |
| Fair play | Correct answers never leave the server until a round closes. The server's clock decides the time. Only Functions write game state. |
| Disconnects | Offline for 8 s, or never connected, counts as a forfeit. Leaving resigns. |
| Rating | K = 32, the same as the app. A draw counts 0.5. Equal scores are decided by the total time of correct answers. Rating, stats and history are written once per match under `users/{uid}`. |

## Before a public launch

- **Rules test.** `database.rules.json` could not be run in an emulator where this was written. Before launch, run `firebase emulators:start --only database,functions` and try the app against it with `?duelMock=0`. Check that a third account cannot read another pair's match.
- **App Check** (DeviceCheck/App Attest on iOS, Play Integrity on Android) keeps scripts off the callable Functions. Set `enforceAppCheck: true` in `functions/index.js` once the apps send tokens.
- **Account linking.** Anonymous players lose their rating if they reinstall the app. Linking an Apple or Google account (`linkWithCredential`) keeps the same uid. That step is not built yet.
- **Questions.** After editing `web/src/data/questions_*.js`, run `cd functions && npm run sync-questions` and redeploy.
