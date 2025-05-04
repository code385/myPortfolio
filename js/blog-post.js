document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const db = firebase.firestore();
    
    // Get DOM elements
    const postContent = document.getElementById('postContent');
    const recentPosts = document.getElementById('recentPosts');
    const relatedPostsGrid = document.getElementById('relatedPostsGrid');
    const prevPost = document.getElementById('prevPost');
    const nextPost = document.getElementById('nextPost');
    
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        postContent.innerHTML = '<div class="error">Post not found. <a href="blog.html">Return to blog</a></div>';
        return;
    }
    
    // Load the post
    loadPost(postId);
    
    // Function to load post
    async function loadPost(id) {
        try {
            const postDoc = await db.collection('blogPosts').doc(id).get();
            
            if (!postDoc.exists) {
                postContent.innerHTML = '<div class="error">Post not found. <a href="blog.html">Return to blog</a></div>';
                return;
            }
            
            const post = postDoc.data();
            
            // Update document title
            document.title = `${post.title} - Muhammad Irfan's Blog`;
            
            // Format date
            const date = new Date(post.date.seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Build post HTML
            const postHTML = `
                <div class="post-header">
                    <span class="post-category">${post.category}</span>
                    <h1 class="post-title">${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-date"><i class="far fa-calendar-alt"></i> ${date}</span>
                    </div>
                </div>
                <img class="post-image" src="${post.imageUrl || 'images/blog/blog-placeholder.jpg'}" alt="${post.title}">
                <div class="post-body">
                    ${formatContent(post.content)}
                </div>
                <div class="post-tags">
                    <span class="post-tag">${post.category}</span>
                </div>
            `;
            
            postContent.innerHTML = postHTML;
            
            // Load recent posts
            loadRecentPosts(id);
            
            // Load related posts
            loadRelatedPosts(post.category, id);
            
            // Load next and previous posts
            loadNavigationPosts(post.date, id);
            
            // Log view event
            firebase.analytics().logEvent('blog_post_view', {
                post_id: id,
                post_title: post.title,
                post_category: post.category
            });
            
        } catch (error) {
            console.error('Error loading post:', error);
            postContent.innerHTML = '<div class="error">Error loading post. Please try again later.</div>';
        }
    }
    
    // Function to format content with paragraphs
    function formatContent(content) {
        if (!content) return '';
        
        // Split content by double newlines for paragraphs
        const paragraphs = content.split(/\n\n+/);
        
        return paragraphs.map(paragraph => {
            // Skip empty paragraphs
            if (!paragraph.trim()) return '';
            
            // Check if paragraph is a header
            if (paragraph.startsWith('# ')) {
                return `<h2>${paragraph.substring(2)}</h2>`;
            } else if (paragraph.startsWith('## ')) {
                return `<h3>${paragraph.substring(3)}</h3>`;
            }
            
            // Regular paragraph
            return `<p>${paragraph}</p>`;
        }).join('');
    }
    
    // Function to load recent posts
    async function loadRecentPosts(currentPostId) {
        try {
            const snapshot = await db.collection('blogPosts')
                .orderBy('date', 'desc')
                .limit(5)
                .get();
            
            if (snapshot.empty) {
                recentPosts.innerHTML = '<p>No recent posts.</p>';
                return;
            }
            
            let recentPostsHTML = '';
            
            snapshot.forEach(doc => {
                const post = doc.data();
                const postId = doc.id;
                
                // Skip current post
                if (postId === currentPostId) return;
                
                const date = new Date(post.date.seconds * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                recentPostsHTML += `
                    <div class="recent-post-item">
                        <img class="recent-post-img" src="${post.imageUrl || 'images/blog/blog-placeholder.jpg'}" alt="${post.title}">
                        <div class="recent-post-info">
                            <h4><a href="blog-post.html?id=${postId}">${post.title}</a></h4>
                            <span class="recent-post-date">${date}</span>
                        </div>
                    </div>
                `;
            });
            
            recentPosts.innerHTML = recentPostsHTML || '<p>No recent posts.</p>';
            
        } catch (error) {
            console.error('Error loading recent posts:', error);
            recentPosts.innerHTML = '<p>Error loading recent posts.</p>';
        }
    }
    
    // Function to load related posts
    async function loadRelatedPosts(category, currentPostId) {
        try {
            const snapshot = await db.collection('blogPosts')
                .where('category', '==', category)
                .limit(3)
                .get();
            
            let relatedPosts = [];
            
            snapshot.forEach(doc => {
                const post = doc.data();
                const postId = doc.id;
                
                // Skip current post
                if (postId === currentPostId) return;
                
                relatedPosts.push({ id: postId, ...post });
            });
            
            if (relatedPosts.length === 0) {
                // If no related posts in the same category, get any recent posts
                const anyPostsSnapshot = await db.collection('blogPosts')
                    .orderBy('date', 'desc')
                    .limit(3)
                    .get();
                
                anyPostsSnapshot.forEach(doc => {
                    const post = doc.data();
                    const postId = doc.id;
                    
                    // Skip current post
                    if (postId === currentPostId) return;
                    
                    relatedPosts.push({ id: postId, ...post });
                });
            }
            
            if (relatedPosts.length === 0) {
                relatedPostsGrid.innerHTML = '<p>No related posts found.</p>';
                return;
            }
            
            let relatedPostsHTML = '';
            
            relatedPosts.forEach(post => {
                const date = new Date(post.date.seconds * 1000).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                relatedPostsHTML += `
                    <article class="blog-card" data-aos="fade-up">
                        <img src="${post.imageUrl || 'images/blog/blog-placeholder.jpg'}" alt="${post.title}">
                        <div class="blog-card-content">
                            <h3>${post.title}</h3>
                            <p>${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                            <div class="blog-card-meta">
                                <span class="blog-card-date">${date}</span>
                                <span class="blog-card-category">${post.category}</span>
                            </div>
                            <a href="blog-post.html?id=${post.id}" class="read-more">Read More</a>
                        </div>
                    </article>
                `;
            });
            
            relatedPostsGrid.innerHTML = relatedPostsHTML;
            
        } catch (error) {
            console.error('Error loading related posts:', error);
            relatedPostsGrid.innerHTML = '<p>Error loading related posts.</p>';
        }
    }
    
    // Function to load next and previous posts
    async function loadNavigationPosts(currentDate, currentPostId) {
        try {
            // Get previous post (older than current)
            const prevPostSnapshot = await db.collection('blogPosts')
                .where('date', '<', currentDate)
                .orderBy('date', 'desc')
                .limit(1)
                .get();
            
            // Get next post (newer than current)
            const nextPostSnapshot = await db.collection('blogPosts')
                .where('date', '>', currentDate)
                .orderBy('date', 'asc')
                .limit(1)
                .get();
            
            // Handle previous post
            if (prevPostSnapshot.empty) {
                prevPost.style.opacity = '0.5';
                prevPost.style.pointerEvents = 'none';
                prevPost.querySelector('#prevPostTitle').textContent = 'No older posts';
            } else {
                const prevPostDoc = prevPostSnapshot.docs[0];
                const prevPostData = prevPostDoc.data();
                
                prevPost.href = `blog-post.html?id=${prevPostDoc.id}`;
                prevPost.querySelector('#prevPostTitle').textContent = prevPostData.title;
            }
            
            // Handle next post
            if (nextPostSnapshot.empty) {
                nextPost.style.opacity = '0.5';
                nextPost.style.pointerEvents = 'none';
                nextPost.querySelector('#nextPostTitle').textContent = 'No newer posts';
            } else {
                const nextPostDoc = nextPostSnapshot.docs[0];
                const nextPostData = nextPostDoc.data();
                
                nextPost.href = `blog-post.html?id=${nextPostDoc.id}`;
                nextPost.querySelector('#nextPostTitle').textContent = nextPostData.title;
            }
            
        } catch (error) {
            console.error('Error loading navigation posts:', error);
            prevPost.style.display = 'none';
            nextPost.style.display = 'none';
        }
    }
}); 