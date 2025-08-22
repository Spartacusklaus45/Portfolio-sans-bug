document.addEventListener('DOMContentLoaded', function() {
    // Throttle scroll events for better performance
    let ticking = false;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize variables for scroll handling
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    let lastKnownScrollPosition = 0;
    let lastScrollTime = Date.now();
    const scrollThreshold = 50; // ms between scroll events
    
    // Optimized IntersectionObserver with better performance options
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (prefersReducedMotion) {
                        // Immediately show without animation
                        entry.target.classList.add('visible');
                        entry.target.style.transform = 'translateZ(0)';
                        entry.target.style.webkitTransform = 'translateZ(0)';
                    } else {
                        // Use requestAnimationFrame for smooth animation
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                            entry.target.style.transform = 'translateZ(0)';
                            entry.target.style.webkitTransform = 'translateZ(0)';
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            rootMargin: '50px',
            threshold: 0.1,
            root: null
        }
    );

    // Observe elements
    animatedElements.forEach(el => observer.observe(el));

    function handleScroll(scrollPos) {
        const now = Date.now();
        if (now - lastScrollTime < scrollThreshold) return;
        lastScrollTime = now;

        // Navbar background change with hardware acceleration
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY;

        // Add background to navbar on scroll - optimized for mobile
        if (scrolled > 50) {
            if (!navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.add('navbar-scrolled');
                navbar.style.transform = 'translateZ(0)';
                navbar.style.webkitTransform = 'translateZ(0)';
                navbar.style.willChange = 'transform, background-color';
            }
        } else {
            if (navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.remove('navbar-scrolled');
                navbar.style.willChange = 'auto';
            }
        }
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
                handleScroll(scrollPos);
                ticking = false;
            });
            ticking = true;
        }
    }

    // Add passive scroll listener for better performance
    window.addEventListener('scroll', onScroll, { passive: true });

    // Get all links with hash
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click event to each link
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                if (prefersReducedMotion) {
                    // Instant scroll for reduced motion preference
                    targetSection.scrollIntoView({
                        block: 'start'
                    });
                } else {
                    // Smooth scroll with optimized performance
                    const targetPosition = targetSection.offsetTop;
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = Math.min(800, Math.abs(distance));
                    let start = null;

                    function step(timestamp) {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        const percentage = Math.min(progress / duration, 1);
                        
                        window.scrollTo({
                            top: startPosition + distance * easeOutCubic(percentage),
                            behavior: 'instant'
                        });
                        
                        if (progress < duration) {
                            requestAnimationFrame(step);
                        }
                    }

                    requestAnimationFrame(step);
                }
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    requestAnimationFrame(() => {
                        mobileMenu.classList.add('hidden');
                    });
                }
            }
        });
    });

    // Easing function for smooth scrolling
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
});
