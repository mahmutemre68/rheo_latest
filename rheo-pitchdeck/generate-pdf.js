const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    const htmlPath = path.resolve(__dirname, 'index.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

    // Set viewport to 16:9 landscape
    await page.setViewport({ width: 1920, height: 1080 });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 2000));

    // Get all slides
    const slideCount = await page.$$eval('.slide', slides => slides.length);
    console.log(`Found ${slideCount} slides`);

    // Capture each slide as a full page screenshot approach
    // First, inject CSS to make slides display as pages
    await page.addStyleTag({
        content: `
      html { scroll-snap-type: none !important; }
      .nav-dots { display: none !important; }
      .slide { 
        min-height: 100vh; 
        page-break-after: always; 
        break-after: page;
      }
    `
    });

    await page.pdf({
        path: path.resolve(__dirname, '..', 'Rheo_PitchDeck.pdf'),
        width: '1920px',
        height: '1080px',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false,
    });

    console.log('PDF saved to Rheo_PitchDeck.pdf');
    await browser.close();
})();
