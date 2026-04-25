const puppeteer = require('puppeteer');

// Reuse a single browser instance across requests — avoids ~1-2s cold-start per PDF
let _browser = null;
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

async function getBrowser() {
  if (_browser) {
    try { await _browser.pages(); return _browser; } catch { _browser = null; }
  }
  _browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  return _browser;
}

// Add new templates here when you create a new templates/<style>.js file
const TEMPLATE_MAP = {
  'classic-pro':    require('../templates/classic-pro'),
  'modern-split':   require('../templates/modern-split'),
  'creative-edge':  require('../templates/creative-edge'),
  'minimal-clean':  require('../templates/minimal-clean'),
  'executive-pro':  require('../templates/executive-pro'),
};

function resumeToHTML(resume, profilePhoto, design = 'classic-pro') {
  const styleKey = Object.keys(TEMPLATE_MAP).find(s => design.startsWith(s)) || 'classic-pro';
  const tpl = TEMPLATE_MAP[styleKey];
  const theme = tpl.THEMES[design] || tpl.THEMES[Object.keys(tpl.THEMES)[0]];
  return tpl.generateHTML(resume, profilePhoto, theme);
}

async function fitPageToSingleSheet(page) {
  await page.evaluate(({ pageWidth, pageHeight }) => {
    const html = document.documentElement;
    const body = document.body;
    if (!body) return;

    body.style.transform = '';
    body.style.transformOrigin = 'top left';
    body.style.width = '';
    body.style.minHeight = '';
    html.style.width = '';
    html.style.height = '';
    body.style.height = '';

    const contentWidth = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.scrollWidth,
      html.offsetWidth
    );
    const contentHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    const widthScale = pageWidth / contentWidth;
    const heightScale = pageHeight / contentHeight;
    const scale = Math.min(1, widthScale, heightScale);

    if (scale < 0.999) {
      body.style.transform = `scale(${scale})`;
      body.style.width = `${pageWidth / scale}px`;
      body.style.minHeight = `${pageHeight / scale}px`;
      html.style.width = `${pageWidth}px`;
      html.style.height = `${pageHeight}px`;
      body.style.height = `${pageHeight / scale}px`;
    }
  }, { pageWidth: PAGE_WIDTH, pageHeight: PAGE_HEIGHT });
}

async function generatePDF(resume, profilePhoto, design = 'classic-pro') {
  const html = resumeToHTML(resume, profilePhoto || null, design);
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: PAGE_WIDTH, height: PAGE_HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await fitPageToSingleSheet(page);
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
      scale: 1.0
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

module.exports = { generatePDF };
