const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  const page = await browser.newPage();
  
  // iPhone 15 Pro Max size (in @3x resolution, so 430x932 physical points, scale 3)
  // App store wants 1290x2796
  await page.setViewport({
    width: 430,
    height: 932,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Wait a bit for animations
  await new Promise(r => setTimeout(r, 4000));
  
  // Screen 1: Hero
  await page.screenshot({ path: '../screenshot_1_hero.png' });
  console.log('Took screenshot 1');
  
  // App is interactive. Since we disabled onboarding in main.dart?
  // Wait, I left `showOnboarding = true` in main.dart? I need to check.
  
  await browser.close();
})();
