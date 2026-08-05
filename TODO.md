# TODO

Running list of outstanding work on the portfolio site. Add to this whenever something gets earmarked "for later" instead of just mentioning it in chat, so it survives a context clear.

## Pending

- [ ] **`other-work.html`** — needs two one-line project descriptions from Doug before it can get the light-treatment content pass:
  - Internal Framework — what did this framework solve?
  - Benefit Hub — what did this centralize/simplify?
  - (Agent Desktop and Design System process documentation already have their one-liners ready, provided earlier.)
  - Note: this page intentionally does NOT get the full case-study template (Challenge/Meta/Methodology/Goals/Closing) — it's a multi-project gallery, not a single project.
- [ ] **Mobile-view image audit** — double-check that the "Mobile Views" screenshots on `projects/choice-auto.html` and `projects/simpletuition.html` actually belong to those projects. (Precedent: FM Global's mobile screenshots turned out to belong to a different project and were removed entirely.)

## Done

- [x] New project-page template structure: Title, Intro, The Challenge, Meta Block, Design Methodology, Business Goals, Visuals, Closing/Impact Note — rolled out to all project pages except `other-work.html`
- [x] `.claude/skills/new-portfolio-page/SKILL.md` and `projects/_template.html` updated to match
- [x] Real content pass on FM Global, HSA Landing Page, and the other 10 case-study pages
- [x] Em dashes removed site-wide (style rule: use period/comma/colon instead)
- [x] "Back to Portfolio" link added above the title on every project page
- [x] Portfolio grid flattened into one continuously-wrapping row (newest project first, "Other Projects" always last)
- [x] Pre-navigation fade-out disabled (was a flat 250ms delay on every internal link click); fade-in on page load kept
- [x] `.project-closing-content` mobile padding fixed to match other sections
- [x] `node_modules` untracked from git, `.gitignore` added
- [x] Favicon, `robots.txt`, `sitemap.xml` fixed/added
- [x] Portfolio thumbnails + hero background image-optimized

## Reference

- Deploy: `bash deploy-safe.sh "commit message"` — runs `optimize-images.js`, `sync-partials.js`, and `generate-resume-pdf.js` automatically, then commits and pushes.
- New project page: ask Claude to use the `new-portfolio-page` skill, or just say "create a new portfolio page."
- Resume PDF: `resume.html`'s "Download PDF" button links to `Douglas-Fraize-Resume.pdf`, which `generate-resume-pdf.js` (Puppeteer) regenerates from `resume.html` on every deploy — edit the HTML, not the PDF.
