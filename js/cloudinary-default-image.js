// Cloudinary Default Images Helper
// This script helps you set up default images in your Cloudinary account

/**
 * This script is a reference for manually uploading a default blog image to Cloudinary.
 * You don't need to run this script directly. Instead, follow these steps:
 * 
 * 1. Log in to your Cloudinary dashboard: https://cloudinary.com/console
 * 2. Click on "Media Library" in the top menu
 * 3. Click "Upload" button 
 * 4. Upload an image to serve as your default blog post image
 * 5. After upload, click on the image to view its details
 * 6. Copy the "Public ID" and URL
 * 7. Update the 'imageUrl' in your handleFormSubmit function with this URL
 *
 * Example URL format in Cloudinary:
 * https://res.cloudinary.com/dtgveegkr/image/upload/v1685000000/portfolio/default-blog-image.jpg
 *
 * Where:
 * - dtgveegkr is your cloud name
 * - v1685000000 is the version
 * - portfolio/default-blog-image.jpg is the public ID with folder structure
 */

// If you prefer a programmatic approach, here's how you could upload a default image:
async function uploadDefaultImage() {
    const cloudName = cloudinaryConfig.cloudName;
    const uploadPreset = cloudinaryConfig.uploadPreset;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    // Default image - replace with your own default image URL or base64 data
    const defaultImageUrl = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    
    try {
        // First fetch the image
        const imageResponse = await fetch(defaultImageUrl);
        const blob = await imageResponse.blob();
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'portfolio');
        formData.append('public_id', 'default-blog-image');
        
        // Upload to Cloudinary
        const uploadResponse = await fetch(url, {
            method: 'POST',
            body: formData
        });
        
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload default image');
        }
        
        const data = await uploadResponse.json();
        console.log('Default image uploaded successfully:', data.secure_url);
        return data.secure_url;
        
    } catch (error) {
        console.error('Error uploading default image:', error);
        throw error;
    }
}

// Note: Don't call this function automatically
// Uncomment and run it manually if needed
// uploadDefaultImage().catch(console.error); 