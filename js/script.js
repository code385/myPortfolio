// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with optimized settings
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
        offset: 50,
        delay: 50,
        disable: 'mobile'
    });

    // Optimized particles.js configuration
    if(document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            particles: {
                number: { 
                    value: 40, // Reduced number of particles
                    density: { 
                        enable: true, 
                        value_area: 800 
                    } 
                },
                color: { value: "#ffffff" },
                shape: {
                    type: "circle",
                    stroke: { width: 0, color: "#000000" },
                },
                opacity: {
                    value: 0.2,
                    random: false,
                    anim: { 
                        enable: false 
                    }
                },
                size: {
                    value: 2,
                    random: true,
                    anim: { 
                        enable: false 
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: false // Disable retina detection for better performance
        });
    }

    // Mobile menu toggle functionality
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        // Log to confirm script is running
        console.log('Menu button found:', menuBtn);
        
        // Initialize menu state correctly
        const setMenuState = (isOpen) => {
            if (isOpen) {
                navLinks.classList.add('active');
                menuBtn.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scrolling when menu is open
                
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            } else {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = ''; // Restore body scrolling
                
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        };
        
        // Click handler for menu button
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            console.log('Menu button clicked');
            const isMenuOpen = navLinks.classList.contains('active');
            setMenuState(!isMenuOpen);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                setMenuState(false);
            }
        });
        
        // Close menu when escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });
    }
    
    // Ensure menu functionality works on all pages
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const menuBtn = document.querySelector('.menu-btn');
                const navLinks = document.querySelector('.nav-links');
                
                if (navLinks) {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = ''; // Restore body scrolling
                }
                
                if (menuBtn) {
                    menuBtn.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Scroll header effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Typed.js initialization for typing effect on homepage
    if (document.querySelector('.typing-text')) {
        new Typed('.typing-text', {
            strings: [
                "Web Developer",
                "Mobile App Developer",
                "UI/UX Designer",
                "Software Engineer"
            ],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 1000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Animate skill bars if on skills page
    if (document.querySelector('.skill-progress')) {
        animateSkillBars();
    }

    // Project filter functionality if on projects page
    if (document.querySelector('.project-tabs')) {
        initializeProjectTabs();
    }
    
    // Mobile touch support for skill cards
    initializeSkillCardTouch();
});

// Add touch support for skill cards on mobile
function initializeSkillCardTouch() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (document.querySelector('.skill-card')) {
        const skillCards = document.querySelectorAll('.skill-card');
        
        skillCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Close any other open cards
                skillCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active-mobile');
                    }
                });
                
                // Toggle the active state
                this.classList.toggle('active-mobile');
            });
            
            // Handle close button click more effectively
            const hoverInfo = card.querySelector('.skill-hover-info');
            if (hoverInfo) {
                hoverInfo.addEventListener('click', function(e) {
                    // Check if click was on or near the close button (×)
                    const closeBtn = e.target;
                    if (closeBtn.tagName === 'DIV' && 
                        ((e.clientX > this.getBoundingClientRect().right - 40 && 
                         e.clientY < this.getBoundingClientRect().top + 40) ||
                         closeBtn === this)) {
                        card.classList.remove('active-mobile');
                        e.stopPropagation();
                    }
                });
            }
        });
        
        // Close all cards when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.skill-card') && !e.target.closest('.skill-hover-info')) {
                skillCards.forEach(card => {
                    card.classList.remove('active-mobile');
                });
            }
        });
        
        // Add swipe down to close functionality
        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        
        let xDown = null;
        let yDown = null;
        
        function handleTouchStart(evt) {
            const firstTouch = evt.touches[0];
            xDown = firstTouch.clientX;
            yDown = firstTouch.clientY;
        }
        
        function handleTouchMove(evt) {
            if (!xDown || !yDown) {
                return;
            }
            
            const xUp = evt.touches[0].clientX;
            const yUp = evt.touches[0].clientY;
            
            const xDiff = xDown - xUp;
            const yDiff = yDown - yUp;
            
            // Detect swipe down on active card info
            if (Math.abs(xDiff) < Math.abs(yDiff) && yDiff < -50) {
                if (evt.target.closest('.skill-hover-info')) {
                    const card = evt.target.closest('.skill-card');
                    if (card) {
                        card.classList.remove('active-mobile');
                    }
                }
            }
            
            xDown = null;
            yDown = null;
        }
    }
}

// Animate skill bars in the Skills section
function animateSkillBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
            bar.style.transition = 'width 1.5s cubic-bezier(0.1, 0.8, 0.2, 1)';
        }, 300);
    });
}

// Initialize project category tabs
function initializeProjectTabs() {
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectCategories = document.querySelectorAll('.project-category');
    
    projectTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            projectTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Hide all categories
            projectCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            // Show matching category
            const categoryToShow = document.querySelector(`.project-category[data-category="${filter}"]`);
            if (categoryToShow) {
                categoryToShow.classList.add('active');
            } else {
                document.querySelector('.project-category[data-category="all"]').classList.add('active');
            }
        });
    });

    // Project search functionality
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags') || '';
                const title = card.querySelector('.project-header h3').textContent.toLowerCase();
                const content = card.querySelector('.project-content p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Contact form input animation if on contact page
if (document.querySelector('.input-animate')) {
    const inputs = document.querySelectorAll('.input-animate input, .input-animate textarea');
    
    inputs.forEach(input => {
        // Check if input has a value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
        
        // Add focus class on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove focus class if input is empty
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Form submission with basic validation for contact page
if (document.getElementById('contactForm')) {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let valid = true;
        const inputs = this.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.parentElement.classList.add('error');
            } else {
                input.parentElement.classList.remove('error');
            }
        });
        
        if (valid) {
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.classList.add('processing');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.classList.remove('processing');
                submitBtn.classList.add('success');
                submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                }, 3000);
            }, 1500);
        }
    });
} 