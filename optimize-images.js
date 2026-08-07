const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Project images: each images/projects/<slug>/ folder holds that project's
// screenshots plus one thumbnail.png, which doubles as the portfolio card
// image. thumbnail.png is resized for the 330x184 card (2x for retina);
// every other file is compressed at its native size for the project's
// detail page.
const PROJECTS_SRC_DIR = path.join(__dirname, 'images', 'projects');
const PROJECTS_OUT_DIR = path.join(__dirname, 'images', 'optimized', 'projects');
const CARD_WIDTH = 660;
const CARD_HEIGHT = 368;

// Hero background: rasterize the source SVG (which embeds raster art) down
// to a compressed WebP+PNG pair at its native display size.
const HERO_SRC = path.join(__dirname, 'images', 'hero-bg.svg');
const HERO_OUT_DIR = path.join(__dirname, 'images', 'optimized');
const HERO_WIDTH = 1440;
const HERO_HEIGHT = 612;

// Other one-off page images that embed raster art at source resolution far
// beyond their display size. Each entry is rasterized/resized down to a
// compressed WebP+PNG pair, same treatment as the hero background above.
const OTHER_IMAGES = [
    // ai-in-design.html header image: SVG embeds a raster pattern at native
    // 524x311 display size; render at 2x for retina.
    { src: 'images/ai-hero-section.svg', outName: 'ai-hero-section', width: 1048, height: 622, density: 150 },
    // portfolio.html header image: source is a 2360x1760 photo shown at a
    // much smaller column width; 1200w covers 2x retina at that size.
    { src: 'images/design-portfolio.jpg', outName: 'design-portfolio', width: 1200, height: null },
];

async function optimizeProjectImages() {
    if (!fs.existsSync(PROJECTS_SRC_DIR)) return;

    const slugs = fs.readdirSync(PROJECTS_SRC_DIR).filter(f =>
        fs.statSync(path.join(PROJECTS_SRC_DIR, f)).isDirectory()
    );

    for (const slug of slugs) {
        const srcDir = path.join(PROJECTS_SRC_DIR, slug);
        const outDir = path.join(PROJECTS_OUT_DIR, slug);
        fs.mkdirSync(outDir, { recursive: true });

        const files = fs.readdirSync(srcDir).filter(f => /\.(png|jpe?g)$/i.test(f));

        for (const file of files) {
            const name = path.parse(file).name;
            const srcPath = path.join(srcDir, file);
            const pngOut = path.join(outDir, `${name}.png`);
            const webpOut = path.join(outDir, `${name}.webp`);

            const resize = name === 'thumbnail'
                ? { width: CARD_WIDTH, height: CARD_HEIGHT, fit: 'cover' }
                : null;

            const pngPipeline = () => resize ? sharp(srcPath).resize(resize) : sharp(srcPath);

            await pngPipeline().png({ quality: 85, compressionLevel: 9 }).toFile(pngOut);
            await pngPipeline().webp({ quality: 80 }).toFile(webpOut);

            console.log(`Optimized ${slug}/${file} -> optimized/projects/${slug}/${name}.{png,webp}`);
        }
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

async function optimizeOtherImages() {
    for (const { src, outName, width, height, density } of OTHER_IMAGES) {
        const srcPath = path.join(__dirname, src);
        if (!fs.existsSync(srcPath)) continue;

        const outDir = path.join(__dirname, 'images', 'optimized');
        fs.mkdirSync(outDir, { recursive: true });

        const pngOut = path.join(outDir, `${outName}.png`);
        const webpOut = path.join(outDir, `${outName}.webp`);
        const resize = { width, ...(height ? { height, fit: 'inside' } : {}) };
        const sharpOpts = density ? { density } : {};

        await sharp(srcPath, sharpOpts).resize(resize).png({ quality: 85, compressionLevel: 9 }).toFile(pngOut);
        await sharp(srcPath, sharpOpts).resize(resize).webp({ quality: 82 }).toFile(webpOut);

        console.log(`Optimized ${src} -> optimized/${outName}.{png,webp}`);
    }
}

(async () => {
    await optimizeProjectImages();
    await optimizeHeroBackground();
    await optimizeOtherImages();
    console.log('Image optimization complete.');
})().catch(err => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
