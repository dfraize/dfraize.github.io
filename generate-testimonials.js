// Regenerates the testimonial-card markup in index.html's "What people say"
// section from testimonials-data.json. See testimonials-data.json's "_schema"
// for field docs.
const fs = require('fs');
const path = require('path');

function loadTestimonials() {
  const dataPath = path.join(__dirname, 'testimonials-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.testimonials;
}

function testimonialCardHtml(testimonial) {
  const indent = '                    ';
  return `${indent}<li class="testimonial-card">
${indent}    <p class="testimonial-quote">${testimonial.quote}</p>
${indent}    <p class="testimonial-attribution">
${indent}        <span class="testimonial-name">${testimonial.name}</span>
${indent}        <span class="testimonial-title">${testimonial.title}</span>
${indent}    </p>
${indent}</li>`;
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
  const testimonials = loadTestimonials();
  const testimonialsHtml = testimonials.map(testimonialCardHtml).join('\n\n');

  const indexPath = path.join(__dirname, 'index.html');
  const indexSrc = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(
    indexPath,
    replaceBetweenMarkers(indexSrc, 'testimonials-cards', testimonialsHtml)
  );

  console.log(`Generated ${testimonials.length} testimonial cards.`);
}

main();
