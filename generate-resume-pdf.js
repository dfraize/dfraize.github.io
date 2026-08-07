// Renders resume.html to a PDF using the page's own print styles, so the
// downloadable file always matches whatever is currently in resume.html.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('puppeteer');

const PDF_FILENAME = 'Douglas-Fraize-Resume.pdf';

// Stamp a content-hash query string onto the download link so browsers can't
// serve a stale cached copy of the PDF after it's regenerated.
function stampVersionedHref(resumePath, pdfBuffer) {
  const hash = crypto.createHash('md5').update(pdfBuffer).digest('hex').slice(0, 8);
  const html = fs.readFileSync(resumePath, 'utf8');
  const hrefPattern = new RegExp(`href="${PDF_FILENAME}(?:\\?v=[^"]*)?"`);
  const updated = html.replace(hrefPattern, `href="${PDF_FILENAME}?v=${hash}"`);
  if (updated !== html) {
    fs.writeFileSync(resumePath, updated);
  }
}

async function main() {
  const resumePath = path.join(__dirname, 'resume.html');
  const outputPath = path.join(__dirname, PDF_FILENAME);

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file://${resumePath}`, { waitUntil: 'networkidle0' });
    // Force a system font explicitly rather than relying on style.css's
    // @media print block (page.emulateMediaType('print') proved unreliable
    // here) or on Nunito silently failing to load in headless Chromium,
    // which is what was actually happening already: inspecting the PDF's
    // embedded font descriptors confirms text renders as San Francisco
    // (.SF NS), not Nunito, even without this override. This just makes
    // that explicit instead of leaving it to an implicit fallback.
    await page.addStyleTag({
      content: `
        .resume-main, .resume-main * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif !important;
        }
      `,
    });
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
    });
  } finally {
    await browser.close();
  }

  stampVersionedHref(resumePath, fs.readFileSync(outputPath));

  console.log(`Resume PDF generated at ${outputPath}`);
}

main().catch((err) => {
  console.error('Failed to generate resume PDF:', err);
  process.exit(1);
});
