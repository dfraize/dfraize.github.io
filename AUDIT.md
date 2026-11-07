# Portfolio Site Audit (dark-mode readiness)

Audited 2026-11-05 against `master` @ `8150785`. Read-only: no source files were changed. Findings come from reading the code, grepping, and measuring files. I did **not** run the site in a browser, so layout and visual claims are from CSS and image inspection, not rendering.

## Summary

**Verdict: needs prep.** The site is in better shape than most hand-built sites. It has one shared stylesheet, a `:root` token block, and 235 `var(--…)` references against only 17 hardcoded hex values outside `:root`. A dark theme is a few days of work, not a rewrite. Four things stand in the way:

1. **Token names are literal, not semantic.** `--color-white` is used both as a card surface and as text on the dark nav and the blue button. `--color-black` is used as the heading color. Flipping these values for dark mode would break the nav, the button, and the headings. Tokens need splitting by role first. (High)
2. **17 hardcoded hex values and 5 hardcoded rgba values** sit outside `:root` in `css/style.css`, including duplicates of existing tokens. (High)
3. **Several images have light backgrounds baked in.** The hero illustration (`hero-bg`) has a white rectangle baked in. The portfolio header illustration is dark line art that will vanish on a dark background. The pie chart's dark wedge will lose contrast. (High)
4. **Project pages have no `<main>` and no `<h1>`.** The page title is a `<div>`. This is an accessibility problem today, independent of dark mode. (High)

Other highlights:

- **Contrast fails today.** Card subtitles (`#aaa` on white) are 2.32:1. Card meta and testimonial titles (`#999` on white) are 2.85:1. Nav hover and active text (`#666` on `#111`) is 3.29:1. Mobile menu hover (`#666` on `#333`) is 2.20:1.
- **There are two nav menus** because one is the desktop bar and one is the mobile dropdown. They are baked in from `partials/header.html`, are byte-identical on all 21 pages, and are consistent.
- **`ai-in-design.html` has `noindex`.** It looks intentional: the page was added in a deliberate commit, is linked from the homepage, and is left out of `sitemap.xml`. Confirm this is still what you want, since the homepage promotes it.
- **No OG, Twitter, or canonical tags on any page.**
- **136 of 153 `<img>` tags have no `width`/`height`.**
- **33 of the optimized WebP files are larger than their PNG twin**, and WebP is served first.
- **No broken internal links or image paths** (checked every `href`/`src`/`srcset`).
- **Only 4 CSS classes are unused**, and 2 of those are false positives. The stylesheet is clean.

---

## 1. Color system

### 1.1 Tokens vs hardcoded

`css/style.css` (3,202 lines, single file).

| Measure | Count |
|---|---|
| `var(--…)` references | 235 |
| Color/shadow tokens in `:root` ([style.css:25-65](css/style.css:25)) | 15 colors + 3 shadows |
| Hardcoded hex outside `:root` | **17** |
| Hardcoded `rgba()` outside `:root` | **7 values on 5 lines** |
| `hsl()` | 0 |
| Named colors (`white`, `black`, …) | 0 (only `transparent`, [style.css:317](css/style.css:317)) |
| `@media (prefers-color-scheme)` / `color-scheme` / `theme-color` | none |

The 17 hardcoded hexes outside `:root`:

| Line | Value | Role | Existing token it duplicates |
|---|---|---|---|
| 148 | `#f5f5f5` | footer divider bar | none (near `#f1f1f1`, `#FAFAFA`) |
| 307 | `#ffffff` | active nav underline (`inset box-shadow`) | `--color-white` |
| 327 | `#ffffff` | hamburger lines | `--color-white` |
| 373 | `#ffffff` | mobile nav item text | `--color-white` |
| 508, 526 | `#666666` | methodology text | `--color-text-body` |
| 517 | `#000000` | methodology heading | `--color-black` |
| 884-885 | `#ff5f56`, `#ffbd2e`, `#27c93f` | card "traffic light" dots | none (decorative, fine to keep fixed) |
| 1129 | `#000000` | results heading | `--color-black` |
| 1138 | `#666666` | results text | `--color-text-body` |
| 1178-1179 | `#ffffff`, `#e0e0e0` | `.factory-mutual-card` surface and border | `--color-white`, `--color-gray-border` |
| 1222 | `#000000` | other-work heading | `--color-black` |
| 1231 | `#4a4a4a` | other-work description | none (near `--color-gray-dark`) |
| 1502 | `#f1f1f1` | `.design-coder-section` background | none (near `--color-gray-light`) |

Hardcoded rgba: [215](css/style.css:215) nav shadow; [871-872](css/style.css:871) card chrome bar (white at .92 plus a hairline); [1614](css/style.css:1614) and [1700](css/style.css:1700) both repeat the value of `--shadow-header` instead of using it.

**Priority: High.** All of these are one-line swaps to tokens (or new tokens).

### 1.2 Distinct colors by role

**Backgrounds**
- `#FAFAFA` (`--color-gray-light`): page background, footer, latest-work, all `*-main` wrappers
- `#ffffff` (`--color-white`, plus hardcoded copies): hero, cards, testimonials, project sections
- `#f1f1f1` (hardcoded, line 1502): about "design/coder" band
- `#f5f5f5` (hardcoded, line 148): footer bar
- `#111111` (`--color-nav-bg`): nav
- `#222222` / `#333333`: mobile menu / its hover
- `linear-gradient(#006dcc → #0056a3)`: "Other Projects" card ([style.css:1202](css/style.css:1202))

**Text**
- `#000` / `#000000`: headings (`--color-black`, plus 4 hardcoded)
- `#666666` (`--color-text-body`): body (23 uses, plus 4 hardcoded)
- `#606060` (`--color-gray-dark`): 1 use (list marker)
- `#4a4a4a`: one hardcoded use
- `#757575` (`--color-muted`): footer
- `#999999` (`--color-gray-medium`): card meta, testimonial title, placeholder
- `#aaaaaa` (`--color-gray-text`): card subtitle
- `#ffffff`: nav and button text

**Borders / dividers**
- `#e0e0e0` (`--color-gray-border`): cards, dividers (9 uses, plus 1 hardcoded)
- `#444444` (`--color-divider-dark`): mobile menu dividers
- `rgba(0,0,0,.08)`: card chrome hairline

**Links / accents**
- `#006dcc` (`--color-primary`), `#0056a3` (`--color-primary-hover`): button, inline link, gradient card. Only 3 uses each.
- `#ff5f56` / `#ffbd2e` / `#27c93f`: decorative card dots

**Shadows**
- `rgba(196,196,196,.25)` (`--shadow-light`), `rgba(0,0,0,.1)` (`--shadow-card`), `rgba(30,32,34,.1)+rgba(0,0,0,.1)` (`--shadow-header`, duplicated twice inline), `rgba(0,0,0,.15)` (nav)

**Near-duplicates that should probably merge**

| Group | Suggestion | Priority |
|---|---|---|
| `#000` / `#000000` | one `--color-text-strong` | High |
| `#fff` / `#ffffff` | one white; separate surface from on-dark text | High |
| `#666666` hardcoded vs `--color-text-body` | use the token | High |
| `#e0e0e0` hardcoded vs `--color-gray-border` | use the token | High |
| `#FAFAFA` / `#f5f5f5` / `#f1f1f1` | collapse to 2 surface tones (page bg, subtle band) | Medium |
| `#606060` / `#4a4a4a` / `#666666` | collapse to one body-text token (+ maybe one secondary) | Medium |
| `#999` / `#aaa` / `#757575` | collapse to one muted token that passes AA (see section 4) | High |
| `#111` / `#222` / `#333` / `#444` | keep as an "inverse surface" scale, but name it so | Low |
| Shadow `rgba(30,32,34,.1)` x2 hardcoded vs `--shadow-header` | use the token | Medium |

### 1.3 Colors that will not respond to a theme switch

- **No inline `style="…"` colors in any HTML.** Only [workouts/workout-list.html:72-73](workouts/workout-list.html:72) has inline style, and it is layout only (padding, max-width, min-height).
- **No colors set in JS.** `js/includes.js` and `js/main.js` only toggle classes. The `<script>` in `partials/head.html` sets a class and `sessionStorage`, nothing visual.
- **Raster/SVG assets with baked-in colors** are the real exposure. See section 2.
- **Google Fonts `<link>`** has no color impact.
- **`images/ui/footer-logo.svg` uses `var(--fill-0, #E8E8E8)`** in its fills, but it is loaded via `<img>`, where page CSS variables do not cross the boundary. It always renders the fallback grays. Medium.

### 1.4 Stylesheets

One shared stylesheet, `css/style.css`, linked from all 22 pages (21 baked pages plus `404.html`). No per-page CSS and no `<style>` blocks. The only duplication is selector-level:

- Print/resume overrides live inside the same file (`background: var(--color-white) !important` on resume containers). These force white and will need to stay white in dark mode for printing. Medium.
- Hero/portfolio/resume headers repeat the same box-shadow value (see 1.1).
- Many project-page rules use a `factory-mutual-*` prefix (`.factory-mutual-title`, `-card`, `-grid`, `-work`) on every project page. This is a leftover name from the first case study; it is harmless but misleading. Low.

---

## 2. Images and graphics

### 2.1 Inventory

Pages reference only `images/optimized/**` plus `logo.svg`, `favicon.svg`, and `ui/footer-logo.svg`. Everything else is source material for [optimize-images.js](optimize-images.js). `.gitignore` excludes `images/projects/` and `images/about/` (raw PNGs), so those are local only. The ~19 MB of `images/optimized` (PNG+WebP pairs) is what ships. I did not list all ~230 files individually; project screenshots are grouped by folder.

**Top-level / non-project**

| File | Type | Dimensions | Size | Used in |
|---|---|---|---|---|
| `images/logo.svg` | SVG (vector) | 60x60 | 1.7 KB | nav on every page |
| `images/favicon.svg` | SVG | 60x60 | 1.7 KB | `<link rel=icon>` (byte-identical to `logo.svg`) |
| `images/ui/footer-logo.svg` | SVG | 121x121 | 1.8 KB | footer on every page |
| `optimized/hero-bg.png` / `.webp` | PNG (alpha) / WebP | 1440x612 | 101 KB / 35 KB | CSS `.hero::before` ([style.css:638](css/style.css:638)) |
| `optimized/portfolio-header-image.png` / `.webp` | PNG (alpha) / WebP | 992x687 | 89 KB / 78 KB | `portfolio.html:88` (hidden below 767px) |
| `optimized/ai-hero-section.png` / `.webp` | PNG / WebP | 1048x622 | 121 KB / 70 KB | `ai-in-design.html:89` |
| `optimized/about/pie-chart.png` / `.webp` | PNG (alpha) / WebP | 400x350 | 25 KB / 9 KB | `about.html:105` |
| `optimized/about/random-facts-image.png` / `.webp` | PNG / WebP (photo) | 960x704 | 433 KB / 185 KB | `about.html:127` |
| `optimized/design-portfolio.png` / `.webp` | PNG / WebP | 1200x895 | 155 KB / 54 KB | **unused** (no page references it) |
| `images/other-work-card-image.svg` | SVG wrapping base64 raster | 345x291 | **982 KB** | **unused** |
| `images/about/hero-image.png` | PNG (untracked) | 577x433 | 134 KB | **unused** |
| `images/hero-bg.svg`, `ai-hero-section.svg`, `portfolio-header-image.svg` | SVG wrapping base64 raster | various | 527-638 KB each | source only (optimizer input) |

**Project folders** (`images/optimized/projects/<slug>/`, each has `thumbnail` at 660x368 plus screenshots at native size)

| Folder | Files (png+webp pairs) | Notes |
|---|---|---|
| `balance-sheet-calc` | thumb + 5 | `desktop-2` is 1440x2224 and `desktop-4` is 1140x1933 (tall) |
| `choice-auto` | thumb + 6 desktop + 3 mobile | mobile shots 321x956 |
| `factory-mutual` | thumb + 4 design-system + 2 project + 4 mobile | **largest:** `desktop-design-system-1` is 4096x3078, `-2` is 4096x2990, `mobile-2` is 3272x2156 (363 KB png / 279 KB webp) |
| `fidelity-dashboards` | thumb + 3 | 1440x921 |
| `fidelity-design-system` | thumb + 6 | tall: `desktop-4` is 917x4096, `desktop-3` is 1440x3750 |
| `fidelity-salesforce` | thumb + 5 | |
| `fidelity-spark` | thumb + 4 | `desktop-2` is 1440x2195 |
| `hsa-landing-page` | thumb + 1 | `desktop-1` is 1200x1200; raw thumbnail source is 2 MB |
| `mercer-evolution` / `-fsmpro` / `-worklife` | thumb + 6 / 7 / 9 | |
| `other-work` | thumb + 11 | |
| `picasso` | thumb + 8 | |
| `simpletuition` | thumb + 4 desktop + 4 mobile | desktop-1 is 1280x1379; files are ~130-200 KB each |

Where each is used: each project's `thumbnail` renders in the portfolio card (`portfolio.html`, and `index.html` for the 3 featured). The screenshots render in that project's own page.

### 2.2 Baked-in light backgrounds (dark mode)

I composited the transparent images onto a near-black background to check.

| Asset | Problem | Priority |
|---|---|---|
| `hero-bg` (homepage hero) | Illustration of the portrait sits on a **baked-in white rectangle** (the SVG source has `<rect fill="white">`). It will show as a white box on a dark page. | **High** |
| `portfolio-header-image` | Transparent, but it is **dark gray/black line art**. On a dark background the lines would nearly disappear. | **High** |
| `pie-chart` | Transparent. Light-gray "Designer" wedge is fine, but the dark "Coder" wedge (~#333) would lose contrast. It is also hidden at <=479px. | Medium |
| `ai-hero-section` | Mostly transparent, bright blue brain art. Reads fine on dark. Corners have faint white at about 10% alpha. | Low |
| `random-facts-image` | Full-bleed photo. Fine. | none |
| Project thumbnails and screenshots (all of them) | Light-themed product UI screenshots. They show as light rectangles on dark. That is expected and normal for portfolio work (they already sit in bordered cards); I would leave them alone. `other-work` thumbnail is a flat `#ebebeb` fill; `hsa-landing-page` corners are `#f9f7f5`. | Low |
| Card chrome bar `.card-image::before` | `rgba(255,255,255,.92)` is a hardcoded light strip. Needs a token. | Medium |

### 2.3 SVGs with hardcoded fills

| File | Finding | Could use `currentColor`/variables? |
|---|---|---|
| `logo.svg` / `favicon.svg` | `#F0F0F0` circle with black mask shapes (fills `black`, `white` in mask). Light circle plus dark mark works on both light and dark nav (`#111`). | Not needed for the nav. If you want the logo to adapt, inline it or `<use>` it. Low. |
| `ui/footer-logo.svg` | Fills use `var(--fill-0, #E8E8E8)` etc. Vars do nothing in `<img>`, so these are effectively fixed grays (`#E8E8E8`, `#DCDCDC`, `#F5F5F5`, white). On a dark footer these light circles will glow. | **Yes.** Inline the SVG or use CSS `mask-image` with `background-color: currentColor`. Medium. |
| `hero-bg.svg`, `ai-hero-section.svg`, `portfolio-header-image.svg`, `other-work-card-image.svg` | Not real vectors. Each wraps one or two base64 raster images (`<pattern>`/`<image>`), 0.5-1 MB each. Fill is `url(#pattern…)`. | **No.** Replace with real vector art or separate light/dark rasters. |

### 2.4 Oversized images, formats, attributes

- **WebP is larger than PNG for 33 files** (e.g. `other-work/desktop-3` 91 KB webp vs 69 KB png, `fidelity-design-system/desktop-3` 156 KB vs 112 KB, `mercer-evolution/desktop-6` 65 KB vs 33 KB, `choice-auto/mobile-3` 57 KB vs 29 KB). Because `<source type="image/webp">` is listed first, browsers pay the larger cost. Total optimized PNG is 11.2 MB vs 7.8 MB WebP, so WebP wins overall, but these 33 are worse. Fix: lower quality for flat-UI screenshots or use lossless WebP/AVIF. Medium.
- **Oversized pixel dimensions** (project pages render screenshots in a ~1160px max container): `factory-mutual` design-system-1/2 at 4096px wide, `mobile-2` at 3272px, `mobile-3` at 2630px, `desktop-project-2` at 2634px, `desktop-design-system-4` at 2658px. Resize to about 2x display width. Medium.
- **Photos served with a PNG fallback:** `random-facts-image.png` is 433 KB. Use JPEG as the fallback, and consider AVIF. Low.
- **No AVIF anywhere.** Low.
- **Unused weight:** `design-portfolio.{png,webp}` (209 KB, generated by `optimize-images.js` and deployed, but unreferenced) and the 982 KB `other-work-card-image.svg`. Low.
- **Missing `width`/`height`:** 136 of 153 `<img>` tags have none. Only the 17 card thumbnails (330x184) have them. This means layout shift on load, especially on the long project screenshot pages. The logo and footer logo have none either. **Medium.**
- **Alt text:** no missing or empty `alt` attributes. Quality issues:
  - ~88 project screenshots use `"<Project> Desktop View N"`, which does not describe the content. Medium.
  - `portfolio.html:88` ("Design portfolio preview") is a decorative illustration and should be `alt=""`. Low.
  - `about.html:105` pie chart alt "Skills pie chart" does not convey the designer/coder split. Low.
  - Logo link alt "DF Logo" should describe the link target (for example "Douglas Fraize, home"). Low.

---

## 3. Structure and templating

### 3.1 How pages are built

Static, hand-written HTML with a small Node generation pipeline. No framework, no runtime includes (`includes.js` now only wires up behavior).

| Piece | Source of truth | Output | Command |
|---|---|---|---|
| Header, footer, `<head>` extras (fonts, favicon, nav-intro script) | `partials/header.html`, `footer.html`, `head.html` | Baked between `<!-- BEGIN:header -->…<!-- END:header -->` markers in every page. `../` prefix is added automatically for nested pages. ([sync-partials.js](sync-partials.js)) | `npm run sync-partials` |
| Portfolio grid and 3 homepage "Latest Work" cards | [projects-data.json](projects-data.json) | Between `BEGIN:portfolio-cards` / `latest-work-cards` markers in `portfolio.html` and `index.html` ([generate-cards.js](generate-cards.js)) | `npm run generate-cards` |
| Testimonials | [testimonials-data.json](testimonials-data.json) | Between `BEGIN:testimonials` markers in `index.html` ([generate-testimonials.js](generate-testimonials.js)) | `npm run generate-testimonials` |
| Images | `images/projects/<slug>/` | `images/optimized/projects/<slug>/` (PNG + WebP, thumbnails cropped to 660x368) ([optimize-images.js](optimize-images.js)) | `npm run optimize-images` |
| Project pages | [projects/_template.html](projects/_template.html) with `{{PLACEHOLDERS}}`, filled by the `new-portfolio-page` skill | `projects/<slug>.html` | manual via skill |

**Card data flow.** Each project in `projects-data.json` has `id`, `href`, `image` (boolean), `alt`, `title`, `description`, optional `meta`, `date`, `featured`, `featuredTitle`, `featuredDescription`. `generate-cards.js` sorts by `date` descending (ties are alphabetical). The homepage takes the top 3 of the projects that have images, using `featured` as the tiebreak. It emits the same `<picture>` markup for both (WebP source plus PNG fallback, `width="330" height="184"`, lazy). `deploy-safe.sh` runs the optimizer and generators before committing.

### 3.2 Nav and footer

- **Why two nav menus:** `<div class="nav-menu">` is the desktop horizontal bar, and `<div class="mobile-menu">` is the dropdown opened by the hamburger. CSS shows one or the other at the 1199px breakpoint ([TODO.md](TODO.md) notes the breakpoint move). This is a standard pattern, not a bug. Cost: link lists are maintained twice inside the partial.
- **Consistency:** I hashed the baked header, footer, and head blocks on all 21 pages (root pages, 15 project pages including `_template.html`, `workouts/`). **All are identical** after path-prefix normalization. Not duplicated drift, since they are generated.
- **Not covered:** `404.html` has no header, footer, head partial, or favicon (it only links the stylesheet). It also uses an absolute `/index.html` link and a relative `css/style.css`, which will break if a missing URL is nested (for example `/foo/bar`). **Medium.**
- **Cosmetic:** the About link in `partials/header.html` is indented differently from its siblings (lines 338-339 in baked pages). Low.
- **Maintenance:** the baked output means editing a partial requires re-running `sync-partials` or the change does not appear. This is documented and scripted.

### 3.3 Copy-pasted blocks that should be shared

- **The project page body** (intro, challenge, details, methodology, goals, gallery grid) is copy-pasted 14 times from `_template.html`. Only the content differs. The template plus skill handles creation, but a structural fix (heading levels, `<main>`) has to be repeated in all 14. Either add a `sync-project-shell` step like the partials, or generate project pages from JSON like the cards. **Medium.**
- **Gallery blocks** (`<picture>` plus `factory-mutual-card`) are repeated for every screenshot. A generator or a data list per project would also give you a chance to add real `width`/`height` and descriptive alt text. **Medium.**
- **Per-page `<head>` meta** (title, description) is hand-written in each page. See section 5.
- **Hero header block** is reused between `portfolio.html` and `ai-in-design.html` by copying markup and class names. Low.

---

## 4. Accessibility

### 4.1 Contrast (WCAG AA: 4.5:1 normal text, 3:1 large text/UI)

Computed from the CSS token values. Backgrounds as in section 1.

| Element | Foreground / background | Ratio | Result | Priority |
|---|---|---|---|---|
| Card subtitle, `.work-card p` ([style.css:914](css/style.css:914)), 14px | `#aaaaaa` / `#ffffff` | **2.32** | Fail | **High** |
| Card meta line, `p.card-meta` (line ~930), 11px | `#999999` / `#ffffff` | **2.85** | Fail | **High** |
| Testimonial title ([style.css:1053](css/style.css:1053)), 13px | `#999999` / `#ffffff` | **2.85** | Fail | **High** |
| `.image-placeholder` text (line 1456) | `#999999` / `#FAFAFA` | **2.73** | Fail | Low (unused in markup) |
| Nav item hover / active ([style.css:301-305](css/style.css:301)) | `#666666` / `#111111` | **3.29** | Fail (3:1 only applies to large text; I did not confirm the nav font size) | **High** |
| Mobile nav hover / active ([style.css:385-392](css/style.css:385)) | `#666666` / `#333333` | **2.20** | Fail | **High** |
| Footer links/copyright (`--color-muted`) | `#757575` / `#FAFAFA` | **4.41** | Fail by a hair (needs 4.5) | Medium |
| Body text | `#666666` / `#FAFAFA` | 5.50 | Pass | none |
| Body text on white | `#666666` / `#ffffff` | 5.74 | Pass | none |
| Body text on `#f1f1f1` | `#666666` / `#f1f1f1` | 5.08 | Pass | none |
| Primary link on page bg | `#006dcc` / `#FAFAFA` | 4.96 | Pass | none |
| Button text | `#ffffff` / `#006dcc` | 5.17 | Pass | none |
| Mobile nav text | `#ffffff` / `#222222` | 15.91 | Pass | none |
| Decorative quote mark (`.testimonial-card::before`) | `#e0e0e0` / `#ffffff` | 1.32 | Decorative, acceptable | none |

The nav hover/active state is a design choice (dim the text on hover), but it is the one place where the interactive state is also the least legible. Lighten it (for example `#bbb` on `#111`) rather than darken.

Not checked: text over images (none found in the hero; text is over a plain white fill), and the print stylesheet.

### 4.2 Headings and landmarks

- **Project pages (14 files): no `<h1>` and no `<main>`.** The page title is `<div class="project-title">`, and the first real headings are `<h3>The Challenge</h3>` etc., with `<h2>Desktop Views</h2>` appearing later. Heading outline is h3, h3, h3, h3, h2. The page is a `<section class="project-main">` straight under `<body>`. **High.** Fix once in `_template.html` and propagate.
- **`index.html`:** two `<h1>` ("designer" and "<coder>"). Defensible as one hero statement, but unusual; `aria-labelledby` points at only the first. Low. Then h2, then h3 for cards. Fine.
- **`portfolio.html`:** `h1` then card `<h3>`s with no `<h2>` between. Medium.
- **`resume.html`:** h1, h2, h3, h4. Clean. **`about.html`**, **`ai-in-design.html`**: h1 then h2s. Clean.
- **`workouts/workout-list.html`:** has `<main>` and `<h1>`. Fine.
- **Nav:** `<nav class="nav">` has no `aria-label` and is not inside a `<header>`; there are two navs' worth of links inside one `<nav>`, which is fine. No `aria-current="page"` on the active link (state is class only; [includes.js:46](js/includes.js:46)). Medium.
- **No skip-to-content link.** There is an `.sr-only` utility already. Medium.
- `<footer>` is present on every page. `404.html` has `<main>` but no nav or footer.

### 4.3 Focus and keyboard

- **No `:focus` or `:focus-visible` rules anywhere in the stylesheet, and no `outline: none`.** So keyboard users get browser default focus rings. These work but are not designed: the default ring on `#111` and on image-covered cards may be weak. A themed `:focus-visible` is needed for dark mode regardless. **Medium.**
- **Hamburger** is a real `<button>` with `aria-controls` and `aria-expanded`, and the closed menu uses `visibility: hidden`, so its links are not tabbable when closed. Good.
- Issues: the `aria-label` stays "Open menu" when open. Clicking a mobile link removes the classes but does not reset `aria-expanded`/`aria-hidden` ([includes.js:91-97](js/includes.js:91)), so the state can desync. There is no Escape-to-close. Medium.
- Footer "scroll to top" is `<a href="#">` with a JS handler. Fine, but a `<button>` would be more accurate. Low.
- Whole-card links (`.portfolio-card-link`) are single `<a>` wrappers around image, h3, and text. Good for keyboard users.

### 4.4 Reduced motion

- Handled: nav intro ([style.css:233](css/style.css:233)) and designer/coder slide-in ([style.css:729](css/style.css:729)).
- Not handled: `html { scroll-behavior: smooth }` ([style.css:19](css/style.css:19)), the 0.3s mobile menu transition, and the hamburger animation. Anything you add for theme switching (a color transition) should also be wrapped. Low.

---

## 5. Other issues

### 5.1 Meta tags

| Page | `<title>` | description | robots | OG / Twitter / canonical |
|---|---|---|---|---|
| index | "Douglas Fraize - Portfolio" | yes | none | none |
| portfolio / about / resume | yes | yes | none | none |
| ai-in-design | "Working With AI - Douglas Fraize" | yes | **`noindex, follow`** | none |
| 14 project pages | "<Project> - Douglas Fraize" | auto-generated from title ("X - Douglas Fraize's Portfolio") | none | none |
| workouts | "Workout List" | "Workout list" | none (blocked in `robots.txt`, correct) | none |
| 404 | "Page Not Found" | none | none | none |

- **No `og:*`, `twitter:*`, `canonical`, or `theme-color` on any page.** Shared links will have no preview card. **High** for a portfolio that gets shared. Add through `partials/head.html` plus per-page values. Note `theme-color` is also useful for dark mode.
- **Project page descriptions are a restatement of the title** ("Fidelity - Design System - Douglas Fraize's Portfolio"). Low value for search or link previews. Medium.
- **`ai-in-design.html` `noindex`:** looks intentional. It was added in commit `8ccd4cd` ("Add AI in my design practice page and homepage callout"), which links it from the homepage, and it is absent from `sitemap.xml`. It is still linked prominently, so the intent is "reachable but not search-listed". I cannot tell from the repo whether you meant to lift this later. **Decision for you; Low.**
- `sitemap.xml` has no `<lastmod>`, and lists every page except `ai-in-design.html` and the template. Consistent with the `noindex`. Low.

### 5.2 Links, naming, leftovers

- **No broken internal links or image references** (checked all `href`, `src`, `srcset` on 22 pages).
- **Title and card name mismatches** (grid `title` in `projects-data.json` vs the page `<title>`/heading):

  | Card title | Project page title | Priority |
  |---|---|---|
  | Fidelity - HSA Landing Page | Fidelity - Health Savings Account | Medium |
  | Fidelity - Dashboard | Fidelity - Tableau Dashboard | Medium |
  | FM Global | FM Global - Enterprise Design System | Medium |
  | Fidelity Spark | Fidelity - Project Spark | Low |
  | FSM Pro | Mercer - FSM Pro | Low |
  | Evolution: UI Framework | Mercer - Evolution UI Framework | Low |
  | Mercer Worklife | Mercer - Worklife | Low |
  | (balance-sheet page) | "Mercer: Balance sheet calculator" (colon where others use a hyphen) | Low |

  The cards also mix "Fidelity - X", "Fidelity X", and "Fidelity Spark" patterns.
- **Style rule check:** no em dashes anywhere, as required. The homepage featured titles use en dashes as separators ("FM Global – Full Work", "Fidelity – Design System", `projects-data.json`). Your `CLAUDE.md` reserves en dashes for date ranges, so these are technically outside the convention. Low.
- **Leftover template text:** none in live pages. `{{` appears 15 times only in `projects/_template.html`, which is expected. It is deployed to the site though (not in `sitemap.xml`, but publicly reachable at `/projects/_template.html`). Low.
- **Dead/unused:** only 4 unused CSS classes: `image-placeholder` and `sr-only` have no use in any HTML or JS (`sr-only` is a generic utility; it would be handy for a skip link), while `png` and `webp` are false positives from file extensions in selectors. `js/main.js` contains a `PortfolioApp.init()` stub that does nothing, and a MutationObserver fallback for a `#header-include` element that no longer exists since the header is baked in. Low. `images/other-work-card-image.svg`, `design-portfolio.*`, `about/hero-image.png` are unreferenced (see 2.4).
- **`.gitignore` oddity:** it lists `images/favicon.svg`, `images/logo.svg`, `images/hero-bg.svg`, `images/ai-hero-section.svg`, and `images/design-portfolio.jpg`, but all are tracked, so the ignore has no effect today. `logo.svg` and `favicon.svg` are needed at runtime. If those files were ever removed from the index, they would not be redeployed. Low.
- **`js/includes.js` is misnamed:** it no longer includes anything. Low.
- **`workouts/workout-list.html`** loads scripts with `?v=2` cache-busting while no other page does. Harmless. Low.

### 5.3 Mobile layout risks

I did not render at widths; these come from the CSS. The TODO log records manual checks at 320/450/700/1280px.

- **Absolute-positioned card text.** `.work-card h3/p` use `position: absolute` with fixed `top: 200 / 222 / 242px` ([style.css:905-940](css/style.css:905)). A long title that wraps, or a larger user font size, will overlap the subtitle and meta lines. The latest-work section already overrides this to static. **Medium.**
- **Fixed pixel widths** on hero text (290/284px at [style.css:674-702](css/style.css:674)) and resume/about columns (400/500/350px at [1537-2142](css/style.css:1537)). These are handled by media queries, but they are the most likely things to break at in-between widths. **Medium.**
- **`overflow-x: hidden` on `body`** ([style.css:78](css/style.css:78)) masks any horizontal overflow instead of surfacing it. Medium.
- **Heavy use of `px` font sizes** (94 declarations, about 20 distinct sizes) alongside `html { font-size: 62.5% }`. Users who raise their browser default text size will see little change. Low. `.coder-title` is 67px.
- **Tall screenshots:** a few project images are 1440x3750 or 917x4096 on a ~1160px column. On narrow phones they scale down to unreadable. That is a content decision, not a bug. Low.
- **`white-space: nowrap`** at [style.css:113](css/style.css:113) and [802](css/style.css:802). Check these at 320px. Low.

---

## 6. Dark mode readiness

**Verdict: needs prep.** One stylesheet and good token adoption mean there is no architectural refactor, but the tokens are named by color rather than role, 17 hex and 5 rgba values are hardcoded, and several images assume a light page.

### Ordered steps and rough effort

| # | Step | Effort | Notes |
|---|---|---|---|
| 1 | **Fix the light-mode contrast failures first.** Darken `#aaa` and `#999` text, lighten nav hover/active, and nudge `#757575`. Doing this before the token split avoids baking bad values into two themes. | 1-2 hrs | Section 4.1 |
| 2 | **Replace the 17 hardcoded hexes and 5 rgba values with tokens.** Mostly swaps to existing tokens; add 2-3 new ones (subtle band, chrome bar). | 1-2 hrs | Section 1.1 |
| 3 | **Rename and split tokens by role.** Suggested set: `--bg-page`, `--bg-surface`, `--bg-subtle`, `--text-strong`, `--text-body`, `--text-muted`, `--border`, `--accent`, `--accent-hover`, `--nav-bg`, `--on-dark`, `--on-accent`, `--shadow-*`. Split `--color-white` into surface vs on-dark/on-accent. Find/replace with a quick review of the 34 `--color-white` (12) and `--color-black` (22) uses. | 2-3 hrs | Prerequisite for 5 |
| 4 | **Decide the dark nav strategy.** The nav is already `#111`. In dark mode it will blend with the page, so it needs a border, a slightly different tone, or shadow adjustments. | 30 min | |
| 5 | **Add the dark palette** under `:root[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`, plus `color-scheme: light dark`. Re-derive shadows (dark UI needs borders more than shadows). **Check every pair against AA** using the section 4.1 method. | 3-4 hrs | |
| 6 | **Fix the images.** Re-export the hero illustration without its white rectangle (and to a real PNG/WebP with proper transparency); recolor or provide a light-line variant of the portfolio header illustration; adjust the pie-chart wedge colors or rebuild it as inline SVG/CSS; inline `footer-logo.svg` with `currentColor`. Optionally dim project screenshots slightly in dark mode (`filter: brightness(.9)`). | 3-6 hrs (design time dominates) | Section 2.2-2.3 |
| 7 | **Add the toggle and persistence.** Header button (3 states: system/light/dark), `localStorage` with try/catch, and an inline `<head>` script to set `data-theme` before paint (extend `partials/head.html`; it already has the same pattern for the nav intro). Add `<meta name="theme-color">` for both schemes. Run `sync-partials`. | 2-3 hrs | |
| 8 | **Add themed `:focus-visible` styles** and `aria-current` on the nav (see 4.3). | 1 hr | Best done in this pass |
| 9 | **QA at all breakpoints in both themes**, including print/resume (which forces white) and the 404 page. | 2-3 hrs | |

**Rough total: 15-24 hours**, of which about a third is image work. Steps 1-3 are worth doing even if you never ship dark mode.

### Independent fixes worth doing in the same pass (not dark-mode blockers)

1. Add `<main>`, an `<h1>`, and a sane heading order to the project template, then propagate to 14 pages. (High, ~1-2 hrs)
2. Add OG/Twitter/canonical tags via `partials/head.html`. (High, ~1-2 hrs)
3. Add `width`/`height` to images, ideally through a generator. (Medium, ~2 hrs)
4. Recompress the 33 files where WebP is larger than PNG, and downscale the 4096px FM Global screenshots. (Medium, ~1 hr)
5. Align card titles with page titles. (Medium, 15 min)
