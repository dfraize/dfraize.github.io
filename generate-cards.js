// Regenerates the portfolio-card markup in portfolio.html and index.html from
// projects-data.json, so both pages stay consistent and in sync as projects
// are added, edited, or reordered. See projects-data.json's "_schema" for field docs.
const fs = require('fs');
const path = require('path');

const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const FEATURED_COUNT = 3;

function loadProjects() {
  const dataPath = path.join(__dirname, 'projects-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.projects;
}

function cardImageHtml(project, indent) {
  if (!project.image) {
    return `${indent}<div class="card-image other-projects">\n${indent}    <!-- Blue background for "${project.title}" -->\n${indent}</div>`;
  }
  return `${indent}<div class="card-image">
${indent}    <picture>
${indent}        <source data-srcset="images/optimized/projects/${project.id}/thumbnail.webp" type="image/webp">
${indent}        <img src="${PLACEHOLDER_SRC}" data-src="images/optimized/projects/${project.id}/thumbnail.png" alt="${project.alt}" loading="lazy" decoding="async" width="330" height="184">
${indent}    </picture>
${indent}</div>`;
}

function metaLineHtml(project, indent) {
  if (!project.meta) return '';
  return `\n${indent}<p class="card-meta">${project.meta}</p>`;
}

function portfolioCardHtml(project) {
  const indent = '                ';
  return `${indent}<a href="${project.href}" class="portfolio-card portfolio-card-link">
${cardImageHtml(project, indent + '    ')}
${indent}    <h3>${project.title}</h3>
${indent}    <p>${project.description}</p>${metaLineHtml(project, indent + '    ')}
${indent}</a>`;
}

function featuredCardHtml(project) {
  const indent = '                    ';
  const title = project.featuredTitle || project.title;
  const description = project.featuredDescription || project.description;
  return `${indent}<li>
${indent}<a href="${project.href}" class="work-card work-card-link">
${cardImageHtml(project, indent + '    ')}
${indent}    <div class="card-body">
${indent}        <h3>${title}</h3>
${indent}        <p>${description}</p>${metaLineHtml(project, indent + '        ')}
${indent}    </div>
${indent}</a>
${indent}</li>`;
}

// Sort by date descending; ties (including undated-vs-undated) break
// alphabetically by title. Undated projects always sink below every dated
// project.
function sortByDateDesc(projects) {
  return [...projects].sort((a, b) => {
    if (a.date == null && b.date == null) return a.title.localeCompare(b.title);
    if (a.date == null) return 1;
    if (b.date == null) return -1;
    if (a.date !== b.date) return b.date - a.date;
    return a.title.localeCompare(b.title);
  });
}

// Same as sortByDateDesc, but a tie (equal dates, or both undated) is broken
// by the "featured" flag before falling back to alphabetical. This is what
// lets the homepage's 3 featured cards stay manually curated when several
// projects share the same year (or none has a date yet) instead of just
// falling out alphabetically.
function sortForFeatured(projects) {
  return [...projects].sort((a, b) => {
    if (a.date == null && b.date == null) return featuredTiebreak(a, b);
    if (a.date == null) return 1;
    if (b.date == null) return -1;
    if (a.date !== b.date) return b.date - a.date;
    return featuredTiebreak(a, b);
  });
}

function featuredTiebreak(a, b) {
  const featuredA = a.featured ? 0 : 1;
  const featuredB = b.featured ? 0 : 1;
  if (featuredA !== featuredB) return featuredA - featuredB;
  return a.title.localeCompare(b.title);
}

function replaceBetweenMarkers(html, marker, replacement) {
  const pattern = new RegExp(
    `(<!-- BEGIN:${marker} -->\\n)([\\s\\S]*?)(<!-- END:${marker} -->)`
  );
  if (!pattern.test(html)) {
    throw new Error(`Could not find BEGIN:${marker}/END:${marker} markers`);
  }
  return html.replace(pattern, `$1${replacement}\n$3`);
}

function main() {
  const projects = loadProjects();

  const portfolioOrder = sortByDateDesc(projects);
  const portfolioHtml = portfolioOrder.map(portfolioCardHtml).join('\n\n');

  const featuredCandidates = projects.filter((project) => project.image);
  const featured = sortForFeatured(featuredCandidates).slice(0, FEATURED_COUNT);
  const featuredHtml = featured.map(featuredCardHtml).join('\n\n');

  const portfolioPath = path.join(__dirname, 'portfolio.html');
  const portfolioSrc = fs.readFileSync(portfolioPath, 'utf8');
  fs.writeFileSync(
    portfolioPath,
    replaceBetweenMarkers(portfolioSrc, 'portfolio-cards', portfolioHtml)
  );

  const indexPath = path.join(__dirname, 'index.html');
  const indexSrc = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(
    indexPath,
    replaceBetweenMarkers(indexSrc, 'latest-work-cards', featuredHtml)
  );

  console.log(`Generated ${portfolioOrder.length} portfolio cards and ${featured.length} featured cards.`);
}

main();
