document.addEventListener('DOMContentLoaded', function() {
  function getPartialPath(filename) {
    if (window.location.pathname.includes('/project/')) {
      return '../partials/' + filename;
    }
    return 'partials/' + filename;
  }
  fetch(getPartialPath('footer.html'))
    .then(response => response.text())
    .then(html => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.outerHTML = html;
      }
    });
}); 