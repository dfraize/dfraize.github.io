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

// Triple-tap easter egg on header logo (mobile-friendly)
function initializeLogoTripleTapSecret() {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch) return; // Do not affect desktop clicks

    const resolveUrl = (url) => {
        try {
            if (typeof prefixIfRelative === 'function') {
                return prefixIfRelative(url);
            }
        } catch (e) {}
        return url;
    };

    const resolveSecretUrl = () => resolveUrl('workouts/workout-list.html');

    const attachHandlers = () => {
        const logoLink = document.querySelector('.logo-link');
        if (!logoLink) return false;

        let tapCount = 0;
        let firstTapTime = 0;
        let singleTapTimerId = null;
        const tripleTapWindowMs = 700; // time from 1st to 3rd tap
        const singleTapDelayMs = 420;  // wait to see if more taps arrive

        const reset = () => {
            tapCount = 0;
            firstTapTime = 0;
            if (singleTapTimerId) clearTimeout(singleTapTimerId);
            singleTapTimerId = null;
        };

        const onTouchEnd = () => {
            const now = Date.now();

            if (!firstTapTime || (now - firstTapTime) > tripleTapWindowMs) {
                // Start new sequence
                firstTapTime = now;
                tapCount = 1;

                // Schedule normal navigation if no more taps
                if (singleTapTimerId) clearTimeout(singleTapTimerId);
                singleTapTimerId = setTimeout(() => {
                    const href = logoLink.getAttribute('href') || 'index.html';
                    window.location.href = resolveUrl(href);
                    reset();
                }, singleTapDelayMs);
                return;
            }

            // Within the triple-tap window
            tapCount += 1;

            if (tapCount === 2) {
                // Keep waiting; no action yet (singleTap still scheduled)
                return;
            }

            if (tapCount === 3 && (now - firstTapTime) <= tripleTapWindowMs) {
                // Trigger secret
                if (singleTapTimerId) clearTimeout(singleTapTimerId);
                window.location.href = resolveSecretUrl();
                reset();
            }
        };

        // Prevent the default anchor click during touch flows; we'll navigate manually
        const onClick = (e) => {
            if (isTouch) {
                e.preventDefault();
            }
        };

        logoLink.addEventListener('touchend', onTouchEnd, { passive: true });
        logoLink.addEventListener('click', onClick, { capture: true });

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