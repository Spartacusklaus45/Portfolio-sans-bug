document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Performance optimizations
    const modals = document.querySelectorAll('.vscode-modal');
    modals.forEach(modal => {
        modal.style.transform = 'translateZ(0)';
        modal.style.webkitTransform = 'translateZ(0)';
        modal.style.willChange = isMobile ? 'transform, opacity' : 'auto';
    });
    
    // Adjust animation durations for mobile
    const transitionDuration = isMobile ? '0.2s' : '0.3s';
    
    const cards = document.querySelectorAll('.vscode-card');
    
    cards.forEach(card => {
        const maximizeBtn = card.querySelector('.btn.maximize');
        const projectId = card.getAttribute('data-project');
        
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(projectId);
        }, isMobile ? 200 : 300);
    });
});

function openModal(projectId) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById(`modal-${projectId}`);
    
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.style.display = 'block';
        
        // Optimize modal animations
        let animationFrameId;
        
        function showModal() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            
            animationFrameId = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modal.style.transition = `opacity ${transitionDuration} ease-out, transform ${transitionDuration} ease-out`;
                    overlay.style.transition = `opacity ${transitionDuration} ease-out`;
                    
                    // Force reflow
                    modal.offsetHeight;
                    
                    modal.style.display = 'block';
                    overlay.style.display = 'block';
                });
            });
        }
        
        showModal();
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(projectId);
            }
        }, isMobile ? 200 : 300);
        
        // Close on red button click
        const closeBtn = modal.querySelector('.btn.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(projectId));
        }
    }
}

function closeModal(projectId) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById(`modal-${projectId}`);
    
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.style.display = 'none';
    }
}
