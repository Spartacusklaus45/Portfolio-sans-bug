document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const whatsappButton = form.querySelector('.download-button');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Add animation class when inputs are focused
    const inputs = [nameInput, emailInput, messageInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        }
    });

    // Handle WhatsApp button click
    whatsappButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Validate form
        if (!name || !email || !message) {
            alert('Veuillez remplir tous les champs du formulaire.');
            return;
        }
        
        // Format WhatsApp message
        const whatsappMessage = `Bonjour Marcel,\n\nJe suis ${name} (${email}).\n\nMessage: ${message}`;
        
        // Create WhatsApp URL with phone number and encoded message
        const whatsappUrl = `https://wa.me/2250172480623?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Reset form
        form.reset();
    });
});
