// Determine base prefix for assets depending on path depth
function getBasePrefix() {
    const path = window.location.pathname;
    return (path.includes('/projects/') || path.includes('/workouts/')) ? '../' : '';
}

// Prefix helper for relative URLs
function prefixIfRelative(url) {
    if (!url) return url;
    if (/^(?:[a-z]+:)?\/\//i.test(url)) return url; // absolute or protocol-relative
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    if (url.startsWith('../') || url.startsWith('/') ) return url;
    return getBasePrefix() + url;
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item[data-page], .mobile-nav-item[data-page]');

    // Define portfolio pages for cleaner logic
    const portfolioPages = [
        'portfolio.html', 'simpletuition.html', 'factory-mutual.html', 'picasso.html',
        'balance-sheet-calc.html', 'choice-auto.html', 'fidelity-spark.html',
        'fidelity-salesforce.html', 'fidelity-dashboards.html', 'fidelity-design-system.html',
        'mercer-evolution.html', 'mercer-worklife.html', 'mercer-fsmpro.html', 'other-work.html',
        'hsa-landing-page.html'
    ];

    navItems.forEach(item => {
        item.classList.remove('active');
        const page = item.getAttribute('data-page');

        // Determine if current page matches navigation item
        let isActive = false;

        if (page === 'home' && (currentPage === 'index.html' || currentPage === '')) {
            isActive = true;
        } else if (page === 'portfolio' && portfolioPages.includes(currentPage)) {
            isActive = true;
        } else if (page === 'about' && currentPage === 'about.html') {
            isActive = true;
        } else if (page === 'resume' && currentPage === 'resume.html') {
            isActive = true;
        }

        if (isActive) {
            item.classList.add('active');
        }
    });
}

// Header/footer/fonts are baked directly into each page's HTML by
// sync-partials.js (source of truth: partials/*.html), so there's no
// runtime fetch here anymore -- just wire up behavior once the DOM is ready.
document.addEventListener('DOMContentLoaded', function() {
    initializeNavIntro();
    setActiveNavItem();
    initializeHamburgerMenu();
    initializeSmoothScrollToTop();
    initializeFooterYear();
});

// Keep footer copyright year current without needing a yearly edit
function initializeFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear();
}

// Initialize hamburger menu functionality
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            // Toggle hamburger animation
            hamburger.classList.toggle('active');

            // Toggle mobile menu
            mobileMenu.classList.toggle('active');

            // Update ARIA states
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            mobileMenu.setAttribute('aria-hidden', String(expanded));
        });

        // Close menu when clicking on mobile nav items
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// Initialize back-to-top link: jumps instantly, no animation
function initializeSmoothScrollToTop() {
    const scrollLink = document.getElementById('scroll-to-top');
    if (!scrollLink) return;

    // Remove existing listener by cloning (guards against multiple inits)
    const fresh = scrollLink.cloneNode(true);
    scrollLink.parentNode.replaceChild(fresh, scrollLink);

    fresh.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
    });
}

// Animate the nav sliding down + fading in, once per browser session. The
// `nav-intro-hidden` class + sessionStorage flag are both set synchronously
// in <head> (see partials/head.html) before the nav paints, so this only
// ever has to remove the class to trigger the reveal transition -- it never
// decides on its own whether the intro should play.
function initializeNavIntro() {
    const html = document.documentElement;
    if (!html.classList.contains('nav-intro-hidden')) return;

    const nav = document.querySelector('.nav');
    if (!nav) {
        html.classList.remove('nav-intro-hidden');
        return;
    }

    nav.classList.add('nav-intro-transition');
    requestAnimationFrame(() => {
        html.classList.remove('nav-intro-hidden');
        setTimeout(() => {
            nav.classList.remove('nav-intro-transition');
        }, 1000);
    });
}
