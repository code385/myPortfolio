document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Listen for the firebase-ready event
        document.addEventListener('firebase-ready', function(e) {
            console.log('Firebase ready event received:', e.detail.success);
            
            if (!e.detail.success) {
                showNotification('Firebase connection failed. Using email fallback.', 'warning');
                // Switch to email fallback mode
                enableEmailFallback();
            }
        });
        
        // Check if Firebase is working after 3 seconds, if not, enable fallback
        setTimeout(function() {
            if (!window.db) {
                console.log('Firebase not initialized after timeout, enabling fallback');
                showNotification('Firebase connection timed out. Using email fallback.', 'warning');
                enableEmailFallback();
            }
        }, 3000);
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate inputs
            if (!name || !email || !subject || !message) {
                showNotification('Please fill out all fields', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Check if we're in fallback mode
            if (contactForm.classList.contains('email-fallback-mode')) {
                // Handle form submission via mailto link
                try {
                    // Create a clean message text
                    const mailtoSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
                    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                    
                    // Create mailto link
                    const mailtoLink = `mailto:ranairfan1074@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
                    
                    // Open the user's email client
                    window.location.href = mailtoLink;
                    
                    // Show success message
                    showNotification('Email client opened! Please send the email to complete your message.', 'success');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset all input parent classes
                    const inputs = contactForm.querySelectorAll('input, textarea');
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('has-value', 'focused');
                    });
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                } catch (error) {
                    console.error('Email fallback error:', error);
                    showNotification('Error opening email client. Please email me directly.', 'error');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
                
                return;
            }
            
            try {
                // Regular Firebase flow - only try this if we're not in fallback mode
                // Check if window.db is available (set by firebase-config.js)
                if (window.db) {
                    console.log('Using global Firestore instance...');
                    await sendMessage(window.db, { name, email, subject, message });
                } else {
                    // Fallback to direct Firebase access
                    console.log('Global db not found, trying direct Firebase access...');
                    
                    if (!firebase || !firebase.firestore) {
                        throw new Error('Firebase is not initialized properly');
                    }
                    
                    const db = firebase.firestore();
                    await sendMessage(db, { name, email, subject, message });
                }
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset all input parent classes
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.parentElement.classList.remove('has-value', 'focused');
                });
                
                // Update button to show success
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
                // Log analytics event
                try {
                    if (window.firebaseAnalytics) {
                        window.firebaseAnalytics.logEvent('contact_form_submitted');
                    } else if (firebase.analytics && typeof firebase.analytics().logEvent === 'function') {
                        firebase.analytics().logEvent('contact_form_submitted');
                    }
                } catch (analyticsError) {
                    console.log('Analytics error:', analyticsError);
                }
                
            } catch (error) {
                console.error('Error submitting form:', error);
                
                // Switch to fallback mode if Firebase fails and retry submission
                if (error.code === 'unavailable' || error.message.includes('network') || 
                    error.code === 'permission-denied' || error.message.includes('Firebase')) {
                    
                    enableEmailFallback();
                    
                    // Resubmit the form using the fallback method
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    showNotification('Switching to email fallback, please try again', 'warning');
                } else {
                    // Provide more specific error messages
                    let errorMessage = 'Error sending message. Please try again.';
                    
                    if (error.code === 'permission-denied') {
                        errorMessage = 'Permission denied. The system cannot save your message at this time.';
                    } else if (error.code === 'unavailable') {
                        errorMessage = 'Service temporarily unavailable. Please try again later.';
                    } else if (error.message && error.message.includes('network')) {
                        errorMessage = 'Network error. Please check your internet connection.';
                    }
                    
                    showNotification(errorMessage, 'error');
                    
                    // Reset button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    
    // Check for animated form inputs
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
});

// Function to enable email fallback mode
function enableEmailFallback() {
    console.log('Enabling email fallback mode');
    const contactForm = document.getElementById('contactForm');
    if (contactForm && !contactForm.classList.contains('email-fallback-mode')) {
        contactForm.classList.add('email-fallback-mode');
        
        // Update submit button text
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Open Email Client</span><i class="fas fa-envelope"></i>';
        }
        
        // Add notice about fallback mode
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            // Check if notice already exists
            if (!document.querySelector('.fallback-notice')) {
                const fallbackNotice = document.createElement('div');
                fallbackNotice.className = 'fallback-notice';
                fallbackNotice.innerHTML = `
                    <p style="color: #f59e0b; margin-top: 10px; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> 
                        Using email fallback mode. Your message will open in your email client.
                    </p>
                `;
                formHeader.appendChild(fallbackNotice);
            }
        }
    }
}

// Function to send a message to Firestore
async function sendMessage(db, formData) {
    console.log('Sending message to Firestore...');
    
    try {
        // Add contact form submission to Firestore with error handling
        const result = await db.collection('contactSubmissions').add({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'unread'
        });
        
        console.log('Message sent successfully, document ID:', result.id);
        return result;
    } catch (error) {
        console.error('Firestore add error:', error);
        throw error; // Re-throw to be caught by outer catch
    }
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show notifications
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Choose icon based on type
    let icon = type === 'success' ? 'fa-check-circle' : 
              type === 'warning' ? 'fa-exclamation-triangle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification styles if not already in the CSS
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .notification.success {
                background: linear-gradient(to right, #10b981, #059669);
                color: white;
            }
            
            .notification.error {
                background: linear-gradient(to right, #ef4444, #dc2626);
                color: white;
            }
            
            .notification.warning {
                background: linear-gradient(to right, #f59e0b, #d97706);
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
            }
            
            .notification-content i {
                margin-right: 10px;
                font-size: 1.2rem;
            }
            
            .fallback-notice {
                margin-top: 10px;
                padding: 8px 12px;
                border-radius: 4px;
                background: rgba(245, 158, 11, 0.1);
                border-left: 3px solid #f59e0b;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Add notification styles on load
addNotificationStyles(); 