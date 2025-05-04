/**
 * Firestore Rules Helper - Direct upload through browser
 * 
 * This is a client-side way to update your Firestore rules.
 * Since we couldn't get the Firebase CLI working, you can run this in your browser console
 * while logged in to the Firebase console.
 * 
 * Instructions:
 * 1. Log in to the Firebase Console: https://console.firebase.google.com/
 * 2. Open your project
 * 3. Go to Firestore Database
 * 4. Open browser developer tools (F12 or right-click > Inspect)
 * 5. Go to the Console tab
 * 6. Paste the rules below and run
 * 7. Go to the "Rules" tab in Firestore and click "Publish"
 */

// Copy and paste the rules below into your Firebase Console > Firestore > Rules
const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all operations for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access for blog posts
    match /blogPosts/{postId} {
      allow read: if true;
    }
    
    // Allow anyone to create a contact submission
    match /contactSubmissions/{submissionId} {
      allow create: if true;
    }
    
    // Allow anyone to subscribe to the newsletter
    match /newsletterSubscribers/{subscriberId} {
      allow create: if true;
    }
  }
}`;

console.log("=== Firestore Rules Helper ===");
console.log("Copy the rules below and paste them in your Firebase Console's Rules editor:");
console.log(firestoreRules);
console.log("\nAlternatively, if you manage to install the Firebase CLI, run:");
console.log("firebase deploy --only firestore:rules"); 