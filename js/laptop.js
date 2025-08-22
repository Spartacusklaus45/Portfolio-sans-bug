document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Optimize performance for mobile
    const laptop = document.querySelector('.laptop');
    if (laptop) {
        laptop.style.transform = 'translateZ(0)';
        laptop.style.webkitTransform = 'translateZ(0)';
        laptop.style.willChange = isMobile ? 'transform' : 'auto';
    }

    const screen = document.querySelector('.screen');
    const codeElements = document.querySelector('.code-elements');
    const techIcons = document.querySelectorAll('.tech-icons i');

    // Add typing effect to code elements
    let delay = 0;
    document.querySelectorAll('.code-line').forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.animation = 'typing 1s steps(40, end)';
        }, 1000 + (index * 500));
    });

    // Add hover effect on laptop
    // Throttle mousemove events for better performance
    let ticking = false;
    window.addEventListener('mousemove', function(e) {
        if (!ticking && !isMobile) {
            requestAnimationFrame(function() {
                const rect = laptop.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateX = (y - 0.5) * 10;
                const rotateY = (x - 0.5) * 10;
                
                screen.style.transform = `rotateX(${5 + rotateX}deg) rotateY(${rotateY}deg)`;
                ticking = false;
            });
            ticking = true;
        }
        
        screen.style.transform = `rotateX(${5 + rotateX}deg) rotateY(${rotateY}deg)`;
    });

    laptop.addEventListener('mouseleave', () => {
        screen.style.transform = 'rotateX(5deg) rotateY(0deg)';
    });

    // Add glow effect to tech icons
    techIcons.forEach(icon => {
        icon.addEventListener('mouseover', () => {
            icon.style.textShadow = '0 0 15px currentColor';
        });
        
        icon.addEventListener('mouseout', () => {
            icon.style.textShadow = 'none';
        });
    });
});
