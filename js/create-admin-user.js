/*
 * This is a utility script to create an admin user in Firebase Authentication.
 * Run this in the browser console on your portfolio site with Firebase initialized:
 * 
 * 1. Go to your portfolio site
 * 2. Open browser DevTools (F12 or Ctrl+Shift+I)
 * 3. Paste the entire content of this script into the console
 * 4. Call createAdminUser with your email and password
 * 5. Example: createAdminUser('youremail@example.com', 'yourSecurePassword123')
 * 
 * IMPORTANT: This should only be used during development or on your local machine.
 * For production, prefer using Firebase Admin SDK and server-side code for security.
 */

async function createAdminUser(email, password) {
    if (!firebase || !firebase.auth) {
        console.error('Firebase is not initialized! Make sure you run this on your site with Firebase loaded.');
        return;
    }
    
    if (!email || !password) {
        console.error('Email and password are required!');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.error('Invalid email format!');
        return;
    }
    
    // Validate password strength
    if (password.length < 8) {
        console.error('Password must be at least 8 characters long!');
        return;
    }
    
    try {
        // First, sign out any current user
        await firebase.auth().signOut();
        
        console.log('Creating admin user...');
        
        // Create the user
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log(`Admin user created successfully! User ID: ${user.uid}`);
        console.log('You can now sign in using admin-login.html');
        
        // Optionally, you can add user claims via Firebase Functions
        // This requires additional setup in your Firebase project
        console.log('\nImportant: For additional security, consider setting custom claims for admin users using Firebase Admin SDK.');
        console.log('Example Cloud Function code:');
        console.log(`
async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Admin role set successfully');
  } catch (error) {
    console.error('Error setting admin role:', error);
  }
}

// Call with your user ID:
setAdminRole('${user.uid}');
        `);
        
        return user;
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        if (error.code === 'auth/email-already-in-use') {
            console.log('This email is already registered. Try signing in using admin-login.html');
        }
    }
}

// Instructions
console.log('Admin User Creation Utility');
console.log('---------------------------');
console.log('Call createAdminUser(email, password) with your desired credentials.');
console.log('Example: createAdminUser("admin@example.com", "securePassword123")');
console.log('After creating the user, you can sign in at admin-login.html');

document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const createUserForm = document.getElementById('createUserForm');
    const messageBox = document.getElementById('createUserMessage');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const eyeIcon = this.querySelector('i');
            eyeIcon.classList.toggle('fa-eye');
            eyeIcon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Create user form submission
    if (createUserForm) {
        createUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const createUserBtn = document.getElementById('createUserBtn');
            
            // Validate password match
            if (password !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            // Validate password strength
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Disable button and show loading state
            createUserBtn.disabled = true;
            createUserBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating user...';
            
            // Create user with Firebase auth
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(function(userCredential) {
                    const user = userCredential.user;
                    // Set custom claims for admin (normally this would be done in a secure backend)
                    // For demo purposes, we'll mark the user as admin in Firestore
                    firebase.firestore().collection('adminUsers').doc(user.uid).set({
                        email: user.email,
                        isAdmin: true,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        showMessage(`Admin user created successfully! You can now <a href="admin-login.html">login</a> with these credentials.`, 'success');
                        createUserForm.reset();
                    }).catch(error => {
                        console.error("Error writing admin data: ", error);
                        showMessage("User created but admin rights not set: " + error.message, 'error');
                    });
                })
                .catch(function(error) {
                    showMessage(error.message, 'error');
                })
                .finally(function() {
                    // Reset button
                    createUserBtn.disabled = false;
                    createUserBtn.innerHTML = 'Create Admin User';
                });
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        messageBox.innerHTML = message;
        messageBox.className = `message-box ${type}`;
        messageBox.style.display = 'block';
        
        // Scroll to message
        messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Check if user is already logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            showMessage(`You're already logged in as ${user.email}. <br>You can go to <a href="admin-blog.html">Admin Blog</a> to manage your posts.`, 'info');
        }
    });
}); 