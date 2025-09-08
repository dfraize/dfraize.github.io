/* ===== MAIN JAVASCRIPT ENTRY POINT ===== */

/**
 * Main entry point for the portfolio site
 * Coordinates initialization of all modules
 */

// Global app namespace
window.PortfolioApp = {
    // App configuration
    config: {
        debug: false,
        version: '1.0.0'
    },

    // Initialize the application
    init: function() {
        if (this.config.debug) {
            console.log('Portfolio App initializing...');
        }

        // All initialization is handled by includes.js and lazy-loading.js
        // This serves as the main entry point for future enhancements
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.PortfolioApp.init();

    // Scroll to top handler for footer logo
    const scrollLink = document.getElementById('scroll-to-top');
    if (scrollLink) {
        scrollLink.addEventListener('click', function(event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize secret long-press on header logo to open workouts page
    initializeLogoLongPressSecret();
});

// Long-press easter egg on header logo (mobile-friendly)
function initializeLogoLongPressSecret() {
    // Use existing helper to resolve correct path depth across pages
    const resolveSecretUrl = () => {
        try {
            if (typeof prefixIfRelative === 'function') {
                return prefixIfRelative('workouts/workout-list.html');
            }
        } catch (e) {}
        return 'workouts/workout-list.html';
    };

    const attachHandlers = () => {
        const logoLink = document.querySelector('.logo-link');
        if (!logoLink) return false;

        let pressTimerId = null;
        let longPressed = false;
        const holdMs = 1600;

        const start = () => {
            clearTimeout(pressTimerId);
            longPressed = false;
            pressTimerId = setTimeout(() => {
                longPressed = true;
                window.location.href = resolveSecretUrl();
            }, holdMs);
        };

        const cancel = (e) => {
            if (pressTimerId) clearTimeout(pressTimerId);
            if (longPressed && e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        };

        // Prevent normal click after long press triggers
        logoLink.addEventListener('click', function(e) {
            if (longPressed) {
                e.preventDefault();
                longPressed = false;
            }
        }, { capture: true });

        // Touch handlers for long press
        logoLink.addEventListener('touchstart', start, { passive: true });
        logoLink.addEventListener('touchend', cancel, { passive: false });
        logoLink.addEventListener('touchcancel', cancel, { passive: true });
        logoLink.addEventListener('touchmove', cancel, { passive: true });

        return true;
    };

    if (attachHandlers()) return;

    // Header is injected asynchronously; observe until logo is available
    const headerInclude = document.getElementById('header-include');
    if (!headerInclude) return;
    const observer = new MutationObserver(() => {
        if (attachHandlers()) {
            observer.disconnect();
        }
    });
    observer.observe(headerInclude, { childList: true, subtree: true });
}