const fs = require('fs');
const path = require('path');

// Get all HTML files in the current directory
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
    const filePath = path.join('.', file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace src="images/ with data-src="images/
    content = content.replace(/src="images\//g, 'data-src="images/');

    // Add loading="lazy" to all img tags that have data-src
    content = content.replace(/data-src="([^"]*)"([^>]*>)/g, 'data-src="$1" loading="lazy"$2');

    // Add lazy loading script after includes.js
    content = content.replace(
        /(<script src="js\/includes\.js"><\/script>)/g,
        '$1\n    <script src="js/lazy-loading.js"></script>'
    );

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});

console.log('Lazy loading implementation completed!');
