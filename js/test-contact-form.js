/**
 * Contact Form Test Script
 * This script adds a button to test the contact form functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create a test button
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Contact Form';
    testButton.id = 'test-contact-form';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '10px 15px';
    testButton.style.backgroundColor = '#3b82f6';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    testButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    
    // Add tooltip
    testButton.title = 'Run a test to verify the contact form is working';
    
    // Only display the button on the contact page
    if (window.location.pathname.includes('contact.html')) {
        document.body.appendChild(testButton);
    }
    
    // Add click event
    testButton.addEventListener('click', async function() {
        console.log('Running contact form test...');
        testButton.disabled = true;
        testButton.textContent = 'Testing...';
        
        try {
            // Check if Firebase is available
            if (!firebase) {
                throw new Error('Firebase is not available');
            }
            
            // Test Firestore connectivity
            const db = window.db || firebase.firestore();
            if (!db) {
                throw new Error('Firestore is not initialized');
            }
            
            // Test writing to Firestore
            console.log('Testing writing to Firestore...');
            const testDoc = await db.collection('contactSubmissions').add({
                name: 'Test User',
                email: 'test@example.com',
                subject: 'Test Message',
                message: 'This is a test message sent at ' + new Date().toString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'unread',
                isTest: true
            });
            
            console.log('Test message sent successfully:', testDoc.id);
            
            // Test reading from Firestore
            console.log('Testing reading from Firestore...');
            const docSnapshot = await db.collection('contactSubmissions').doc(testDoc.id).get();
            if (!docSnapshot.exists) {
                throw new Error('Test document not found after writing');
            }
            
            const docData = docSnapshot.data();
            console.log('Test document read successfully:', docData);
            
            // Delete the test document to clean up
            console.log('Cleaning up test document...');
            await db.collection('contactSubmissions').doc(testDoc.id).delete();
            console.log('Test document cleaned up');
            
            // Show success message
            alert('Contact form test successful! Form is working correctly.');
            testButton.style.backgroundColor = '#10b981';
            testButton.textContent = 'Test Successful!';
            
            setTimeout(() => {
                testButton.style.backgroundColor = '#3b82f6';
                testButton.textContent = 'Test Contact Form';
                testButton.disabled = false;
            }, 3000);
            
        } catch (error) {
            console.error('Contact form test failed:', error);
            alert('Contact form test failed: ' + error.message);
            testButton.style.backgroundColor = '#ef4444';
            testButton.textContent = 'Test Failed!';
            
            setTimeout(() => {
                testButton.style.backgroundColor = '#3b82f6';
                testButton.textContent = 'Test Contact Form';
                testButton.disabled = false;
            }, 3000);
        }
    });
}); 