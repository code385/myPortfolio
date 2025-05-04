// Image upload utility for Firebase Storage

// Function to upload an image to Firebase Storage
async function uploadImageToStorage(file, folder = 'blog-images') {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        // Create a storage reference
        const storageRef = storage.ref();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const fileRef = storageRef.child(fileName);
        
        // Upload the file
        const uploadTask = fileRef.put(file);
        
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
            // Progress function
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            // Error function
            (error) => {
                console.error('Upload failed:', error);
                reject(error);
            }, 
            // Complete function
            async () => {
                // Get the download URL
                try {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    resolve({
                        url: downloadURL,
                        path: fileName,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

// Function to delete an image from Firebase Storage
async function deleteImageFromStorage(imagePath) {
    if (!imagePath) return Promise.reject('No image path provided');
    
    try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(imagePath);
        await imageRef.delete();
        return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
        console.error('Error deleting image:', error);
        return Promise.reject(error);
    }
} 