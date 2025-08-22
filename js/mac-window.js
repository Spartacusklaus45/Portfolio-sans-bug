document.addEventListener('DOMContentLoaded', () => {
    // Check if elements exist before adding listeners
    const macWindow = document.querySelector('.mac-window');
    if (!macWindow) return;

    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Optimize animations for mobile
    if (macWindow) {
        macWindow.style.transform = 'translateZ(0)';
        macWindow.style.webkitTransform = 'translateZ(0)';
        macWindow.style.willChange = isMobile ? 'transform' : 'auto';
    }
    
    // Reduce animation complexity on mobile
    if (isMobile) {
        document.documentElement.style.setProperty('--mac-window-animation-duration', '0.3s');
    }

    const card = document.querySelector('.card');
    const redButton = card.querySelector('.mac-header .red');
    const yellowButton = card.querySelector('.mac-header .yellow');
    const greenButton = card.querySelector('.mac-header .green');

    // Initial state
    let isMinimized = false;
    let isMaximized = false;
    let originalStyles = {
        width: window.getComputedStyle(card).width,
        height: window.getComputedStyle(card).height,
        transform: window.getComputedStyle(card).transform
    };

    // Close button (red)
    redButton.addEventListener('click', () => {
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0';
        let animationFrameId = requestAnimationFrame(function() {
            setTimeout(function() {
                card.style.display = 'none';
            }, isMobile ? 300 : 500);
        });
    });

    // Minimize button (yellow)
    yellowButton.addEventListener('click', () => {
        // Use requestAnimationFrame for smooth animations
        let animationFrameId;
        
        function animateWindow() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (!isMinimized) {
                card.style.transform = 'scale(0.8) translateY(100%)';
                isMinimized = true;
            } else {
                card.style.transform = 'none';
                isMinimized = false;
            }
        }
        animationFrameId = requestAnimationFrame(animateWindow);
    });

    // Maximize button (green)
    greenButton.addEventListener('click', () => {
        if (!isMaximized) {
            card.style.width = '95vw';
            card.style.height = '80vh';
            card.style.transform = 'scale(1)';
            isMaximized = true;
        } else {
            card.style.width = originalStyles.width;
            card.style.height = originalStyles.height;
            card.style.transform = originalStyles.transform;
            isMaximized = false;
        }
    });

    // Add hover effects to buttons
    [redButton, yellowButton, greenButton].forEach(button => {
        button.style.cursor = 'pointer';
        button.addEventListener('mouseenter', () => {
            button.style.filter = 'brightness(1.2)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.filter = 'none';
        });
    });
});
