// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUOzPFP7c3y4kE6VUUTUJFJoycw_Jnr8g",
    authDomain: "portfolio-ec45f.firebaseapp.com",
    projectId: "portfolio-ec45f",
    storageBucket: "portfolio-ec45f.appspot.com",
    messagingSenderId: "503860933917",
    appId: "1:503860933917:web:1947e00d04e869db695df4",
    measurementId: "G-99QWPD1TBH"
};

// Create helper variables to track initialization
window.firebaseDebug = {
    initialized: false,
    error: null,
    initTime: null
};

// Expose Firebase services globally for other scripts
window.db = null;
window.firebaseAuth = null;
window.firebaseAnalytics = null;
window.firebaseStorage = null;

// Create the dbHelpers object immediately to ensure it's always defined
window.dbHelpers = {
    checkMessagingPermission: async function(email) {
        try {
            if (!firebase || !firebase.firestore) {
                console.error("Firebase or Firestore not initialized in permission check");
                return { authorized: false, error: "Firebase not fully initialized" };
            }
            
            // Create a query to check if the user has any messages
            const query = firebase.firestore().collection('contactSubmissions')
                .where('email', '==', email)
                .limit(1);
                
            // Test if we can read the data
            const snapshot = await query.get();
            return { authorized: true, error: null };
        } catch (error) {
            console.error("Permission check error:", error);
            return { 
                authorized: false, 
                error: error.message || "An error occurred checking your permission"
            };
        }
    }
};

// Initialize Firebase function
function initializeFirebase() {
    try {
        console.log("Starting Firebase initialization...");

        // Check if Firebase is defined
        if (typeof firebase === 'undefined') {
            console.error('Firebase SDK not loaded');
            showInitError('Firebase SDK failed to load');
            return false;
        }

        // Check if Firebase is already initialized
        if (firebase.apps && firebase.apps.length) {
            console.log("Firebase already initialized, using existing app");
            const app = firebase.app();
            window.firebaseDebug.initialized = true;
            window.firebaseDebug.initTime = new Date().toString();
        } else {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase app initialized successfully");
            window.firebaseDebug.initialized = true;
            window.firebaseDebug.initTime = new Date().toString();
        }

        // Initialize Firestore and expose globally
        if (typeof firebase.firestore === 'function') {
            window.db = firebase.firestore();
            console.log("Firestore initialized successfully and exposed as window.db");
        } else {
            console.error("Firestore not available");
            showInitError('Firestore not available');
            return false;
        }

        // Initialize Firebase Authentication (optional)
        try {
            if (typeof firebase.auth === 'function') {
                window.firebaseAuth = firebase.auth();
                console.log("Firebase Auth initialized successfully");
            }
        } catch (authError) {
            console.error("Auth initialization error (non-critical):", authError);
            // Continue without Auth
        }

        // Initialize Analytics (optional)
        try {
            if (typeof firebase.analytics === 'function') {
                window.firebaseAnalytics = firebase.analytics();
                console.log("Firebase Analytics initialized successfully");
            }
        } catch (analyticsError) {
            console.error("Analytics initialization error (non-critical):", analyticsError);
            // Continue without Analytics
        }

        // Initialize Storage (optional)
        try {
            if (typeof firebase.storage === 'function') {
                window.firebaseStorage = firebase.storage();
                console.log("Firebase Storage initialized successfully");
            }
        } catch (storageError) {
            console.error("Storage initialization error (non-critical):", storageError);
            // Continue without Storage
        }

        // Skip persistence for now since it can cause issues
        console.log("Firebase successfully initialized");
        
        // Create and dispatch an event to notify other scripts that Firebase is ready
        const event = new CustomEvent('firebase-ready', { detail: { success: true }});
        document.dispatchEvent(event);
        
        return true;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        window.firebaseDebug.error = error.message;
        showInitError(error.message);
        
        // Create and dispatch an event to notify other scripts that Firebase failed to initialize
        const event = new CustomEvent('firebase-ready', { detail: { success: false, error: error }});
        document.dispatchEvent(event);
        
        return false;
    }
}

// Helper function to show initialization error to user
function showInitError(message) {
    // Create a notification element for the error if not already displayed
    if (!document.querySelector('.firebase-error-notification')) {
        const notification = document.createElement('div');
        notification.className = 'firebase-error-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 20px;
            background-color: #f44336;
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 80%;
            text-align: center;
            font-family: 'Poppins', sans-serif;
        `;
        
        // Add a dismiss button
        notification.innerHTML = `
            <span>⚠️ Contact form may not work properly. Please try again later.</span>
            <button style="
                margin-left: 15px;
                background: transparent;
                border: 1px solid white;
                color: white;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
            ">Dismiss</button>
        `;
        
        // Add dismiss functionality
        notification.querySelector('button').addEventListener('click', function() {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

// Run initialization
document.addEventListener('DOMContentLoaded', function() {
    // Try initialization immediately
    if (!initializeFirebase()) {
        // If failed, try again with a longer delay
        setTimeout(initializeFirebase, 1000);
    }
}); 