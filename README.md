# Portfolio Site

Douglas Fraize's personal portfolio: a static HTML/CSS/JS site (no framework, no build step) with a small Node-based content pipeline for generating cards, syncing shared partials, optimizing images, and producing the resume PDF.

## Quick Start

```bash
npm install
npm run dev
```

Opens `http://localhost:3000` with live-reload on the top-level pages, `projects/`, `workouts/`, `css/`, `js/`, and `partials/`.

## Project Structure

```
Portfolio Site/
├── index.html, about.html, portfolio.html, resume.html, ai-in-design.html
├── projects/              # One case-study page per project + _template.html
├── workouts/               # workout-list.html
├── partials/               # header.html, footer.html, head.html — shared across all pages
├── css/style.css
├── js/                      # includes.js (nav/partial logic), main.js
├── images/                  # source images; images/optimized/ is the only copy pages reference
├── projects-data.json       # source of truth for portfolio/homepage cards
├── testimonials-data.json   # source of truth for homepage testimonials
├── generate-cards.js        # projects-data.json → card markup on index.html/portfolio.html
├── generate-testimonials.js # testimonials-data.json → markup on index.html
├── sync-partials.js         # partials/*.html → every page that includes them
├── optimize-images.js       # images/ (and images/projects/<slug>/, images/about/) → images/optimized/
├── generate-resume-pdf.js   # resume.html → Douglas-Fraize-Resume.pdf (via Puppeteer)
├── deploy-safe.sh           # runs the pipeline above, then commits + pushes
└── TODO.md                  # running list of outstanding/completed work
```

## Editing content

- **Portfolio/homepage cards:** edit `projects-data.json` (see its `_schema` block), then `npm run generate-cards`. Never hand-edit the generated `<a class="portfolio-card...">` / `<a class="work-card...">` blocks — they get overwritten.
- **Testimonials:** edit `testimonials-data.json`, then `npm run generate-testimonials`.
- **Shared header/footer/head:** edit the file in `partials/`, then `npm run sync-partials` to push the change to every page.
- **New project page:** ask Claude to use the `new-portfolio-page` skill (`.claude/skills/`), which builds the page from `projects/_template.html`, registers it in `projects-data.json` and `js/includes.js`, and optimizes its images.
- **Resume:** edit `resume.html` directly, not the PDF — `generate-resume-pdf.js` regenerates `Douglas-Fraize-Resume.pdf` from it on every deploy.
- **Copy style rules** (no em dashes, tone): see [CLAUDE.md](CLAUDE.md).

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server with live-reload |
| `npm start` | Dev server, no watch |
| `npm run optimize-images` | Regenerate `images/optimized/` from source images |
| `npm run sync-partials` | Push `partials/*.html` to every page |
| `npm run generate-cards` | Regenerate portfolio/homepage cards from `projects-data.json` |
| `npm run generate-testimonials` | Regenerate testimonials from `testimonials-data.json` |
| `npm run generate-resume-pdf` | Regenerate the resume PDF from `resume.html` |
| `npm run deploy:safe` | Run the full pipeline above, then commit and push |

## Deploy

```bash
bash deploy-safe.sh "commit message"
```

Runs `optimize-images.js`, `sync-partials.js`, `generate-cards.js`, `generate-testimonials.js`, and `generate-resume-pdf.js`, then commits and pushes.
