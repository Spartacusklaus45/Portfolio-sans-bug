// Mobile performance optimizations with aggressive optimization

// Initialize performance monitoring
const perfMonitor = {
    marks: new Map(),
    measure: function(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            try {
                window.performance.measure(name, startMark, endMark);
            } catch (e) {}
        }
    },
    mark: function(name) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
            this.marks.set(name, performance.now());
        }
    }
};
document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile device and set aggressive optimizations
perfMonitor.mark('mobileCheckStart');

// Device and network detection
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const isSlow = connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g');

// Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Memory management
let gcTimer;
const forceGC = () => {
    if (window.gc) {
        try { window.gc(); } catch (e) {}
    }
};

// Reset GC timer
const resetGCTimer = () => {
    clearTimeout(gcTimer);
    gcTimer = setTimeout(forceGC, 30000); // Force GC every 30s
};

// Initialize performance optimization flags
const perfFlags = {
    isScrolling: false,
    lastScrollTime: 0,
    scrollThrottle: 100, // ms
    animationFrame: null
};

// Optimize scroll performance
    let ticking = false;
    let lastScrollY = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const currentScrollY = window.scrollY;
                if (currentScrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Disable heavy animations on mobile
    document.documentElement.style.setProperty('--typing-speed', '100ms');
    document.documentElement.style.setProperty('--cursor-blink-speed', '600ms');

    // Optimize image loading with priority loading
perfMonitor.mark('imageLoadStart');

// Priority-based image loading
const priorityLoad = (img) => {
    const priority = img.getAttribute('data-priority') || 'low';
    const delay = priority === 'high' ? 0 : (priority === 'medium' ? 1000 : 2000);
    
    setTimeout(() => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    }, delay);
};

// Optimize image loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));

    // Optimize animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('animated');
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // Reduce motion if user prefers
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--enable-animations', '0');
    }

    // Optimize event listeners
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Optimize resize handling
    const handleResize = debounce(() => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, 100);

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // Performance optimization cleanup
perfMonitor.mark('cleanupStart');

// Memory and event cleanup
const performanceCleanup = () => {
    // Clear unnecessary timers
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
    }

    // Clear unnecessary intervals
    const highestIntervalId = window.setInterval(() => {}, 100000);
    for (let i = highestIntervalId; i >= 0; i--) {
        window.clearInterval(i);
    }

    // Clear unnecessary animation frames
    if (perfFlags.animationFrame) {
        cancelAnimationFrame(perfFlags.animationFrame);
    }

    // Force garbage collection
    forceGC();
};

// Clean up unnecessary event listeners and animations on mobile
    const cleanupMobile = () => {
        // Remove mousemove events
        document.removeEventListener('mousemove', () => {});
        
        // Remove hover effects
        const hoverElements = document.querySelectorAll('.hover-effect');
        hoverElements.forEach(el => {
            el.classList.remove('hover-effect');
        });

        // Simplify animations
        const heavyAnimations = document.querySelectorAll('.heavy-animation');
        heavyAnimations.forEach(el => {
            el.style.animation = 'none';
            el.style.transform = 'none';
        });
    };

    // Run cleanup
    cleanupMobile();
});
