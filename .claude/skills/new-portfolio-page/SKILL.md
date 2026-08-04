---
name: new-portfolio-page
description: Create a new project page for Douglas Fraize's portfolio site — builds projects/<slug>.html from the template, adds the card to portfolio.html, registers the page in js/includes.js for nav highlighting, and optimizes/places screenshot images. Use when the user asks to add, create, or build a new portfolio/project page.
---

# New Portfolio Page

Adding one project touches **three files** plus an **images folder**. Do not skip any of them — a page that exists but has no portfolio.html card, or a card that links to a 404, is a broken result.

## 1. Gather the info

Ask for (or extract from a pasted brief) all of this in one pass — don't interrogate one field at a time:

- **Page title** — shown in `<title>` and the big intro heading (e.g. "Mercer - Picasso Design System")
- **Slug** — derive a kebab-case filename from the title if not given (e.g. `picasso`, `fidelity-spark`). Confirm it doesn't already exist in `projects/`.
- **Project description** — 2-4 sentence paragraph for the intro block
- **My Role** (e.g. "UX/UI Designer")
- **Project Team** (e.g. "1 Art Director, 1 UX/UI Designer and 2 UI Developers")
- **Duration** (e.g. "3 months", "Was ongoing")
- **Project Status** (e.g. "Version 1 released...")
- **Design Methodologies** — paragraph
- **Business Goals** — paragraph
- **Portfolio card copy** — the short `<h3>` title and one-line `<p>` category shown on the grid card (e.g. "Picasso Design System" / "Design System"). Can default to the page title / a category you infer.
- **Screenshots** — ask where the source images are (a folder path the user gives you, or files they'll drop in). Ask desktop-only, or desktop + mobile views. Get a short descriptive alt-text base if the title doesn't cover it.
- **Portfolio thumbnail image** — one image for the grid card on portfolio.html (can reuse the first desktop screenshot if nothing else is supplied).

If the user gives you a rough brief instead of answering point by point, extract what you can and only ask about genuine gaps (e.g. missing team info, missing images).

## 2. Build `projects/<slug>.html`

Copy `projects/_template.html` to `projects/<slug>.html` and fill in the placeholders:

- `{{PAGE_TITLE}}`, `{{PROJECT_DESCRIPTION}}`, `{{MY_ROLE}}`, `{{PROJECT_TEAM}}`, `{{DURATION}}`, `{{PROJECT_STATUS}}`, `{{METHODOLOGY}}`, `{{BUSINESS_GOALS}}`

- `{{DESKTOP_IMAGE_CARDS}}` — repeat this block per desktop screenshot (numbered `desktop-1`, `desktop-2`, ...):

```html
<div class="factory-mutual-card">
    <picture>
        <source srcset="../images/optimized/projects/<slug>/desktop-N.webp" type="image/webp">
        <img src="../images/optimized/projects/<slug>/desktop-N.png" alt="<Page Title> Desktop View N" loading="lazy">
    </picture>
</div>
```

- `{{MOBILE_VIEWS_SECTION}}` — if the user has mobile screenshots too, insert (else delete this placeholder entirely, leaving nothing):

```html
<!-- Divider Line -->
<div class="divider-line">
    <hr>
</div>

<!-- Mobile Views Section -->
<section class="factory-mutual-work">
    <div class="factory-mutual-container">
        <h2 class="factory-mutual-title">Mobile Views</h2>
        <div class="factory-mutual-grid">
            <!-- same factory-mutual-card pattern as above, using mobile-N.png/webp -->
        </div>
    </div>
</section>
```

Reference an existing page like `projects/picasso.html` or `projects/choice-auto.html` (which has both desktop and mobile sections) if you need to double check markup/indentation conventions.

## 3. Process and place the images

Optimized images live at `images/optimized/projects/<slug>/` as `desktop-1.png` + `desktop-1.webp` pairs (and `mobile-1.png`/`.webp` if applicable). There is no working build script for this in the repo (`optimize-images.js` referenced in `package.json` no longer exists) — generate the pair directly with `sharp`, which is already a devDependency:

```bash
node -e "
const sharp = require('sharp');
const src = 'PATH_TO_SOURCE_IMAGE';
const out = 'images/optimized/projects/SLUG/desktop-1';
sharp(src).png({ quality: 85 }).toFile(out + '.png');
sharp(src).webp({ quality: 85 }).toFile(out + '.webp');
"
```

Run this once per screenshot (desktop and mobile), naming sequentially. Also copy or generate one thumbnail into `images/portfolio/<slug-thumbnail>.png` for the portfolio grid card (a resized/cropped version of the best screenshot works, or ask the user for a dedicated thumbnail).

## 4. Add the card to `portfolio.html`

Insert a new card into one of the `<div class="portfolio-row ...">` grids (rows come in `triple` or other groupings — put the new card wherever fits, or start a new row):

```html
<a href="projects/<slug>.html" class="portfolio-card portfolio-card-link">
    <div class="card-image">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="images/portfolio/<thumbnail>.png" alt="<Card Title>" loading="lazy">
    </div>
    <h3><Card Title></h3>
    <p><Card Category></p>
</a>
```

Match the existing base64 placeholder `src` exactly — it's the lazy-load blur-up placeholder used by `js/lazy-loading.js`, not a mistake to clean up.

## 5. Register the page in `js/includes.js`

Add `'<slug>.html'` to the `portfolioPages` array (around line 151) so the "Portfolio" nav item highlights as active when viewing the new page:

```js
const portfolioPages = [
    'portfolio.html', 'simpletuition.html', ..., '<slug>.html'
];
```

## 6. Verify

If a local preview server is running, load `http://localhost:<port>/projects/<slug>.html` and `http://localhost:<port>/portfolio.html` in the browser pane and confirm:

- The new project page renders with header/footer, intro content, and images loading correctly
- The new card appears on the portfolio grid and links to the right page
- The nav bar highlights "Portfolio" as active on the new project page

Report back a summary of files changed/created — do not just say "done."
