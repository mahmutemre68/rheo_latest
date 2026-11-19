const puppeteer = require('puppeteer');

(async () => {
  const screenName = process.argv[2] || 'home';
  const outputFile = process.argv[3] || `screenshot_${screenName}.png`;
  
  // App Store requires exactly 1284x2778 for iPhone 6.5" display
  // Use device pixel ratio of 3 with viewport 428x926
  const width = 428;
  const height = 926;
  const dpr = 3;
  // Final image: 428*3=1284 x 926*3=2778 ✓

  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width, height, deviceScaleFactor: dpr });
  
  console.log(`Navigating to http://localhost:8888 ...`);
  await page.goto('http://localhost:8888', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait for app to fully load
  console.log('Waiting 8 seconds for app to render...');
  await new Promise(r => setTimeout(r, 8000));
  
  await page.screenshot({ path: outputFile, type: 'png' });
  console.log(`Screenshot saved: ${outputFile}`);
  
  await browser.close();
})();
