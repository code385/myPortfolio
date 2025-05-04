document.addEventListener('DOMContentLoaded', function() {
    // Floating effect for contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100);
        
        // Add floating animation
        card.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite alternate`;
    });
    
    // Add CSS for floating animation
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
        }
        
        .contact-card.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .contact-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
    `;
    
    document.head.appendChild(floatStyle);
    
    // Add 3D tilt effect for contact cards
    contactCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Enhance form input labels
    const formInputs = document.querySelectorAll('.input-animate input, .input-animate textarea');
    
    formInputs.forEach(input => {
        // Check if input has value on page load
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('has-value');
        }
        
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            
            if (input.value.trim() !== '') {
                input.parentElement.classList.add('has-value');
            } else {
                input.parentElement.classList.remove('has-value');
            }
        });
    });
    
    // Add CSS for form animations
    const formStyle = document.createElement('style');
    formStyle.textContent = `
        .input-animate {
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .input-animate.focused label {
            color: #3b82f6;
            transform: translateY(-25px) scale(0.8);
        }
        
        .input-animate.has-value label {
            transform: translateY(-25px) scale(0.8);
        }
        
        .input-animate.textarea.focused label,
        .input-animate.textarea.has-value label {
            transform: translateY(-25px) scale(0.8);
        }
    `;
    
    document.head.appendChild(formStyle);
    
    // Animate social grid items
    const socialItems = document.querySelectorAll('.social-item');
    
    socialItems.forEach((item, index) => {
        // Add staggered animation delay
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.4s ease ${0.3 + index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 500);
    });
    
    // Form validation and submission animation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.parentElement.classList.add('error');
                    
                    // Add error message
                    let errorMsg = input.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.classList.add('error-message');
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.color = '#ef4444';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.position = 'absolute';
                        errorMsg.style.bottom = '-20px';
                        errorMsg.style.left = '0';
                        input.parentElement.appendChild(errorMsg);
                    }
                } else {
                    input.parentElement.classList.remove('error');
                    const errorMsg = input.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // Show success animation
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
                    
                    // Clear form
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.parentElement.classList.remove('has-value');
                    });
                    
                    // Reset button after some time
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Map overlay effect
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        const overlay = mapContainer.querySelector('.map-overlay');
        const overlayContent = overlay.querySelector('.overlay-content');
        
        // Initial state
        overlayContent.style.opacity = '0';
        overlayContent.style.transform = 'translateY(20px)';
        
        mapContainer.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            overlayContent.style.opacity = '1';
            overlayContent.style.transform = 'translateY(0)';
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            overlayContent.style.opacity = '0';
            overlayContent.style.transform = 'translateY(20px)';
        });
    }
    
    // Parallax effect for background shapes
    const contactSection = document.querySelector('.contact');
    const shapes = document.querySelectorAll('.contact-background-shapes .shape');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = 1 + index * 0.5;
            const xOffset = (x - 0.5) * speed * 50;
            const yOffset = (y - 0.5) * speed * 50;
            
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}); 