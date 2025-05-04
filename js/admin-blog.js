document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            // Redirect to login if not logged in
            console.log("No user found, redirecting to login");
            window.location.href = 'admin-login.html';
        } else {
            console.log("User is logged in:", user.email);
            
            try {
                // Force token refresh to ensure we have an up-to-date token
                await user.getIdToken(true);
                
                // User is logged in with fresh token, initialize the admin panel
                initAdminPanel();
                
            } catch (authError) {
                console.error("Authentication error:", authError);
                alert("There was an authentication error. Please try logging in again.");
                
                // Sign out and redirect to login
                firebase.auth().signOut().then(function() {
                    window.location.href = 'admin-login.html';
                });
            }
        }
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            firebase.auth().signOut().then(function() {
                window.location.href = 'admin-login.html';
            }).catch(function(error) {
                showNotification('Logout failed: ' + error.message, 'error');
            });
        });
    }

    // Initialize admin panel functionality
    function initAdminPanel() {
        const db = firebase.firestore();
        let currentPostId = null;
        let currentImageUrl = null;
        let currentImagePublicId = null;
        let imageChanged = false;
        let uploadInProgress = false;

        // DOM Elements
        const newPostBtn = document.getElementById('newPostBtn');
        const blogPostsList = document.getElementById('blogPostsList');
        const postEditorModal = document.getElementById('postEditorModal');
        const deleteConfirmModal = document.getElementById('deleteConfirmModal');
        const blogPostForm = document.getElementById('blogPostForm');
        const modalTitle = document.getElementById('modalTitle');
        const postIdField = document.getElementById('postId');
        const titleField = document.getElementById('title');
        const categoryField = document.getElementById('category');
        const excerptField = document.getElementById('excerpt');
        const contentField = document.getElementById('content');
        const imageUpload = document.getElementById('imageUpload');
        const imagePreview = document.getElementById('imagePreview');
        const cancelBtn = document.getElementById('cancelBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        // Create a direct file input for image uploads
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'directFileInput';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', handleFileSelect);

        // Replace the Cloudinary widget initialization with our own upload button
        if (imageUpload) {
            const uploadImageBtn = document.createElement('button');
            uploadImageBtn.type = 'button';
            uploadImageBtn.className = 'btn-secondary';
            uploadImageBtn.textContent = 'Choose Image';
            uploadImageBtn.onclick = (e) => {
                e.preventDefault();
                fileInput.click();
            };

            // Replace the file input with the button
            imageUpload.parentNode.replaceChild(uploadImageBtn, imageUpload);
            
            // Add a cancel upload button next to it
            const cancelUploadBtn = document.createElement('button');
            cancelUploadBtn.type = 'button';
            cancelUploadBtn.className = 'btn-secondary';
            cancelUploadBtn.style.marginLeft = '10px';
            cancelUploadBtn.style.display = 'none';
            cancelUploadBtn.id = 'cancelUploadBtn';
            cancelUploadBtn.textContent = 'Cancel Upload';
            cancelUploadBtn.onclick = (e) => {
                e.preventDefault();
                cancelImageUpload();
            };
            
            uploadImageBtn.parentNode.appendChild(cancelUploadBtn);
        }

        // Load blog posts
        loadBlogPosts();

        // New Post button click
        newPostBtn.addEventListener('click', function() {
            openModal('add');
        });

        // Close modal buttons
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                // Ask for confirmation if upload is in progress
                if (uploadInProgress) {
                    if (confirm('Image upload is in progress. Are you sure you want to close this window?')) {
                        cancelImageUpload();
                        closeModal();
                    }
                } else {
                    closeModal();
                }
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                // Ask for confirmation if upload is in progress
                if (uploadInProgress) {
                    if (confirm('Image upload is in progress. Are you sure you want to cancel?')) {
                        cancelImageUpload();
                        closeModal();
                    }
                } else {
                    closeModal();
                }
            });
        }

        // Cancel delete
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', function() {
                deleteConfirmModal.style.display = 'none';
            });
        }

        // Form submission
        if (blogPostForm) {
            blogPostForm.addEventListener('submit', handleFormSubmit);
        }

        // Function to load blog posts
        async function loadBlogPosts() {
            try {
                blogPostsList.innerHTML = '<div class="loading">Loading posts...</div>';
                
                // Check if user is still authenticated
                if (!firebase.auth().currentUser) {
                    blogPostsList.innerHTML = '<div class="error">Authentication error. Please <a href="admin-login.html">log in again</a>.</div>';
                    return;
                }
                
                // Try to get posts
                const snapshot = await db.collection('blogPosts').orderBy('date', 'desc').get()
                    .catch(error => {
                        console.error("Error fetching posts:", error);
                        if (error.code === 'permission-denied') {
                            throw new Error('Permission denied. You do not have access to view posts.');
                        } else {
                            throw error;
                        }
                    });
                
                if (snapshot.empty) {
                    blogPostsList.innerHTML = '<div class="no-posts">No blog posts found.<br>Click "New Post" to create your first blog post.</div>';
                    return;
                }
                
                blogPostsList.innerHTML = '';
                
                snapshot.forEach(doc => {
                    const post = doc.data();
                    const postId = doc.id;
                    const date = new Date(post.date.seconds * 1000).toLocaleDateString();
                    
                    const postElement = document.createElement('div');
                    postElement.className = 'post-item';
                    postElement.innerHTML = `
                        <img src="${post.imageUrl || 'https://res.cloudinary.com/dtgveegkr/image/upload/v1685000000/portfolio/default-blog-image.jpg'}" alt="${post.title}" class="post-thumb">
                        <div class="post-meta">
                            <h3 class="post-title">${post.title}</h3>
                            <span class="post-date">${date}</span>
                            <span class="post-category">${getCategoryName(post.category)}</span>
                        </div>
                        <div class="post-actions">
                            <button class="btn-secondary edit-post" data-id="${postId}">Edit</button>
                            <button class="btn-danger delete-post" data-id="${postId}">Delete</button>
                        </div>
                    `;
                    
                    blogPostsList.appendChild(postElement);
                    
                    // Add event listeners to the buttons
                    const editBtn = postElement.querySelector('.edit-post');
                    const deleteBtn = postElement.querySelector('.delete-post');
                    
                    editBtn.addEventListener('click', function() {
                        openModal('edit', postId);
                    });
                    
                    deleteBtn.addEventListener('click', function() {
                        currentPostId = postId;
                        deleteConfirmModal.style.display = 'block';
                    });
                });
                
            } catch (error) {
                console.error('Error loading blog posts:', error);
                blogPostsList.innerHTML = `<div class="error">
                    <p>Error loading posts: ${error.message}</p>
                    <div class="error-action">
                        <button onclick="window.location.reload()">Try Again</button>
                        <button onclick="window.location.href='admin-login.html'">Log in Again</button>
                    </div>
                </div>`;
            }
        }

        // Helper function to get category display name
        function getCategoryName(category) {
            const categories = {
                'web': 'Web Development',
                'mobile': 'Mobile Development',
                'ai': 'AI & Machine Learning',
                'career': 'Career Tips'
            };
            return categories[category] || category;
        }

        // Confirm delete post
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', async function() {
                if (!currentPostId) return;
                
                try {
                    // Delete the post
                    await db.collection('blogPosts').doc(currentPostId).delete();
                    
                    // Close modal and reload
                    deleteConfirmModal.style.display = 'none';
                    showNotification('Post deleted successfully', 'success');
                    loadBlogPosts();
                    
                } catch (error) {
                    console.error('Error deleting post:', error);
                    showNotification('Error deleting post: ' + error.message, 'error');
                }
            });
        }

        // Open modal in add or edit mode
        async function openModal(mode, postId = null) {
            modalTitle.textContent = mode === 'add' ? 'Add New Blog Post' : 'Edit Blog Post';
            
            // Reset form and variables
            blogPostForm.reset();
            imagePreview.innerHTML = '';
            currentImageUrl = null;
            currentImagePublicId = null;
            imageChanged = false;
            
            if (mode === 'edit' && postId) {
                currentPostId = postId;
                postIdField.value = postId;
                
                try {
                    const doc = await db.collection('blogPosts').doc(postId).get();
                    if (doc.exists) {
                        const post = doc.data();
                        
                        titleField.value = post.title || '';
                        categoryField.value = post.category || '';
                        excerptField.value = post.excerpt || '';
                        contentField.value = post.content || '';
                        
                        if (post.imageUrl) {
                            imagePreview.innerHTML = `<img src="${post.imageUrl}" alt="Preview">`;
                            currentImageUrl = post.imageUrl;
                            currentImagePublicId = post.imagePublicId || '';
                        }
                    }
                } catch (error) {
                    console.error('Error loading post for editing:', error);
                    showNotification('Error loading post data', 'error');
                }
            } else {
                currentPostId = null;
                postIdField.value = '';
            }
            
            postEditorModal.style.display = 'block';
        }

        // Close modal
        function closeModal() {
            postEditorModal.style.display = 'none';
            currentPostId = null;
        }

        // Function to handle direct file uploads
        async function handleFileSelect(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                uploadInProgress = true;
                
                // Show uploading indicator
                imagePreview.innerHTML = '<div class="uploading-indicator">Processing image... <div class="spinner"></div></div>';
                
                // Show cancel button
                const cancelUploadBtn = document.getElementById('cancelUploadBtn');
                if (cancelUploadBtn) {
                    cancelUploadBtn.style.display = 'inline-block';
                }
                
                // Compress the image before uploading
                const compressedFile = await compressImage(file);
                
                // Show compression information
                const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
                const compressionRatio = Math.round((1 - (compressedFile.size / file.size)) * 100);
                
                imagePreview.innerHTML = `<div class="uploading-indicator">
                    Compressing image: ${originalSizeMB}MB → ${compressedSizeMB}MB (${compressionRatio}% smaller)
                    <br>Uploading to Cloudinary... <div class="spinner"></div>
                </div>`;
                
                // Upload directly to Cloudinary (skip Firebase Storage)
                await uploadToCloudinary(compressedFile);
                
            } catch (error) {
                console.error('Error handling file selection:', error);
                imagePreview.innerHTML = `<div class="error">Upload error: ${error.message}</div>`;
                uploadInProgress = false;
                
                // Hide cancel button
                const cancelUploadBtn = document.getElementById('cancelUploadBtn');
                if (cancelUploadBtn) {
                    cancelUploadBtn.style.display = 'none';
                }
                
                // Clear the file input
                fileInput.value = '';
            }
        }
        
        // Function to upload to Firebase with retry logic
        async function uploadToFirebase(file) {
            return new Promise((resolve, reject) => {
                // Generate a unique filename with timestamp
                const fileName = `${new Date().getTime()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`blog-images/${fileName}`);
                
                // Set retry options
                const maxRetries = 3;
                let currentRetry = 0;
                
                // Start countdown timer
                let timeLeft = 60; // 60 seconds until timeout
                const countdownInterval = setInterval(() => {
                    timeLeft--;
                    
                    // Update the UI with the time remaining
                    const countdownElement = document.querySelector('.countdown-timer');
                    if (countdownElement) {
                        countdownElement.textContent = `${timeLeft}s`;
                        
                        // Change color when getting low on time
                        if (timeLeft <= 10) {
                            countdownElement.style.color = '#ef4444';
                        }
                    }
                    
                    // If countdown reaches 0, clear the interval (the Promise.race will handle the timeout)
                    if (timeLeft <= 0) {
                        clearInterval(countdownInterval);
                    }
                }, 1000);
                
                const attemptUpload = () => {
                    const uploadTask = fileRef.put(file);
                    
                    // Listen for upload progress
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            // Update progress indicator
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            imagePreview.innerHTML = `<div class="uploading-indicator">
                                Uploading image via Firebase... ${Math.round(progress)}%
                                ${currentRetry > 0 ? `<br><small>Retry attempt: ${currentRetry}/${maxRetries}</small>` : ''}
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${progress}%"></div>
                                </div>
                                <div class="timeout-warning">
                                    Switching to Cloudinary in <span class="countdown-timer">${timeLeft}s</span> if not completed
                                </div>
                                <div class="spinner"></div>
                            </div>`;
                        },
                        async (error) => {
                            // Check if we should retry
                            if (currentRetry < maxRetries && 
                                (error.code === 'storage/retry-limit-exceeded' || 
                                 error.code === 'storage/network-failed')) {
                                
                                currentRetry++;
                                console.log(`Upload failed, retrying (${currentRetry}/${maxRetries})...`, error);
                                
                                imagePreview.innerHTML = `<div class="uploading-indicator">
                                    Upload interrupted. Retrying (${currentRetry}/${maxRetries})...
                                    <div class="timeout-warning">
                                        Switching to Cloudinary in <span class="countdown-timer">${timeLeft}s</span> if not completed
                                    </div>
                                    <div class="spinner"></div>
                                </div>`;
                                
                                // Wait before retrying (exponential backoff)
                                const delay = Math.min(1000 * Math.pow(2, currentRetry), 10000);
                                setTimeout(attemptUpload, delay);
                            } else {
                                // We've exhausted our retries or got a non-retryable error
                                clearInterval(countdownInterval);
                                reject(error);
                            }
                        },
                        async () => {
                            // Handle successful upload
                            try {
                                clearInterval(countdownInterval);
                                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                                
                                // Update preview with the image
                                imagePreview.innerHTML = `<img src="${downloadURL}" alt="Preview">`;
                                
                                // Store for form submission
                                currentImageUrl = downloadURL;
                                imageChanged = true;
                                uploadInProgress = false;
                                
                                // Hide cancel button
                                const cancelUploadBtn = document.getElementById('cancelUploadBtn');
                                if (cancelUploadBtn) {
                                    cancelUploadBtn.style.display = 'none';
                                }
                                
                                // Clear the file input
                                fileInput.value = '';
                                
                                resolve(downloadURL);
                            } catch (error) {
                                clearInterval(countdownInterval);
                                reject(error);
                            }
                        }
                    );
                };
                
                // Start the first upload attempt
                attemptUpload();
            });
        }

        // Function to upload to Cloudinary as primary image storage
        async function uploadToCloudinary(file) {
            // Get Cloudinary config from the global object
            const cloudName = cloudinaryConfig.cloudName;
            const uploadPreset = cloudinaryConfig.uploadPreset;
            const url = cloudinaryHelpers.getUploadUrl();
            
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            
            try {
                // Show uploading to Cloudinary message
                imagePreview.innerHTML = `<div class="uploading-indicator">
                    Uploading to Cloudinary...
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <div class="spinner"></div>
                </div>`;
                
                // Use XHR to track upload progress
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', url, true);
                    
                    // Track upload progress
                    xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = Math.round((e.loaded / e.total) * 100);
                            const progressBar = document.querySelector('.progress-bar');
                            if (progressBar) {
                                progressBar.style.width = percentComplete + '%';
                            }
                            
                            imagePreview.innerHTML = `<div class="uploading-indicator">
                                Uploading to Cloudinary... ${percentComplete}%
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentComplete}%"></div>
                                </div>
                                <div class="spinner"></div>
                            </div>`;
                        }
                    };
                    
                    // Handle response
                    xhr.onload = function() {
                        if (this.status >= 200 && this.status < 300) {
                            const data = JSON.parse(this.responseText);
                            
                            // Update preview with the image
                            // Use transformations to optimize the preview
                            const optimizedUrl = cloudinaryHelpers.transformImage(data.secure_url, {
                                width: 600,
                                quality: 'auto',
                                fetchFormat: 'auto'
                            });
                            
                            imagePreview.innerHTML = `<img src="${optimizedUrl}" alt="Preview">`;
                            
                            // Store for form submission (use original URL for storage)
                            currentImageUrl = data.secure_url;
                            currentImagePublicId = data.public_id; // Store Cloudinary public ID for future reference
                            imageChanged = true;
                            uploadInProgress = false;
                            
                            // Hide cancel button
                            const cancelUploadBtn = document.getElementById('cancelUploadBtn');
                            if (cancelUploadBtn) {
                                cancelUploadBtn.style.display = 'none';
                            }
                            
                            // Clear the file input
                            fileInput.value = '';
                            
                            showNotification('Image uploaded to Cloudinary successfully', 'success');
                            resolve(data.secure_url);
                        } else {
                            reject(new Error(`Cloudinary upload failed: ${this.statusText}`));
                        }
                    };
                    
                    xhr.onerror = function() {
                        reject(new Error('Network error during upload'));
                    };
                    
                    xhr.send(formData);
                });
                
            } catch (error) {
                throw new Error(`Cloudinary upload failed: ${error.message}`);
            }
        }

        // Function to compress images before uploading
        async function compressImage(file) {
            return new Promise((resolve, reject) => {
                try {
                    // Create a FileReader
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        const img = new Image();
                        
                        img.onload = function() {
                            // Get original dimensions
                            let width = img.width;
                            let height = img.height;
                            
                            // Define maximum dimensions (maintain aspect ratio)
                            const MAX_WIDTH = 1200;
                            const MAX_HEIGHT = 800;
                            
                            // Calculate new dimensions
                            if (width > MAX_WIDTH) {
                                height = Math.round(height * (MAX_WIDTH / width));
                                width = MAX_WIDTH;
                            }
                            if (height > MAX_HEIGHT) {
                                width = Math.round(width * (MAX_HEIGHT / height));
                                height = MAX_HEIGHT;
                            }
                            
                            // Create a canvas to compress the image
                            const canvas = document.createElement('canvas');
                            canvas.width = width;
                            canvas.height = height;
                            
                            // Draw the image on canvas
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // Get compressed image as Blob
                            canvas.toBlob(function(blob) {
                                // Create a new File object
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: new Date().getTime()
                                });
                                
                                resolve(compressedFile);
                            }, 'image/jpeg', 0.7); // 0.7 quality (70%) - adjust as needed
                        };
                        
                        img.src = event.target.result;
                    };
                    
                    reader.onerror = function(error) {
                        reject(error);
                    };
                    
                    // Read the file as Data URL
                    reader.readAsDataURL(file);
                    
                } catch (error) {
                    reject(error);
                }
            });
        }
        
        // Function to cancel an in-progress upload
        function cancelImageUpload() {
            // Reset upload state
            uploadInProgress = false;
            imagePreview.innerHTML = '';
            
            // Hide cancel button
            const cancelUploadBtn = document.getElementById('cancelUploadBtn');
            if (cancelUploadBtn) {
                cancelUploadBtn.style.display = 'none';
            }
            
            // Clear the file input
            fileInput.value = '';
            
            // Show notification
            showNotification('Image upload cancelled', 'info');
        }

        // Handle form submission
        async function handleFormSubmit(e) {
            e.preventDefault();
            
            // Check if upload is still in progress
            if (uploadInProgress) {
                showNotification('Please wait for image upload to complete', 'error');
                return;
            }
            
            // Check authentication status first
            if (!firebase.auth().currentUser) {
                showNotification('You need to be logged in to save posts. Please log in again.', 'error');
                setTimeout(() => {
                    window.location.href = 'admin-login.html';
                }, 2000);
                return;
            }
            
            const title = titleField.value.trim();
            const category = categoryField.value.trim();
            const excerpt = excerptField.value.trim();
            const content = contentField.value.trim();
            const postId = postIdField.value;
            
            if (!title || !category || !content) {
                showNotification('Please fill all required fields', 'error');
                return;
            }
            
            // Show the saving notification
            showNotification('Saving blog post...', 'info');
            
            try {
                // Get a fresh ID token to ensure it's not expired
                const token = await firebase.auth().currentUser.getIdToken(true);
                
                // Prepare the post data for Firebase (text only)
                const postData = {
                    title,
                    category,
                    excerpt: excerpt || '',
                    content,
                    date: firebase.firestore.Timestamp.fromDate(new Date()),
                    // Store the Cloudinary image URL from the upload
                    imageUrl: currentImageUrl || 'https://res.cloudinary.com/dtgveegkr/image/upload/v1685000000/portfolio/default-blog-image.jpg',
                    // Store Cloudinary-specific metadata to help with image management
                    imageProvider: 'cloudinary',
                    imagePublicId: currentImagePublicId || '',
                    // Add last modified metadata
                    lastModified: firebase.firestore.Timestamp.fromDate(new Date()),
                    lastModifiedBy: firebase.auth().currentUser.email || firebase.auth().currentUser.uid
                };
                
                // Set metadata fields
                if (!postId) {
                    // For new posts, add creation metadata
                    postData.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
                    postData.createdBy = firebase.auth().currentUser.email || firebase.auth().currentUser.uid;
                }
                
                if (postId) {
                    // Update existing post
                    await db.collection('blogPosts').doc(postId).update(postData);
                    showNotification('Post updated successfully', 'success');
                } else {
                    // Add new post
                    await db.collection('blogPosts').add(postData);
                    showNotification('Post created successfully', 'success');
                }
                
                // Close modal and reload posts
                closeModal();
                loadBlogPosts();
                
            } catch (error) {
                console.error('Error saving post:', error);
                
                // Handle different error types with clear messages
                if (error.code === 'permission-denied') {
                    showNotification('Permission denied. You do not have access to save posts.', 'error');
                } else if (error.code === 'unauthenticated') {
                    showNotification('Your login session has expired. Please log in again.', 'error');
                    setTimeout(() => {
                        window.location.href = 'admin-login.html';
                    }, 2000);
                } else {
                    showNotification('Error saving post: ' + error.message, 'error');
                }
            }
        }
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        // Check if there's an existing notification
        let notification = document.querySelector('.notification');
        
        // If not, create one
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Update the notification
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Make sure it's visible
        notification.style.display = 'block';
        
        // Set a timeout to hide it
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}); 