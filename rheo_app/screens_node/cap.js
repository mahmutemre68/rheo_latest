const puppeteer = require('puppeteer');
const name = process.argv[2] || 'screenshot.png';
const waitSec = parseInt(process.argv[3] || '15');

async function main() {
  console.log('Starting...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  console.log('Going to page...');
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 30000 });
  console.log('Waiting ' + waitSec + 's...');
  await new Promise(r => setTimeout(r, waitSec * 1000));
  await page.screenshot({ path: '../' + name });
  console.log('Done!');
  await browser.close();
}

main().catch(e => { console.error('ERR:', e.message); process.exit(1); });
