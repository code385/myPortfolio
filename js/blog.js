document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog page initialized');
    
    // Get DOM elements
    const blogGrid = document.getElementById('blogGrid');
    
    // Show loading indicator
    blogGrid.innerHTML = '<div class="loading">Testing connection...</div>';
    
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
                          
                          // Create HTML for posts
                          const fragment = document.createDocumentFragment();
                          
                          allPostsSnapshot.forEach(function(doc) {
                              const post = doc.data();
                              post.id = doc.id;
                              
                              // Create post element
                              const postElement = createPostElement(post);
                              fragment.appendChild(postElement);
                          });
                          
                          // Clear and add all posts
                          blogGrid.innerHTML = '';
                          blogGrid.appendChild(fragment);
                          
                          console.log('Blog posts loaded successfully');
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
        const category = post.category || 'uncategorized';
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