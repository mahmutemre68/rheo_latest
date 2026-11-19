// Build the React Journey (web/) and copy it into the Flutter shell
// (rheo_app/assets/journey-web/). Run from the repo root:
//
//   node build_and_sync.js
//
// Steps: clean build → verify bundle → write the stable asset-manifest.json
// that JourneyWebViewScreen's Strategy 3 fallback reads → replace the staged
// Flutter assets. Never copy a stale dist/: hashed files from older builds
// would be picked up by the webview's asset discovery.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const webDir = path.join(rootDir, 'web');
const distDir = path.join(webDir, 'dist');
const appAssetsDir = path.join(rootDir, 'rheo_app', 'assets', 'journey-web');
const verifier = path.join(rootDir, 'tools', 'verify_journey_bundle.py');

function run(cmd, cwd) {
  execSync(cmd, { cwd, stdio: 'inherit' });
}

try {
  console.log('Cleaning web/dist …');
  fs.rmSync(distDir, { recursive: true, force: true });

  console.log('Building React Journey …');
  run('npm run build', webDir);

  console.log('Verifying bundle and writing asset-manifest.json …');
  run(
    `python3 "${verifier}" "${distDir}" --asset-manifest "${path.join(distDir, 'asset-manifest.json')}" > /dev/null`,
    rootDir,
  );

  console.log(`Replacing ${path.relative(rootDir, appAssetsDir)} …`);
  fs.rmSync(appAssetsDir, { recursive: true, force: true });
  fs.mkdirSync(appAssetsDir, { recursive: true });
  fs.cpSync(distDir, appAssetsDir, { recursive: true });

  run(`python3 "${verifier}" "${appAssetsDir}" --compare "${distDir}" > /dev/null`, rootDir);
  console.log('Build & sync complete; Flutter assets match web/dist.');
} catch (error) {
  console.error('Build & sync failed:', error.message);
  process.exit(1);
}
