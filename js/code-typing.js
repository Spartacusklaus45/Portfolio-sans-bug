document.addEventListener('DOMContentLoaded', () => {
    const codeLines = document.querySelectorAll('.code-line');
    let delay = 500;

    codeLines.forEach((line) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.animation = 'fadeIn 0.5s forwards';
        }, delay);
        delay += 200;
    });
});
