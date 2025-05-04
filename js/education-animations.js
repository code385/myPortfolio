document.addEventListener('DOMContentLoaded', function() {
    // Optimize timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Optimize initial state setup
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    // Optimize timeline item initialization
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.4s ease';
        observer.observe(item);
    });
    
    // Optimize stats animation
    const statValues = document.querySelectorAll('.stat-value');
    
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const value = entry.target.innerHTML;
                
                // Check if the value is a grade (A, B, etc.)
                const isGrade = /^[A-F][+-]?$/.test(value.trim());
                
                if (isGrade) {
                    // No need to animate grades, just mark as counted
                    entry.target.classList.add('counted');
                } else {
                    // Animate numeric values
                    const endValue = parseFloat(value.replace('%', ''));
                    const isCGPA = value.includes('.');
                    const isPercentage = value.includes('%');
                    
                    entry.target.classList.add('counted');
                    entry.target.setAttribute('data-count', endValue);
                    
                    if (isCGPA) {
                        animateCGPA(entry.target, 0, endValue, 1000);
                    } else if (isPercentage) {
                        animateValue(entry.target, 0, endValue, 1000, '%');
                    } else {
                        animateValue(entry.target, 0, endValue, 1000, '');
                    }
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '20px'
    });
    
    statValues.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Optimized animation functions
    function animateCGPA(obj, start, end, duration) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = progress * (end - start) + start;
            obj.innerHTML = value.toFixed(2);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }
    
    function animateValue(obj, start, end, duration, suffix) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.round(progress * (end - start) + start);
            obj.innerHTML = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure final value is exactly the target value
                obj.innerHTML = end + suffix;
            }
        };
        requestAnimationFrame(update);
    }
    
    // Animate course cards with staggered delay
    const courseCards = document.querySelectorAll('.course-card');
    const courseObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, 100 * Array.from(courseCards).indexOf(entry.target));
                courseObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    courseCards.forEach(card => {
        courseObserver.observe(card);
    });
    
    // Add hover effects for course icons
    courseCards.forEach(card => {
        const icon = card.querySelector('.course-icon');
        
        card.addEventListener('mouseenter', () => {
            icon.classList.add('animate-icon');
        });
        
        card.addEventListener('mouseleave', () => {
            icon.classList.remove('animate-icon');
        });
    });
    
    // Add spotlight effect on mouse move
    const educationSection = document.querySelector('.education');
    
    educationSection.addEventListener('mousemove', (e) => {
        const spotlight = document.createElement('div');
        spotlight.classList.add('spotlight');
        educationSection.appendChild(spotlight);
        
        spotlight.style.left = e.pageX + 'px';
        spotlight.style.top = e.pageY + 'px';
        
        setTimeout(() => {
            spotlight.remove();
        }, 1500);
    });
    
    // Add scroll indicator to education section
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const educationOffset = educationSection.offsetTop;
        const educationHeight = educationSection.offsetHeight;
        
        if (scrollTop > educationOffset && scrollTop < educationOffset + educationHeight) {
            const scrollPercentage = (scrollTop - educationOffset) / educationHeight * 100;
            document.documentElement.style.setProperty('--education-scroll', scrollPercentage + '%');
        }
    });
}); 