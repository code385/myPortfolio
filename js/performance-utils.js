/**
 * Performance Utilities
 * This file contains functions to improve website performance.
 */

// Use this script on all pages to improve performance

(function() {
    'use strict';
    
    /**
     * Lazy Load Images
     * Efficiently loads images only when they're about to enter the viewport
     */
    const lazyLoadImages = () => {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // If it has a data-src, load the image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // If it has a data-srcset, apply it
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        // Stop observing the image
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Load images 50px before they enter the viewport
                threshold: 0.01 // Trigger when at least 1% of the image is visible
            });
            
            // Select all images with data-src attribute
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            let lazyLoadThrottleTimeout;
            
            const lazyLoad = () => {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }
                
                lazyLoadThrottleTimeout = setTimeout(() => {
                    const scrollTop = window.pageYOffset;
                    const lazyImages = document.querySelectorAll('img[data-src]');
                    
                    lazyImages.forEach(img => {
                        if (img.offsetTop < (window.innerHeight + scrollTop + 100)) {
                            img.src = img.dataset.src;
                            if (img.dataset.srcset) {
                                img.srcset = img.dataset.srcset;
                                img.removeAttribute('data-srcset');
                            }
                            img.removeAttribute('data-src');
                        }
                    });
                    
                    if (lazyImages.length === 0) { 
                        document.removeEventListener('scroll', lazyLoad);
                        window.removeEventListener('resize', lazyLoad);
                        window.removeEventListener('orientationChange', lazyLoad);
                    }
                }, 20);
            };
            
            document.addEventListener('scroll', lazyLoad);
            window.addEventListener('resize', lazyLoad);
            window.addEventListener('orientationChange', lazyLoad);
            lazyLoad();
        }
    };
    
    /**
     * Defer Non-Critical JavaScript
     * Load non-critical scripts after the page has loaded
     */
    const loadDeferredScripts = () => {
        const deferredScripts = document.querySelectorAll('script[data-defer]');
        
        deferredScripts.forEach(script => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'data-defer') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            // Set the script content if it's an inline script
            if (script.innerHTML) {
                newScript.innerHTML = script.innerHTML;
            }
            
            // Replace the original script
            script.parentNode.replaceChild(newScript, script);
        });
    };
    
    /**
     * Add Prefetch for Navigation
     * Prefetch pages the user is likely to navigate to
     */
    const setupLinkPrefetching = () => {
        // Only prefetch on fast connections
        if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g'))) {
            return;
        }
        
        // Add prefetch for main navigation links
        const prefetchLinks = document.querySelectorAll('nav a');
        
        setTimeout(() => {
            prefetchLinks.forEach(link => {
                // Don't prefetch the current page
                if (link.href !== window.location.href) {
                    const prefetchLink = document.createElement('link');
                    prefetchLink.rel = 'prefetch';
                    prefetchLink.href = link.href;
                    document.head.appendChild(prefetchLink);
                }
            });
        }, 2000); // Delay prefetching to prioritize current page resources
    };
    
    /**
     * Optimize AOS animations
     * Improve performance of Animate on Scroll library
     */
    const optimizeAOS = () => {
        if (typeof AOS !== 'undefined') {
            // Reduce DOM operations for animations
            AOS.init({
                once: true, // Only animate elements once
                disable: 'mobile', // Disable on mobile for better performance
                throttleDelay: 99, // Increase throttle delay
                offset: 120,
                delay: 50,
                duration: 600
            });
        }
    };
    
    /**
     * Optimize Particles.js
     * Improve performance of particles.js animation
     */
    const optimizeParticles = () => {
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            // More efficient particles configuration
            const particlesConfig = {
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: '#3b82f6' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: '#3b82f6', opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
                },
                interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false } } },
                retina_detect: false // Disable retina detection for better performance
            };
            
            particlesJS('particles-js', particlesConfig);
        }
    };
    
    /**
     * Main init function
     * Initialize all performance optimizations
     */
    const initPerformanceOptimizations = () => {
        // Run optimizations when DOM is fully loaded
        window.addEventListener('load', () => {
            lazyLoadImages();
            loadDeferredScripts();
            setupLinkPrefetching();
            optimizeAOS();
            
            // Slight delay for particles optimization
            setTimeout(optimizeParticles, 500);
            
            // Report performance metrics if browser supports Performance API
            if (window.performance && window.performance.mark) {
                window.performance.mark('fully-loaded');
                console.log('Page fully loaded and optimized');
            }
        });
    };
    
    // Initialize optimizations
    initPerformanceOptimizations();
})(); 