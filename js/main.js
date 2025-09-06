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
});