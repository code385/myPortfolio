// Cloudinary Configuration
const cloudinaryConfig = {
    cloudName: "dtgveegkr",     // Your Cloudinary cloud name
    uploadPreset: "portfolio",  // Your upload preset name
    apiKey: "462661118142627",  // Your Cloudinary API key
};

// Debug flag for development
cloudinaryConfig.debug = false;

// Helper functions
const cloudinaryHelpers = {
    // Get upload URL for direct uploads
    getUploadUrl: function() {
        return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    },
    
    // Format Cloudinary URL to request specific transformations
    transformImage: function(url, options = {}) {
        if (!url || !url.includes('cloudinary.com')) return url;
        
        // Default options
        const defaults = {
            width: null,
            height: null,
            crop: 'fill',
            quality: 'auto',
            fetchFormat: 'auto'
        };
        
        // Merge options
        const settings = {...defaults, ...options};
        
        // Build transformation string
        let transformations = [];
        
        if (settings.width || settings.height) {
            let dimension = '';
            if (settings.width) dimension += `w_${settings.width}`;
            if (settings.width && settings.height) dimension += ',';
            if (settings.height) dimension += `h_${settings.height}`;
            if (settings.crop) dimension += `,c_${settings.crop}`;
            transformations.push(dimension);
        }
        
        transformations.push(`q_${settings.quality}`);
        transformations.push(`f_${settings.fetchFormat}`);
        
        // Replace the upload part of the URL
        return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
    },
    
    // Delete an image from Cloudinary
    deleteImage: async function(publicId) {
        if (!publicId) return {success: false, error: 'No public ID provided'};
        
        try {
            // This requires server-side signature for security
            // In a real implementation, this should call your backend API
            console.warn('Cloudinary deletion requires server-side implementation for security');
            return {
                success: false, 
                error: 'Direct deletion not implemented. Implement through server API.'
            };
        } catch (error) {
            return {success: false, error: error.message};
        }
    }
}; 