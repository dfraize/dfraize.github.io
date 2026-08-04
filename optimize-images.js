const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Portfolio grid thumbnails: source PNGs, output resized WebP+PNG pairs
// sized for the 330x184 card (2x for retina displays).
const PORTFOLIO_SRC_DIR = path.join(__dirname, 'images', 'portfolio');
const PORTFOLIO_OUT_DIR = path.join(__dirname, 'images', 'optimized', 'portfolio');
const CARD_WIDTH = 660;
const CARD_HEIGHT = 368;

// Hero background: rasterize the source SVG (which embeds raster art) down
// to a compressed WebP+PNG pair at its native display size.
const HERO_SRC = path.join(__dirname, 'images', 'hero-bg.svg');
const HERO_OUT_DIR = path.join(__dirname, 'images', 'optimized');
const HERO_WIDTH = 1440;
const HERO_HEIGHT = 612;

async function optimizePortfolioThumbnails() {
    if (!fs.existsSync(PORTFOLIO_SRC_DIR)) return;
    fs.mkdirSync(PORTFOLIO_OUT_DIR, { recursive: true });

    const files = fs.readdirSync(PORTFOLIO_SRC_DIR).filter(f => /\.(png|jpe?g)$/i.test(f));

    for (const file of files) {
        const name = path.parse(file).name;
        const srcPath = path.join(PORTFOLIO_SRC_DIR, file);
        const pngOut = path.join(PORTFOLIO_OUT_DIR, `${name}.png`);
        const webpOut = path.join(PORTFOLIO_OUT_DIR, `${name}.webp`);

        const resize = { width: CARD_WIDTH, height: CARD_HEIGHT, fit: 'cover' };

        await sharp(srcPath).resize(resize).png({ quality: 85, compressionLevel: 9 }).toFile(pngOut);
        await sharp(srcPath).resize(resize).webp({ quality: 80 }).toFile(webpOut);

        console.log(`Optimized ${file} -> optimized/portfolio/${name}.{png,webp}`);
    }
}

async function optimizeHeroBackground() {
    if (!fs.existsSync(HERO_SRC)) return;
    fs.mkdirSync(HERO_OUT_DIR, { recursive: true });

    const pngOut = path.join(HERO_OUT_DIR, 'hero-bg.png');
    const webpOut = path.join(HERO_OUT_DIR, 'hero-bg.webp');
    const resize = { width: HERO_WIDTH, height: HERO_HEIGHT, fit: 'inside' };

    await sharp(HERO_SRC, { density: 150 }).resize(resize).png({ quality: 85, compressionLevel: 9 }).toFile(pngOut);
    await sharp(HERO_SRC, { density: 150 }).resize(resize).webp({ quality: 82 }).toFile(webpOut);

    console.log('Optimized hero-bg.svg -> optimized/hero-bg.{png,webp}');
}

(async () => {
    await optimizePortfolioThumbnails();
    await optimizeHeroBackground();
    console.log('Image optimization complete.');
})().catch(err => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
