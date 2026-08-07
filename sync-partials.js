const fs = require('fs');
const path = require('path');

// Bakes partials/header.html, partials/footer.html, and partials/head.html
// directly into each page's static HTML, so the browser never has to fetch
// and inject them at runtime (no flash of missing nav, no layout shift,
// no delayed font loading). partials/*.html stay the single source of
// truth -- edit those, then re-run this script to propagate the change.
//
// Re-runnable: each inlined block is wrapped in a
// <!-- BEGIN:name -->...<!-- END:name --> marker. On first run (no marker
// present yet) the script replaces the legacy <div id="name-include"></div>
// mount point instead.

const ROOT = __dirname;

const ROOT_PAGES = ['index.html', 'portfolio.html', 'about.html', 'resume.html', 'ai-in-design.html'];
const NESTED_DIRS = ['projects', 'workouts'];

const PARTIALS = {
    header: { file: 'partials/header.html', mount: 'header-include' },
    footer: { file: 'partials/footer.html', mount: 'footer-include' },
};

// partials/head.html has no mount div (it's fetched into <head> at runtime
// today); we anchor its inline insertion after the stylesheet link instead.
const HEAD_PARTIAL_FILE = 'partials/head.html';

function collectTargetPages() {
    const pages = ROOT_PAGES.filter(p => fs.existsSync(path.join(ROOT, p)))
        .map(p => ({ file: p, prefix: '' }));

    for (const dir of NESTED_DIRS) {
        const dirPath = path.join(ROOT, dir);
        if (!fs.existsSync(dirPath)) continue;
        fs.readdirSync(dirPath)
            .filter(f => f.endsWith('.html'))
            .forEach(f => pages.push({ file: path.join(dir, f), prefix: '../' }));
    }

    return pages;
}

// Mirrors the runtime prefixIfRelative() logic that used to live in
// js/includes.js: leave absolute/hash/mailto/tel URLs alone, prefix
// everything else with the page's relative depth.
function prefixIfRelative(url, prefix) {
    if (!url) return url;
    if (/^(?:[a-z]+:)?\/\//i.test(url)) return url;
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    if (url.startsWith('../') || url.startsWith('/')) return url;
    return prefix + url;
}

function rewriteUrls(html, prefix) {
    if (!prefix) return html;
    return html
        .replace(/(href|src|data-src)="([^"]*)"/g, (m, attr, url) => `${attr}="${prefixIfRelative(url, prefix)}"`)
        .replace(/(srcset|data-srcset)="([^"]*)"/g, (m, attr, srcset) => {
            const rewritten = srcset.split(',').map(part => {
                const trimmed = part.trim();
                const [u, descriptor] = trimmed.split(/\s+/);
                return prefixIfRelative(u, prefix) + (descriptor ? ' ' + descriptor : '');
            }).join(', ');
            return `${attr}="${rewritten}"`;
        });
}

function wrap(name, content) {
    return `<!-- BEGIN:${name} -->\n${content.trim()}\n<!-- END:${name} -->`;
}

function inject(html, name, block, mountId) {
    const markerRe = new RegExp(`<!-- BEGIN:${name} -->[\\s\\S]*?<!-- END:${name} -->`);
    if (markerRe.test(html)) {
        return html.replace(markerRe, block);
    }
    if (mountId) {
        const mountRe = new RegExp(`<div id="${mountId}"></div>`);
        if (mountRe.test(html)) {
            return html.replace(mountRe, block);
        }
    }
    return null;
}

function injectHead(html, block) {
    const markerRe = /<!-- BEGIN:head -->[\s\S]*?<!-- END:head -->/;
    if (markerRe.test(html)) {
        return html.replace(markerRe, block);
    }
    // First run: anchor right after the site stylesheet link.
    const styleRe = /(<link rel="stylesheet" href="[^"]*css\/style\.css">)/;
    if (styleRe.test(html)) {
        return html.replace(styleRe, `$1\n${block}`);
    }
    return null;
}

function main() {
    const headerSrc = fs.readFileSync(path.join(ROOT, PARTIALS.header.file), 'utf8');
    const footerSrc = fs.readFileSync(path.join(ROOT, PARTIALS.footer.file), 'utf8');
    const headSrc = fs.readFileSync(path.join(ROOT, HEAD_PARTIAL_FILE), 'utf8');

    const pages = collectTargetPages();
    let updated = 0;

    for (const { file, prefix } of pages) {
        const fullPath = path.join(ROOT, file);
        let html = fs.readFileSync(fullPath, 'utf8');
        if (!html.includes(`id="${PARTIALS.header.mount}"`) && !html.includes('BEGIN:header')) {
            continue; // page doesn't use the shared header/footer (e.g. 404.html)
        }

        const headerBlock = wrap('header', rewriteUrls(headerSrc, prefix));
        const footerBlock = wrap('footer', rewriteUrls(footerSrc, prefix));
        const headBlock = wrap('head', rewriteUrls(headSrc, prefix));

        let next = html;
        next = inject(next, 'header', headerBlock, PARTIALS.header.mount) ?? next;
        next = inject(next, 'footer', footerBlock, PARTIALS.footer.mount) ?? next;
        next = injectHead(next, headBlock) ?? next;

        if (next !== html) {
            fs.writeFileSync(fullPath, next);
            console.log(`Synced partials -> ${file}`);
            updated++;
        }
    }

    console.log(`Partial sync complete. ${updated} file(s) updated.`);
}

main();
