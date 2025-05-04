document.addEventListener('DOMContentLoaded', function() {
    // Project filtering functionality
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('projectSearch');
    
    // Get the All Projects category and ensure it's active by default
    const allProjectsCategory = document.querySelector('.project-category[data-category="all"]');
    if (allProjectsCategory) {
        allProjectsCategory.classList.add('active');
    }
    
    // Set the "all" tab as active by default
    projectTabs.forEach(tab => {
        if (tab.getAttribute('data-filter') === 'all') {
            tab.classList.add('active');
        }
    });
    
    // Improved touch handling for mobile devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Helper function for smooth animations
    const animateCards = (cards, isVisible) => {
        cards.forEach(card => {
            if (isVisible) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };
    
    // Initialize project filtering with improved event handling
    projectTabs.forEach(tab => {
        const eventType = isTouchDevice ? 'touchend' : 'click';
        
        tab.addEventListener(eventType, function(e) {
            if (isTouchDevice) {
                e.preventDefault();
            }
            
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            projectTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show the "all" category only
            const projectCategories = document.querySelectorAll('.project-category');
            projectCategories.forEach(category => {
                if (category.getAttribute('data-category') === 'all') {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });
            
            // Filter cards within the "all" category based on tags
            filterProjectCards(filter);
        });
    });
    
    // Initialize project search with debounce for better performance
    if (searchInput) {
        let debounceTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                searchProjects(searchTerm);
            }, 300);
        });
    }
    
    // Filter project cards based on tag filter
    function filterProjectCards(filter) {
        const allCategoryCards = document.querySelectorAll('.project-category[data-category="all"] .project-card');
        
        // Handle "all" filter for better performance
        if (filter === 'all') {
            animateCards(allCategoryCards, true);
            return;
        }
        
        // Filter cards based on tags
        allCategoryCards.forEach(card => {
            const tags = card.getAttribute('data-tags') || '';
            const isVisible = tags.includes(filter);
            
            if (isVisible) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Search projects based on search term with improved performance
    function searchProjects(searchTerm) {
        // Show the "all" category when searching
        const projectCategories = document.querySelectorAll('.project-category');
        projectCategories.forEach(category => {
            if (category.getAttribute('data-category') === 'all') {
                category.classList.add('active');
            } else {
                category.classList.remove('active');
            }
        });
        
        // Then filter the cards within the "all" category
        const allCategoryCards = document.querySelectorAll('.project-category[data-category="all"] .project-card');
        
        // If empty search term, show all cards
        if (searchTerm === '') {
            animateCards(allCategoryCards, true);
            return;
        }
        
        allCategoryCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const tags = card.getAttribute('data-tags') || '';
            const isVisible = cardText.includes(searchTerm) || tags.includes(searchTerm);
            
            if (isVisible) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Enhance project cards for better touch experience
    if (isTouchDevice) {
        projectCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 300);
            });
        });
    }
    
    // Video controls
    const videoElements = document.querySelectorAll('.project-image video');
    const playButtons = document.querySelectorAll('.video-play-pause');
    
    playButtons.forEach((button, index) => {
        if (videoElements[index]) {
            button.addEventListener('click', function() {
                const video = videoElements[index];
                const icon = this.querySelector('i');
                
                if (video.paused) {
                    video.play();
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                } else {
                    video.pause();
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            });
        }
    });
    
    // Project cards staggered animation on scroll
    const projectCardsArray = Array.from(projectCards);
    
    const cardObserver = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, 100 * index);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    projectCardsArray.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        cardObserver.observe(card);
    });
    
    // Add animate class to cards that are visible
    const animateCards = () => {
        projectCardsArray.forEach((card, index) => {
            if (card.getBoundingClientRect().top < window.innerHeight * 0.9) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            }
        });
    };
    
    // Call once on page load
    setTimeout(animateCards, 300);
    
    // Add 3D tilt effect to project cards
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate rotation values
            const rotateY = (mouseX - cardCenterX) / 20;
            const rotateX = (cardCenterY - mouseY) / 20;
            
            // Apply rotation and transform to card
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    // Add spotlight effect on mouse movement in the projects section
    const projectsSection = document.querySelector('.projects');
    
    if (projectsSection) {
        projectsSection.addEventListener('mousemove', e => {
            // Create spotlight if it doesn't exist
            let spotlight = document.querySelector('.projects-spotlight');
            
            if (!spotlight) {
                spotlight = document.createElement('div');
                spotlight.classList.add('projects-spotlight');
                spotlight.style.position = 'absolute';
                spotlight.style.width = '300px';
                spotlight.style.height = '300px';
                spotlight.style.borderRadius = '50%';
                spotlight.style.background = 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)';
                spotlight.style.pointerEvents = 'none';
                spotlight.style.zIndex = '1';
                spotlight.style.transform = 'translate(-50%, -50%)';
                spotlight.style.opacity = '0';
                spotlight.style.transition = 'opacity 0.3s ease';
                document.body.appendChild(spotlight);
            }
            
            // Position spotlight at mouse position
            spotlight.style.left = `${e.pageX}px`;
            spotlight.style.top = `${e.pageY}px`;
            spotlight.style.opacity = '1';
            
            // Clear previous timeout
            if (spotlight.timeout) {
                clearTimeout(spotlight.timeout);
            }
            
            // Set timeout to fade out spotlight
            spotlight.timeout = setTimeout(() => {
                spotlight.style.opacity = '0';
            }, 300);
        });
    }
    
    // Create a marquee effect for tech stack tags
    projectCards.forEach(card => {
        const techStack = card.querySelector('.tech-stack');
        if (techStack && techStack.scrollWidth > techStack.clientWidth) {
            techStack.style.animation = 'marquee 10s linear infinite';
            techStack.style.paddingLeft = '20px';
            
            // Duplicate content for seamless scrolling
            const tags = Array.from(techStack.children);
            tags.forEach(tag => {
                const clone = tag.cloneNode(true);
                techStack.appendChild(clone);
            });
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `;
            document.head.appendChild(style);
            
            // Pause animation on hover
            techStack.addEventListener('mouseenter', () => {
                techStack.style.animationPlayState = 'paused';
            });
            
            techStack.addEventListener('mouseleave', () => {
                techStack.style.animationPlayState = 'running';
            });
        }
    });
    
    // Background shapes parallax effect
    const shapes = document.querySelectorAll('.projects-background-shapes .shape');
    
    window.addEventListener('mousemove', e => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.2;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}); 