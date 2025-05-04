# Cloudinary Setup Guide

## Introduction

This guide explains how to set up Cloudinary as a fallback image hosting solution when Firebase Storage encounters rate limit errors or other upload issues.

## Why Use Cloudinary as a Fallback?

Firebase Storage occasionally has limitations:
- Storage quotas can be quickly reached
- Rate limiting may occur during high traffic
- Network issues can cause upload failures
- The "Max retry time for operation exceeded" error can be persistent

By implementing Cloudinary as a fallback, you ensure:
- More reliable image uploads
- Better handling of large files
- Automatic image optimization
- Continued functionality when Firebase is experiencing issues

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/) and sign up for a free account
2. The free tier provides 25GB of storage and 25GB of monthly bandwidth

### 2. Get Your Cloudinary Credentials

After signing up:

1. Go to your Cloudinary Dashboard
2. Note down your **Cloud Name**, **API Key**, and **API Secret**
3. These credentials will be used in your configuration

### 3. Create an Upload Preset

For client-side uploads without exposing your API secret:

1. In the Cloudinary Dashboard, go to **Settings** > **Upload**
2. Scroll down to **Upload presets** and click **Add upload preset**
3. Set **Signing Mode** to **Unsigned**
4. Optionally, configure:
   - **Folder** to store uploads (e.g., "blog-images")
   - **Transformations** for automatic image processing
   - **Tags** for organization
5. Save the preset and note the **Preset Name**

### 4. Update Your Configuration

Update the `js/cloudinary-config.js` file with your credentials:

```javascript
const cloudinaryConfig = {
    cloudName: "YOUR_CLOUD_NAME",     // Replace with your Cloud Name
    uploadPreset: "YOUR_PRESET_NAME", // Replace with your Upload Preset name
    apiKey: "YOUR_API_KEY",           // Replace with your API Key
};
```

### 5. Test Your Configuration

1. Log in to your admin panel
2. Try uploading an image to create a blog post
3. If Firebase Storage fails, the system should automatically fall back to Cloudinary
4. Verify the upload was successful and the image displays correctly

## Troubleshooting

### Image Upload Failure

If images fail to upload:

1. Check the browser console for error messages
2. Verify your Cloudinary credentials in `cloudinary-config.js`
3. Ensure your upload preset is set to "Unsigned"
4. Try uploading a smaller image (under 10MB)

### CORS Issues

If you experience Cross-Origin Resource Sharing (CORS) errors:

1. Go to Cloudinary Dashboard > Settings > Security
2. Add your website domain to the "Allowed CORS origins" field
3. Save the settings

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload API Reference](https://cloudinary.com/documentation/image_upload_api_reference)
- [Image Transformations Guide](https://cloudinary.com/documentation/image_transformations)

## Support

If you need assistance, please contact the website administrator. 