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
    initializePageFadeEnter();
    setActiveNavItem();
    initializeHamburgerMenu();
    initializeSmoothScrollToTop();
    initializePageFadeLeave();
});

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

// Initialize smooth scroll behavior for footer back-to-top link
function initializeSmoothScrollToTop() {
    const scrollLink = document.getElementById('scroll-to-top');
    if (!scrollLink) return;

    // Remove existing listener by cloning (guards against multiple inits)
    const fresh = scrollLink.cloneNode(true);
    scrollLink.parentNode.replaceChild(fresh, scrollLink);

    fresh.addEventListener('click', function(event) {
        event.preventDefault();
        smoothScrollToTop(1200);
    });
}

// Smoothly scrolls to the top with configurable duration (ms)
function smoothScrollToTop(duration) {
    const startY = window.scrollY || document.documentElement.scrollTop || 0;
    if (startY === 0) return;

    const startTime = performance.now();
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const currentY = Math.round(startY * (1 - eased));
        window.scrollTo(0, currentY);
        if (elapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Apply initial fade-in on page load
function initializePageFadeEnter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const body = document.body;
    body.classList.add('page-fade-enter');
    // Next frame, activate transition class
    requestAnimationFrame(() => {
        body.classList.add('page-fade-enter-active');
        // Clean up after transition
        setTimeout(() => {
            body.classList.remove('page-fade-enter');
            body.classList.remove('page-fade-enter-active');
        }, 350);
    });
}

// Intercept internal links to apply fade-out before navigation
function initializePageFadeLeave() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('click', function(e) {
        // Only handle left-clicks on anchor tags without modifiers
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const anchor = e.target.closest('a[href]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        // Ignore anchors that are hashes, mailto, tel, external, or open in new tab
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (anchor.target === '_blank') return;
        const url = new URL(prefixIfRelative(href), window.location.origin);
        if (url.origin !== window.location.origin) return;

        // Perform leave transition
        e.preventDefault();
        const body = document.body;
        body.classList.add('page-fade-leave');
        // Next frame to trigger transition
        requestAnimationFrame(() => {
            body.classList.add('page-fade-leave-active');
            setTimeout(() => {
                window.location.href = href;
            }, 250);
        });
    }, { capture: true });
}
