// Determine base prefix for assets/partials depending on path depth
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

// Adjust relative attributes within a container (e.g., loaded partials)
function adjustRelativeAttributes(container) {
    if (!container) return;
    const elements = container.querySelectorAll('[href], [src], [data-src], source[srcset], img[srcset]');
    elements.forEach(el => {
        if (el.hasAttribute('href')) {
            el.setAttribute('href', prefixIfRelative(el.getAttribute('href')));
        }
        if (el.hasAttribute('src')) {
            el.setAttribute('src', prefixIfRelative(el.getAttribute('src')));
        }
        if (el.hasAttribute('data-src')) {
            el.setAttribute('data-src', prefixIfRelative(el.getAttribute('data-src')));
        }
        if (el.hasAttribute('srcset')) {
            const srcset = el.getAttribute('srcset');
            if (srcset && !/^(?:[a-z]+:)?\/\//i.test(srcset)) {
                const adjusted = srcset.split(',').map(part => {
                    const [u, d] = part.trim().split(/\s+/);
                    return prefixIfRelative(u) + (d ? ' ' + d : '');
                }).join(', ');
                el.setAttribute('srcset', adjusted);
            }
        }
    });
}

// Include HTML partials
async function loadInclude(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Add loading state to prevent layout shift
    element.innerHTML = '<div class="include-loading" style="height: 100px; background: transparent;"></div>';

    try {
        const response = await fetch(prefixIfRelative(filePath));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        element.innerHTML = html;

        // Fix relative paths within injected partial content
        adjustRelativeAttributes(element);

        // Set active navigation item based on current page
        setActiveNavItem();
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        // Show error state instead of leaving loading state
        element.innerHTML = '<div class="include-error" style="padding: 20px; color: #666; font-size: 14px;">Failed to load content</div>';
    }
}

// Inject shared head content
function injectSharedHead() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Define page-specific metadata
    const pageMeta = {
        'index.html': {
            title: 'Douglas Fraize - Portfolio',
            description: 'Douglas Fraize - UX Designer and Front End Developer specializing in creating beautiful, user-centered digital experiences. Portfolio featuring design systems, web applications, and UI/UX projects.'
        },
        'portfolio.html': {
            title: 'Portfolio - Douglas Fraize',
            description: 'Explore Douglas Fraize\'s portfolio of UX design and front-end development projects. Featuring work from Fidelity, FM Global, Mercer, and other leading companies.'
        },
        'about.html': {
            title: 'About - Douglas Fraize',
            description: 'Learn about Douglas Fraize, a UX designer and front-end developer with 20+ years of experience bridging design and development to create exceptional user experiences.'
        },
        'resume.html': {
            title: 'Resume - Douglas Fraize',
            description: 'Douglas Fraize\'s professional resume and experience. UX Designer and Front End Developer with expertise in design systems, user experience, and modern web technologies.'
        }
    };

    // Default meta for project pages
    const defaultMeta = {
        title: currentPage.replace('.html', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' - Douglas Fraize',
        description: currentPage.replace('.html', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' project by Douglas Fraize - UX Designer and Front End Developer'
    };

    const meta = pageMeta[currentPage] || defaultMeta;

    // Update document title
    document.title = meta.title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', meta.description);
    } else {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        metaDescription.content = meta.description;
        document.head.appendChild(metaDescription);
    }

    // Ensure essential meta tags are present
    ensureEssentialMeta();
}

// Ensure essential meta tags are present
function ensureEssentialMeta() {
    const essentialMeta = [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
    ];

    essentialMeta.forEach(meta => {
        if (meta.charset) {
            if (!document.querySelector(`meta[charset="${meta.charset}"]`)) {
                const metaTag = document.createElement('meta');
                metaTag.setAttribute('charset', meta.charset);
                document.head.insertBefore(metaTag, document.head.firstChild);
            }
        } else if (meta.name && !document.querySelector(`meta[name="${meta.name}"]`)) {
            const metaTag = document.createElement('meta');
            metaTag.name = meta.name;
            metaTag.content = meta.content;
            document.head.appendChild(metaTag);
        }
    });
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
        'mercer-evolution.html', 'mercer-worklife.html', 'mercer-fsmpro.html', 'other-work.html'
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

// Load head content
async function loadHeadContent() {
    try {
        const response = await fetch(prefixIfRelative('partials/head.html'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        // Insert the head content after the last meta tag but before title
        const head = document.head;
        const titleTag = head.querySelector('title');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Insert each element from the head partial
        Array.from(tempDiv.children).forEach(element => {
            if (titleTag) {
                head.insertBefore(element, titleTag);
            } else {
                head.appendChild(element);
            }
        });

        // Adjust any relative paths in head partial (e.g., favicon)
        adjustRelativeAttributes(document.head);
    } catch (error) {
        console.error('Error loading head content:', error);
    }
}

// Load includes when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Inject shared head content immediately
    injectSharedHead();

    // Load shared head content (CSS, fonts)
    loadHeadContent();

    // Adjust relative URLs for pages under /projects/
    adjustRelativeAttributes(document);

    // Initialize page enter fade immediately
    initializePageFadeEnter();

    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        loadInclude('header-include', 'partials/header.html');
        loadInclude('footer-include', 'partials/footer.html').then(() => {
            // Initialize smooth scroll once footer exists
            initializeSmoothScrollToTop();
        });

        // Initialize hamburger menu after includes are loaded
        setTimeout(initializeHamburgerMenu, 200);

        // Initialize link interception for leave fade
        initializePageFadeLeave();
    }, 50);
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
