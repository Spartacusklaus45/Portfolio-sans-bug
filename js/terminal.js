document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Adjust typing speed for mobile
    const typingSpeed = isMobile ? 100 : 50;
    const cursorBlinkSpeed = isMobile ? 600 : 500;
    
    // Performance optimizations
    const terminal = document.querySelector('.terminal-container');
    if (terminal) {
        terminal.style.transform = 'translateZ(0)';
        terminal.style.webkitTransform = 'translateZ(0)';
        terminal.style.willChange = isMobile ? 'transform' : 'auto';
    }

    const terminalLoader = document.querySelector('.terminal-loader');
    const controls = {
        close: document.querySelector('.control.close'),
        minimize: document.querySelector('.control.minimize'),
        maximize: document.querySelector('.control.maximize')
    };

    let isMaximized = false;
    const originalStyles = {
        width: terminalLoader.style.width,
        height: terminalLoader.style.height,
        margin: terminalLoader.style.margin
    };

    // Optimize typing animation
    let typingFrameId;
    
    function typeText(text, element, callback) {
        if (typingFrameId) {
            cancelAnimationFrame(typingFrameId);
        }
        typingFrameId = requestAnimationFrame(function() {
            setTimeout(function() {
                // ... (rest of the typing animation code)
            }, typingSpeed);
        });
    }

    // Optimize cursor blink
    let lastBlinkTime = 0;
    function updateCursor(timestamp) {
        if (timestamp - lastBlinkTime >= cursorBlinkSpeed) {
            // ... (rest of the cursor blink code)
        }
    }

    controls.close.addEventListener('click', () => {
        terminalLoader.style.animation = 'terminalClose 0.3s ease-in forwards';
    });

    controls.minimize.addEventListener('click', () => {
        terminalLoader.style.animation = 'terminalMinimize 0.3s ease-in forwards';
    });

    controls.maximize.addEventListener('click', () => {
        if (!isMaximized) {
            terminalLoader.style.transition = 'all 0.3s ease';
            terminalLoader.style.width = '100%';
            terminalLoader.style.height = '100vh';
            terminalLoader.style.margin = '0';
            terminalLoader.style.borderRadius = '0';
            isMaximized = true;
        } else {
            terminalLoader.style.transition = 'all 0.3s ease';
            terminalLoader.style.width = originalStyles.width;
            terminalLoader.style.height = originalStyles.height;
            terminalLoader.style.margin = originalStyles.margin;
            terminalLoader.style.borderRadius = '8px';
            isMaximized = false;
        }
    });
});
