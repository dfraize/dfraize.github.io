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

(async () => {
    await optimizeProjectImages();
    await optimizeHeroBackground();
    console.log('Image optimization complete.');
})().catch(err => {
    console.error('Image optimization failed:', err);
    process.exit(1);
});
