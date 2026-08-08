---
name: new-portfolio-page
description: Create a new project page for Douglas Fraize's portfolio site — builds projects/<slug>.html from the template, adds an entry to projects-data.json (which generates the card on both portfolio.html and, if featured, index.html), registers the page in js/includes.js for nav highlighting, and optimizes/places screenshot images. Use when the user asks to add, create, or build a new portfolio/project page.
---

# New Portfolio Page

Adding one project touches **the project page, `projects-data.json`, and `js/includes.js`**, plus an **images folder**. Do not skip any of them — a page that exists but has no portfolio.html card, or a card that links to a 404, is a broken result.

## 0. Voice & tone

All project-page copy (intro, Challenge, Design Methodology, Business Goals, Closing note) should read like this:

- Professional and candid, with a friendly undercurrent
- Confident, not corporate — avoid buzzword-stacking ("synergized," "leveraged," overused "spearheaded")
- First-person and direct: "I audited," "I found," "I decided" — not passive voice
- Honest about real challenges — a little candor about what was messy or hard builds more credibility than a highlight reel
- Concise — short paragraphs, no filler, every sentence earns its place
- **No em dashes.** This is a site-wide rule (see `CLAUDE.md`), not just project pages — use a period, comma, or colon instead.

If the user hands you rough/bullet-point notes for a section, write it up in this voice rather than pasting their notes verbatim or padding it out.

## 1. Gather the info

Ask for (or extract from a pasted brief) all of this in one pass — don't interrogate one field at a time:

- **Page title** — shown in `<title>` and the big intro heading (e.g. "Mercer - Picasso Design System")
- **Slug** — derive a kebab-case filename from the title if not given (e.g. `picasso`, `fidelity-spark`). Confirm it doesn't already exist in `projects/`.
- **Project description (intro)** — 2-4 sentences, lead with impact: state what you did AND the outcome in the same paragraph, don't save the payoff for the end. If the project has real quantifiable stats (see below), don't restate those exact numbers here too — describe the qualitative outcome in prose and let the stat cards carry the numbers, so the two don't repeat each other back-to-back.
- **Impact stats** — 2-4 short, real, quantifiable outcomes (e.g. "85% / Adoption across teams", "40% / Faster UI development"), each a number/value plus a few-word label. Optional — most projects won't have these. Ask if the user has real metrics; **never invent or estimate a number to fill this in**, and never reuse another project's stats. If there's nothing concrete, skip the section entirely rather than forcing it.
- **The Challenge** — 1-3 sentences on what was broken/fragmented/slow/inconsistent before this project. Required on every page going forward.
- **My Role** (e.g. "UX/UI Designer")
- **Project Team** (e.g. "1 Art Director, 1 UX/UI Designer and 2 UI Developers")
- **Duration** (e.g. "3 months", "Was ongoing")
- **Project Status** (e.g. "Version 1 released...")
- **Design Methodology** — paragraph: audit/process/key decisions/cross-functional collaboration, tradeoffs if relevant
- **Business Goals** — paragraph: what the project set out to achieve organizationally
- **Closing/Impact Note** — 1-2 sentences after the visuals wrapping up current state or ongoing impact. Not a repeat of the intro. Optional but recommended — ask if they want one.
- **Portfolio card copy** — the short `<h3>` title and one-line `<p>` category shown on the grid card (e.g. "Picasso Design System" / "Design System"). Can default to the page title / a category you infer.
- **Screenshots** — ask where the source images are (a folder path the user gives you, or files they'll drop in). Ask desktop-only, or desktop + mobile views — **don't assume mobile views exist just because other pages have them, and don't reuse another project's screenshots to fill the section.** Get a short descriptive alt-text base if the title doesn't cover it.
- **Portfolio thumbnail image** — one image for the grid card on portfolio.html (can reuse the first desktop screenshot if nothing else is supplied).

If the user gives you a rough brief instead of answering point by point, extract what you can and only ask about genuine gaps (e.g. missing team info, missing images). If the user says to use placeholder copy for now (e.g. during a structure-only pass across existing pages), use lorem ipsum for the paragraph fields but still ask for real Role/Team/Duration/Status/card-copy, since those are short factual fields, not prose.

## 2. Build `projects/<slug>.html`

Copy `projects/_template.html` to `projects/<slug>.html` and fill in the placeholders. Section order matters and is baked into the template already — don't reorder it:

1. Title (`{{PAGE_TITLE}}`)
2. Intro (`{{PROJECT_DESCRIPTION}}`)
3. Impact Stats (`{{IMPACT_STATS_SECTION}}`) — only if the project has real stats (see step 1)
4. The Challenge (`{{CHALLENGE}}`)
5. Meta Block — My Role / Project Team / Duration / Project Status (unchanged format)
6. Design Methodology (`{{METHODOLOGY}}`)
7. Business Goals (`{{BUSINESS_GOALS}}`)
8. Visuals — Desktop Views, then Mobile Views only if real mobile screenshots exist for this project
9. Closing/Impact Note (`{{CLOSING_NOTE}}`) — if the user skipped this, delete the whole `<section class="project-closing">` block rather than leaving an empty paragraph

Placeholders: `{{PAGE_TITLE}}`, `{{PROJECT_DESCRIPTION}}`, `{{IMPACT_STATS_SECTION}}`, `{{CHALLENGE}}`, `{{MY_ROLE}}`, `{{PROJECT_TEAM}}`, `{{DURATION}}`, `{{PROJECT_STATUS}}`, `{{METHODOLOGY}}`, `{{BUSINESS_GOALS}}`, `{{CLOSING_NOTE}}`

- `{{IMPACT_STATS_SECTION}}` — only insert this if the project has real, user-supplied quantifiable stats (2-4 of them). If not, delete the placeholder entirely, leaving nothing (same rule as `{{MOBILE_VIEWS_SECTION}}` below) — don't leave an empty `<div class="project-stats">` and don't invent numbers to fill it:

```html
<div class="project-stats">
    <div class="project-stat">
        <span class="project-stat-value">85%</span>
        <span class="project-stat-label">Adoption across teams</span>
    </div>
    <!-- repeat .project-stat per stat, 2-4 total -->
</div>
```

- `{{DESKTOP_IMAGE_CARDS}}` — repeat this block per desktop screenshot (numbered `desktop-1`, `desktop-2`, ...):

```html
<div class="factory-mutual-card">
    <picture>
        <source srcset="../images/optimized/projects/<slug>/desktop-N.webp" type="image/webp">
        <img src="../images/optimized/projects/<slug>/desktop-N.png" alt="<Page Title> Desktop View N" loading="lazy">
    </picture>
</div>
```

- `{{MOBILE_VIEWS_SECTION}}` — only insert this if the user actually has mobile screenshots **for this specific project**. Never carry over or reuse another project's mobile images to fill this section, and don't assume a project has mobile views just because a neighboring page does — confirm with the user. If there are none, delete this placeholder entirely, leaving nothing:

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

Every image for a project, thumbnail and gallery screenshots alike, lives in one source folder: `images/projects/<slug>/`. Place the thumbnail there as `thumbnail.png` (or `.jpg`), and any gallery screenshots alongside it as `desktop-1.png`, `desktop-2.png`, `mobile-1.png`, etc. Then run `node optimize-images.js` from the repo root (or `npm run optimize-images`) **once** — it walks every project folder under `images/projects/` and processes every `.png`/`.jpg` file it finds automatically, producing a WebP+PNG pair for each in `images/optimized/projects/<slug>/`:

- `thumbnail.*` is resized/cropped to 660x368 (2x retina for the 330x184 `.card-image` display, `fit: 'cover'`, center-cropped).
- Every other file (`desktop-N`, `mobile-N`) is compressed at its native size, uncropped.

You don't need to invoke `sharp` manually for gallery screenshots — that only happens automatically as part of this one script run. A manual `sharp` one-liner is only needed for the exception below.

The project-page gallery cards (`.factory-mutual-card`) scale to each image's own aspect ratio and never crop — screenshots display in full, whatever their shape. The **portfolio thumbnail** is different: it's always cropped to a fixed size. `optimize-images.js` center-crops by default, which is right most of the time. If the thumbnail source is unusually tall (e.g. a full-page scrolling capture) rather than a normal single-viewport screenshot, a center crop will likely cut off the header entirely — ask the user, or override just that one file with a manual top-crop before running the script:

```bash
node -e "
const sharp = require('sharp');
sharp('images/projects/SLUG/thumbnail.png')
  .extract({ left: 0, top: 0, width: W, height: H })
  .resize(660, 368)
  .toFile('images/optimized/projects/SLUG/thumbnail.png');
"
```

If a gallery screenshot itself is extremely tall or narrow (well beyond a typical screen capture), flag it to the user too — nothing will crop it, but an extreme aspect ratio will still look ungainly stretched across a ~500px-wide card.

**Clean up after**: verify no stray copies of the raw source screenshot ended up inside `images/projects/<slug>/` under an unexpected filename — `optimize-images.js` processes every `.png`/`.jpg` in that folder, so an accidental duplicate will get silently "optimized" into unwanted output. `ls images/projects/<slug>/ | wc -l` before and after should only grow by exactly the number of files you intentionally added.

## 4. Add the card to `projects-data.json`

Portfolio cards on both `portfolio.html` and `index.html` are generated from `projects-data.json` by `generate-cards.js` — never hand-edit the `<a class="portfolio-card...">` or `<a class="work-card...">` markup directly, it gets overwritten on the next generate. Add a new entry to the `"projects"` array (see the file's `_schema` block for field docs):

```json
{
  "id": "<slug>",
  "href": "projects/<slug>.html",
  "image": true,
  "alt": "<Card Title>",
  "title": "<Card Title>",
  "description": "<Card Category>",
  "date": null
}
```

- `image` is `true` if `images/optimized/projects/<slug>/thumbnail.png` exists (produced in step 3) and should be used as the card image, or `false`/omitted for a card with no thumbnail (e.g. "Other Projects", which renders a flat background instead). The actual image path is always derived from `id`, not a separate filename field.
- Leave `date` as `null` if the actual year isn't known yet; ask the user for it if they have one, since it drives sort order on both the grid (newest first) and which 3 projects appear as the homepage's featured cards (most recent by date). A project without a date sorts to the bottom of the grid and is never auto-featured.
- Only set `featured: true` if the user explicitly wants this project pinned to the homepage as a manual override before it has a real date (rare — normally just let the date drive it once known).
- `featuredTitle`/`featuredDescription` are optional overrides used only when this project becomes one of the homepage's 3 featured cards, if you want different copy there than the terse grid title/description (see existing entries like `factory-mutual` for the pattern).

Then run `npm run generate-cards` (or it happens automatically as part of `npm run deploy:safe`) to regenerate both pages.

## 5. Register the page in `js/includes.js`

Add `'<slug>.html'` to the `portfolioPages` array (around line 151) so the "Portfolio" nav item highlights as active when viewing the new page:

```js
const portfolioPages = [
    'portfolio.html', 'simpletuition.html', ..., '<slug>.html'
];
```

## 6. Add the page to `sitemap.xml`

Add `<url><loc>https://dfraize.github.io/projects/<slug>.html</loc></url>` alongside the other project entries.

## 7. Verify

If a local preview server is running, load `http://localhost:<port>/projects/<slug>.html` and `http://localhost:<port>/portfolio.html` in the browser pane and confirm:

- The new project page renders with header/footer, intro content, and images loading correctly
- Sections appear in order: Title, Intro, Impact Stats (if present), The Challenge, Meta Block, Design Methodology, Business Goals, Visuals, Closing note (if present)
- The new card appears on the portfolio grid (position depends on its `date` relative to other projects) and links to the right page
- The nav bar highlights "Portfolio" as active on the new project page
- No console errors

Report back a summary of files changed/created — do not just say "done."
