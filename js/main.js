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

    // Initialize secret long-press on header logo to open workouts page (mobile-friendly)
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
        const holdMs = 2000;
        let startX = 0;
        let startY = 0;
        let movedTooFar = false;
        const moveThresholdPx = 10; // allow slight finger jitter

        const start = (e) => {
            clearTimeout(pressTimerId);
            longPressed = false;
            movedTooFar = false;
            if (e && e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
            pressTimerId = setTimeout(() => {
                // Only trigger if finger hasn't moved too far
                if (!movedTooFar) {
                    longPressed = true;
                    window.location.href = resolveSecretUrl();
                }
            }, holdMs);
        };

        const cancel = (e) => {
            if (pressTimerId) clearTimeout(pressTimerId);
            if (longPressed && e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        };

        const onMove = (e) => {
            if (!pressTimerId || movedTooFar) return;
            if (e && e.touches && e.touches.length > 0) {
                const dx = e.touches[0].clientX - startX;
                const dy = e.touches[0].clientY - startY;
                if (Math.hypot(dx, dy) > moveThresholdPx) {
                    movedTooFar = true;
                    clearTimeout(pressTimerId);
                }
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
        logoLink.addEventListener('touchmove', onMove, { passive: true });

        // Prevent long-press context menu on some browsers
        logoLink.addEventListener('contextmenu', function(e) {
            if (pressTimerId) e.preventDefault();
        });

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