document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple blog initialized');
    
    // Get DOM elements
    const blogGrid = document.getElementById('blogGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Track all posts and current filters
    let allPosts = [];
    let currentCategory = 'all';
    let searchQuery = '';
    
    // Show loading indicator
    if (blogGrid) {
        blogGrid.innerHTML = '<div class="loading">Testing connection...</div>';
    } else {
        console.error('Blog grid element not found');
        return;
    }
    
    // This function displays error messages
    function showError(message, details = '') {
        console.error(message, details);
        blogGrid.innerHTML = `
            <div class="error-container">
                <h3>Unable to load blog posts</h3>
                <p>${message}</p>
                ${details ? `<p class="error-details">${details}</p>` : ''}
                <button class="btn primary-btn" id="refreshPageBtn">Refresh Page</button>
            </div>
        `;
        
        // Add refresh button handler
        const refreshBtn = document.getElementById('refreshPageBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                window.location.reload();
            });
        }
    }
    
    // Function to filter and display posts
    function filterAndDisplayPosts() {
        console.log(`Filtering posts: category=${currentCategory}, search="${searchQuery}"`);
        
        if (allPosts.length === 0) {
            blogGrid.innerHTML = '<div class="no-posts">No blog posts available.</div>';
            return;
        }
        
        // Apply filters
        let filteredPosts = allPosts;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredPosts = filteredPosts.filter(post => {
                const postCategory = (post.category || '').toLowerCase();
                // Case-insensitive matching
                return postCategory === currentCategory.toLowerCase() || 
                       postCategory.includes(currentCategory.toLowerCase());
            });
            
            console.log(`After category filter: ${filteredPosts.length} posts remain`);
        }
        
        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = filteredPosts.filter(post => {
                const title = (post.title || '').toLowerCase();
                const content = (post.content || '').toLowerCase();
                const excerpt = (post.excerpt || '').toLowerCase();
                return title.includes(query) || content.includes(query) || excerpt.includes(query);
            });
            
            console.log(`After search filter: ${filteredPosts.length} posts remain`);
        }
        
        // Display filtered posts
        if (filteredPosts.length === 0) {
            // No posts match the filter criteria
            if (currentCategory !== 'all') {
                // Map category to display name for the message
                let categoryDisplay = currentCategory;
                if (currentCategory === 'web') categoryDisplay = 'Web Development';
                else if (currentCategory === 'mobile') categoryDisplay = 'Mobile Development';
                else if (currentCategory === 'ai') categoryDisplay = 'AI & Machine Learning';
                else if (currentCategory === 'career') categoryDisplay = 'Career Tips';
                
                blogGrid.innerHTML = `
                    <div class="no-posts-message">
                        <h3>No ${categoryDisplay} Posts Found</h3>
                        <p>There are no posts in this category yet. Check back later or browse other categories.</p>
                        <button class="category-btn" data-category="all">View All Posts</button>
                    </div>
                `;
                
                // Add event listener to the "View All Posts" button
                const viewAllBtn = blogGrid.querySelector('.no-posts-message .category-btn');
                if (viewAllBtn) {
                    viewAllBtn.addEventListener('click', function() {
                        // Reset category to "all" and update UI
                        currentCategory = 'all';
                        updateCategoryButtonsUI();
                        filterAndDisplayPosts();
                    });
                }
            } else if (searchQuery) {
                blogGrid.innerHTML = `
                    <div class="no-posts-message">
                        <h3>No Search Results</h3>
                        <p>No posts match your search for "${searchQuery}". Try a different search term.</p>
                        <button class="btn primary-btn" id="clearSearchBtn">Clear Search</button>
                    </div>
                `;
                
                // Add event listener to clear search button
                const clearSearchBtn = document.getElementById('clearSearchBtn');
                if (clearSearchBtn) {
                    clearSearchBtn.addEventListener('click', function() {
                        searchQuery = '';
                        if (searchInput) searchInput.value = '';
                        filterAndDisplayPosts();
                    });
                }
            } else {
                blogGrid.innerHTML = '<div class="no-posts">No blog posts available.</div>';
            }
            return;
        }
        
        // Create HTML for filtered posts
        const fragment = document.createDocumentFragment();
        
        filteredPosts.forEach(function(post) {
            const postElement = createPostElement(post);
            fragment.appendChild(postElement);
        });
        
        // Clear and add filtered posts
        blogGrid.innerHTML = '';
        blogGrid.appendChild(fragment);
        
        // Add event listeners to Read More buttons
        setupReadMoreButtons();
    }
    
    // Function to handle "Read More" clicks
    function setupReadMoreButtons() {
        document.querySelectorAll('.read-more-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const post = allPosts.find(p => p.id === postId);
                
                if (!post) {
                    console.error('Post not found:', postId);
                    return;
                }
                
                // Save current scroll position
                const scrollPosition = window.scrollY;
                
                // Create expanded view
                const expandedPost = document.createElement('article');
                expandedPost.className = 'blog-card expanded';
                expandedPost.setAttribute('data-post-id', post.id);
                
                // Format date
                let dateDisplay = 'Unknown date';
                try {
                    if (post.date && post.date.seconds) {
                        dateDisplay = new Date(post.date.seconds * 1000).toLocaleDateString();
                    } else if (post.date) {
                        dateDisplay = new Date(post.date).toLocaleDateString();
                    }
                } catch (e) {
                    console.error('Date formatting error:', e);
                }
                
                // Get category display name
                let categoryDisplay = post.category || 'Uncategorized';
                if (post.category === 'web' || (post.category || '').includes('web')) {
                    categoryDisplay = 'Web Development';
                } else if (post.category === 'mobile' || (post.category || '').includes('mobile')) {
                    categoryDisplay = 'Mobile Development';
                } else if (post.category === 'ai' || (post.category || '').includes('ai') || (post.category || '').includes('machine')) {
                    categoryDisplay = 'AI & Machine Learning';
                } else if (post.category === 'career' || (post.category || '').includes('career')) {
                    categoryDisplay = 'Career Tips';
                }
                
                // Format content with proper HTML
                let content = post.content || post.excerpt || 'No content available';
                
                // If content has headers, format them properly
                if (content) {
                    // Simple formatting for headers (# Title becomes <h2>Title</h2>)
                    content = content.replace(/^# (.+)$/gm, '<h2>$1</h2>');
                    content = content.replace(/^## (.+)$/gm, '<h3>$1</h3>');
                    
                    // Format paragraphs
                    const paragraphs = content.split('\n\n');
                    if (paragraphs.length > 1) {
                        content = paragraphs.map(p => {
                            // Skip if it's already an HTML element
                            if (p.trim().startsWith('<') && p.trim().endsWith('>')) {
                                return p;
                            }
                            return `<p>${p}</p>`;
                        }).join('');
                    }
                }
                
                // Set image URL
                const imageUrl = post.imageUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                
                // Create HTML structure for expanded view
                expandedPost.innerHTML = `
                    <img src="${imageUrl}" alt="${post.title || 'Blog post'}" loading="lazy">
                    <div class="blog-card-content">
                        <span class="blog-card-category">${categoryDisplay}</span>
                        <h3>${post.title || 'Untitled Post'}</h3>
                        <div class="blog-card-meta">
                            <span class="blog-card-date">${dateDisplay}</span>
                        </div>
                        <div class="blog-card-full-content">${content}</div>
                        <button class="read-more-btn" data-action="collapse">Back to List</button>
                    </div>
                `;
                
                // Replace blog grid with expanded post
                blogGrid.innerHTML = '';
                blogGrid.appendChild(expandedPost);
                
                // Add event listener to the "Back to List" button
                const backButton = expandedPost.querySelector('.read-more-btn[data-action="collapse"]');
                if (backButton) {
                    backButton.addEventListener('click', function() {
                        // Return to the filtered list view
                        filterAndDisplayPosts();
                        
                        // Restore previous scroll position
                        setTimeout(() => {
                            window.scrollTo({
                                top: scrollPosition,
                                behavior: 'auto'
                            });
                        }, 100);
                    });
                }
                
                // Scroll to top of the post with smooth animation
                window.scrollTo({
                    top: blogGrid.offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Function to update category buttons UI
    function updateCategoryButtonsUI() {
        categoryButtons.forEach(button => {
            const buttonCategory = button.getAttribute('data-category');
            if (buttonCategory === currentCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Add event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Category clicked:', category);
            
            // Update current category
            currentCategory = category;
            
            // Update UI
            updateCategoryButtonsUI();
            
            // Filter and display posts
            filterAndDisplayPosts();
        });
    });
    
    // Add event listener to search
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            searchQuery = searchInput.value.trim();
            filterAndDisplayPosts();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchQuery = searchInput.value.trim();
                filterAndDisplayPosts();
            }
        });
    }
    
    // Begin Firebase verification process
    if (typeof firebase === 'undefined') {
        showError('Firebase SDK not loaded', 'The Firebase library is missing or failed to load.');
        return;
    }
    
    console.log('Firebase SDK loaded');
    
    // Check for Firestore
    if (!firebase.firestore) {
        showError('Firebase Firestore not available', 'The Firestore module is missing.');
        return;
    }
    
    // Initialize Firestore
    try {
        const db = firebase.firestore();
        console.log('Firestore initialized');
        
        // Test connection with a simple query
        db.collection('blogPosts').limit(1).get()
            .then(function(snapshot) {
                console.log('Firestore connection successful');
                console.log('Found', snapshot.size, 'documents');
                
                if (snapshot.empty) {
                    blogGrid.innerHTML = `
                        <div class="no-posts-message">
                            <h3>Blog Setup Required</h3>
                            <p>The blog is ready, but there are no posts yet. Please add some posts in the admin panel.</p>
                            <a href="admin-login.html" class="btn primary-btn">Admin Login</a>
                        </div>
                    `;
                } else {
                    // Success - load the actual blog
                    blogGrid.innerHTML = '<div class="loading">Loading blog posts...</div>';
                    
                    // Load all posts
                    db.collection('blogPosts')
                      .orderBy('date', 'desc')
                      .get()
                      .then(function(allPostsSnapshot) {
                          if (allPostsSnapshot.empty) {
                              blogGrid.innerHTML = '<div class="no-posts">No blog posts found.</div>';
                              return;
                          }
                          
                          // Store all posts in memory
                          allPosts = [];
                          allPostsSnapshot.forEach(function(doc) {
                              const post = doc.data();
                              post.id = doc.id;
                              allPosts.push(post);
                          });
                          
                          console.log('Blog posts loaded:', allPosts.length);
                          
                          // Display all posts initially
                          filterAndDisplayPosts();
                      })
                      .catch(function(error) {
                          showError('Error loading blog posts', error.message);
                      });
                }
            })
            .catch(function(error) {
                showError('Error connecting to Firestore', error.message);
            });
            
    } catch (error) {
        showError('Error initializing Firestore', error.message);
    }
    
    // Function to create a post element
    function createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.setAttribute('data-post-id', post.id);
        article.setAttribute('data-category', (post.category || 'uncategorized').toLowerCase());
        
        // Format date
        let dateDisplay = 'Unknown date';
        try {
            if (post.date && post.date.seconds) {
                dateDisplay = new Date(post.date.seconds * 1000).toLocaleDateString();
            } else if (post.date) {
                dateDisplay = new Date(post.date).toLocaleDateString();
            }
        } catch (e) {
            console.error('Date formatting error:', e);
        }
        
        // Set category
        const category = (post.category || 'uncategorized').toLowerCase();
        let categoryDisplay = category;
        
        // Map categories to display names
        if (category === 'web' || category.includes('web')) {
            categoryDisplay = 'Web Development';
        } else if (category === 'mobile' || category.includes('mobile')) {
            categoryDisplay = 'Mobile Development';
        } else if (category === 'ai' || category.includes('ai') || category.includes('machine')) {
            categoryDisplay = 'AI & Machine Learning';
        } else if (category === 'career' || category.includes('career')) {
            categoryDisplay = 'Career Tips';
        }
        
        // Set excerpt
        const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No content available');
        
        // Set image URL
        const imageUrl = post.imageUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
        
        // Create HTML structure
        article.innerHTML = `
            <img src="${imageUrl}" alt="${post.title || 'Blog post'}" loading="lazy">
            <div class="blog-card-content">
                <span class="blog-card-category">${categoryDisplay}</span>
                <h3>${post.title || 'Untitled Post'}</h3>
                <div class="blog-card-meta">
                    <span class="blog-card-date">${dateDisplay}</span>
                </div>
                <div class="blog-card-excerpt">${excerpt}</div>
                <button class="read-more-btn" data-post-id="${post.id}">Read More</button>
            </div>
        `;
        
        return article;
    }
}); 