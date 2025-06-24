document.addEventListener('DOMContentLoaded', function() {
  // Helper to get correct partial path
  function getPartialPath(filename) {
    if (window.location.pathname.includes('/project/')) {
      return '../partials/' + filename;
    }
    return 'partials/' + filename;
  }
  // Load navbar partial
  fetch(getPartialPath('navbar.html'))
    .then(response => response.text())
    .then(html => {
      const header = document.querySelector('header');
      if (header) {
        header.innerHTML = html;
        // Dynamically set logo path
        var logoImg = header.querySelector('img[alt="Douglas Fraize Logo"]');
        if (logoImg) {
          if (window.location.pathname.includes('/project/')) {
            logoImg.src = '../images/logo.svg';
          } else {
            logoImg.src = 'images/logo.svg';
          }
        }
        // Set active nav link
        const page = document.body.getAttribute('data-page');
        if (page) {
          const activeLink = header.querySelector(`[data-nav="${page}"]`);
          if (activeLink) {
            activeLink.classList.add('border-l-4', 'border-blue-500', 'pl-4');
            activeLink.classList.remove('hover:text-blue-400');
            // Desktop style
            activeLink.classList.add('xl:border-l-0', 'xl:border-b-2', 'xl:border-blue-500', 'xl:pb-1');
            activeLink.classList.remove('xl:pl-4');
          }
        }
        // Hamburger menu JS
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
          navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
          });
        }
      }
    });
}); 