const texts = [
    'Spécialiste Marketing Digital',
    'Développeur Web Full-Stack',
    'Designer UI/UX',
    'Créateur de Contenu Digital',
    'Expert en Stratégie Digitale',
    'Passionné de Technologie'
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
    const typedTextSpan = document.querySelector('.typed-text');
    if (!typedTextSpan) {
        console.log('typed-text element not found, stopping animation');
        return;
    }
    
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

    setTimeout(type, typeSpeed);
}

// Add cursor style and animation
const style = document.createElement('style');
style.innerHTML = `
    .typed-text {
        border-right: 0.2em solid #0f0;
        animation: blinkCursor 0.7s step-end infinite;
    }
    @keyframes blinkCursor {
        0%, 50% { border-color: #0f0; }
        51%, 100% { border-color: transparent; }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting typing animation...');
    
    // Ensure the typed-text element exists before starting
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        console.log('Found .typed-text element, starting animation');
        setTimeout(type, 1000);
    } else {
        console.log('Element .typed-text not found');
    }
});
