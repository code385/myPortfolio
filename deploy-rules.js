// Deploy Firestore Rules Script
// This is a simple Node.js script to help you deploy your Firestore rules

console.log('=== Firestore Rules Deployment Helper ===');
console.log('To deploy your Firestore rules, follow these steps:');
console.log('\n1. Install Firebase CLI if you haven\'t already:');
console.log('   npm install -g firebase-tools');
console.log('\n2. Log in to Firebase (if not already logged in):');
console.log('   firebase login');
console.log('\n3. Run this command to deploy your rules:');
console.log('   firebase deploy --only firestore:rules');
console.log('\n4. Verify your rules are deployed in the Firebase Console:');
console.log('   https://console.firebase.google.com/project/_/firestore/rules');
console.log('\nIf you encounter any issues:');
console.log('- Make sure you\'re logged into the correct Firebase account');
console.log('- Check that your project ID is correctly set in firebase.json');
console.log('- Verify your rules syntax is correct');
console.log('\nFor more help: https://firebase.google.com/docs/firestore/security/get-started'); 