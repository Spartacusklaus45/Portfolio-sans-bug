const texts = [
    'Spécialiste Marketing Digital',
    'Développeur Web',
    'Designer UI/UX',
    'Créatif & Passionné'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 150;
const erasingDelay = 100;
const newTextDelay = 2000;

// Optimize animation frames
let animationFrameId;

function type() {
    // Cancel any existing animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const typedTextSpan = document.querySelector('.typed-text');
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    animationFrameId = requestAnimationFrame(function() {
        setTimeout(function() {
            type();
        }, typeSpeed);
    });
}

// Add cursor style
const style = document.createElement('style');
style.innerHTML = `
    .typed-text {
        border-right: 0.2em solid #0f0;
        animation: blinkCursor 0.7s step-end infinite;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Adjust timing for mobile devices
    const typingSpeed = isMobile ? 100 : 50;
    const backspaceSpeed = isMobile ? 50 : 25;
    const pauseDuration = isMobile ? 1500 : 2000;

    setTimeout(type, 1000);
});
