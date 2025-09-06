/* ===== LAZY LOADING MODULE ===== */

/**
 * Lazy Loading Implementation
 * Uses Intersection Observer API for performance
 * Includes fallback for older browsers
 */

class LazyLoader {
    constructor() {
        this.observer = null;
        this.imageObserver = null;
        this.init();
    }

    init() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.loadAllImages();
        }

        // Handle images that are already in viewport on page load
        this.checkImagesInViewport();

        // Watch for dynamically added images (like footer)
        this.setupMutationObserver();
    }

    setupIntersectionObserver() {
        const options = {
            root: null, // Use viewport
            rootMargin: '50px 0px', // Start loading 50px before image enters viewport
            threshold: 0.01 // Trigger when 1% of image is visible
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all lazy images
        this.observeLazyImages();
    }

    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        lazyImages.forEach(img => {
            this.observeImage(img);
        });
    }

    observeImage(img) {
        // Skip if already observed
        if (img.classList.contains('lazy-loading')) return;

        // Add loading class for styling
        img.classList.add('lazy-loading');

        // Start observing
        if (this.imageObserver) {
            this.imageObserver.observe(img);
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');

        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }

        if (srcset) {
            img.srcset = srcset;
            img.removeAttribute('data-srcset');
        }

        // If inside a <picture>, promote any <source data-srcset> to srcset
        const parent = img.parentElement;
        if (parent && parent.tagName === 'PICTURE') {
            const sources = parent.querySelectorAll('source[data-srcset]');
            sources.forEach(source => {
                const ds = source.getAttribute('data-srcset');
                if (ds) {
                    source.setAttribute('srcset', ds);
                    source.removeAttribute('data-srcset');
                }
            });
        }

        // Remove loading class and add loaded class
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');

        // Handle load/error events
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            img.classList.add('error');
            console.warn(`Failed to load image: ${src}`);
        });
    }

    checkImagesInViewport() {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            const lazyImages = document.querySelectorAll('img[data-src]');

            lazyImages.forEach(img => {
                if (this.isElementInViewport(img)) {
                    this.loadImage(img);
                    if (this.imageObserver) {
                        this.imageObserver.unobserve(img);
                    }
                }
            });
        }, 100);
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    loadAllImages() {
        // Fallback: load all images immediately
        const lazyImages = document.querySelectorAll('img[data-src]');

        lazyImages.forEach(img => {
            this.loadImage(img);
        });
    }

    setupMutationObserver() {
        // Watch for dynamically added images
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is an image with data-src
                        if (node.tagName === 'IMG' && node.hasAttribute('data-src')) {
                            this.observeImage(node);
                        }
                        // Also check for images within the added node
                        const images = node.querySelectorAll ? node.querySelectorAll('img[data-src]') : [];
                        images.forEach(img => {
                            this.observeImage(img);
                        });
                    }
                });
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}
