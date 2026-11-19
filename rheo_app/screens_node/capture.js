const puppeteer = require('puppeteer');

const name = process.argv[2] || 'screenshot.png';
const waitSec = parseInt(process.argv[3] || '15');

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  
  // iPhone 6.7" App Store: 1290x2796 → 430x932 @3x
  await page.setViewport({
    width: 430,
    height: 932,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  console.log('Navigating to http://localhost:8080...');
  try {
    await page.goto('http://localhost:8080', { 
      waitUntil: 'networkidle0', 
      timeout: 60000 
    });
  } catch (e) {
    console.log('Navigation timeout, continuing anyway...');
  }
  
  console.log(`Waiting ${waitSec}s for app to fully render...`);
  await new Promise(r => setTimeout(r, waitSec * 1000));
  
  const path = `../${name}`;
  console.log(`Saving screenshot to ${path}...`);
  await page.screenshot({ path, type: 'png' });
  
  console.log('Screenshot saved successfully!');
  await browser.close();
  console.log('Done!');
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
