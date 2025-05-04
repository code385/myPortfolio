document.addEventListener('DOMContentLoaded', function() {
    // Initialize fading timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Set initial state for all timeline items (opacity 0, translateY 30px)
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.15}s`;
    });
    
    // Create an intersection observer for timeline items
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each timeline item
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Add hover effect for experience list items
    const expListItems = document.querySelectorAll('.experience-list li');
    
    expListItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            icon.classList.add('pulse');
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            icon.classList.remove('pulse');
        });
    });
    
    // Add CSS animation for pulsing icons
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 0.5s ease-in-out;
        }
        
        .timeline-dot {
            transition: transform 0.3s ease, background 0.3s ease, color 0.3s ease;
        }
        
        .timeline-content {
            position: relative;
            overflow: hidden;
        }
        
        .timeline-content::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            transform: translateX(-100%);
            transition: transform 0.5s ease;
        }
        
        .timeline-item:hover .timeline-content::after {
            transform: translateX(0);
        }
    `;
    
    document.head.appendChild(style);
    
    // Add parallax effect to background shapes
    const experienceSection = document.querySelector('.experience');
    const shapes = document.querySelectorAll('.experience-background-shapes .shape');
    
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
    
    // Add spotlight effect on mouse movement
    experienceSection.addEventListener('mousemove', (e) => {
        // Check if we already have a spotlight
        let spotlight = document.querySelector('.exp-spotlight');
        
        if (!spotlight) {
            spotlight = document.createElement('div');
            spotlight.classList.add('exp-spotlight');
            document.body.appendChild(spotlight);
            
            // Add spotlight styles
            spotlight.style.position = 'absolute';
            spotlight.style.width = '250px';
            spotlight.style.height = '250px';
            spotlight.style.borderRadius = '50%';
            spotlight.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 30%, rgba(255, 255, 255, 0) 70%)';
            spotlight.style.pointerEvents = 'none';
            spotlight.style.zIndex = '0';
            spotlight.style.transform = 'translate(-50%, -50%)';
            spotlight.style.transition = 'opacity 0.3s ease';
            spotlight.style.opacity = '0';
        }
        
        // Position the spotlight at the cursor
        spotlight.style.left = `${e.pageX}px`;
        spotlight.style.top = `${e.pageY}px`;
        spotlight.style.opacity = '1';
        
        // Clear previous timeout
        if (spotlight.timeout) {
            clearTimeout(spotlight.timeout);
        }
        
        // Set a timeout to fade out the spotlight
        spotlight.timeout = setTimeout(() => {
            spotlight.style.opacity = '0';
        }, 500);
    });
    
    // Animate experience dates on scroll
    const timelineDates = document.querySelectorAll('.timeline-date h3');
    
    const dateObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('highlight-date');
                setTimeout(() => {
                    entry.target.classList.remove('highlight-date');
                }, 1000);
                dateObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });
    
    timelineDates.forEach(date => {
        dateObserver.observe(date);
    });
    
    // Add style for highlighted dates
    const dateStyle = document.createElement('style');
    dateStyle.textContent = `
        @keyframes dateHighlight {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .highlight-date {
            animation: dateHighlight 0.5s ease-in-out;
        }
    `;
    
    document.head.appendChild(dateStyle);
}); 