/**
 * Image Optimization Script
 * 
 * This script will optimize JPG and PNG images in the assets directory.
 * How to use: 
 * 1. Install Node.js
 * 2. Run npm install sharp
 * 3. Run node optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets');
const OUTPUT_DIR = path.join(__dirname, 'assets', 'optimized');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const SIZES = [
    { width: 2000, suffix: 'xlarge' },  // For very large screens
    { width: 1200, suffix: 'large' },   // For desktops
    { width: 800, suffix: 'medium' },   // For tablets
    { width: 480, suffix: 'small' }     // For phones
];
const QUALITY = 80; // Quality setting for JPG compression (0-100)

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process images
async function optimizeImages() {
    try {
        // Read all files in the assets directory
        const files = fs.readdirSync(ASSETS_DIR);
        
        // Filter for image files
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        });
        
        console.log(`Found ${imageFiles.length} images to optimize.`);
        
        let totalOriginalSize = 0;
        let totalOptimizedSize = 0;
        
        // Process each image
        for (const file of imageFiles) {
            const filePath = path.join(ASSETS_DIR, file);
            const fileStats = fs.statSync(filePath);
            const originalSize = fileStats.size;
            totalOriginalSize += originalSize;
            
            const fileExt = path.extname(file).toLowerCase();
            const fileName = path.basename(file, fileExt);
            
            console.log(`\nProcessing ${file}...`);
            console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
            
            // Create WebP version
            const webpOutputPath = path.join(OUTPUT_DIR, `${fileName}.webp`);
            await sharp(filePath)
                .webp({ quality: QUALITY })
                .toFile(webpOutputPath);
                
            const webpStats = fs.statSync(webpOutputPath);
            console.log(`  WebP size: ${(webpStats.size / 1024).toFixed(2)} KB`);
            console.log(`  WebP reduction: ${(100 - (webpStats.size / originalSize * 100)).toFixed(2)}%`);
            
            // Create responsive versions in original format and WebP
            for (const size of SIZES) {
                // Original format (JPG/PNG)
                const responsiveOutputPath = path.join(OUTPUT_DIR, `${fileName}-${size.suffix}${fileExt}`);
                
                if (fileExt === '.jpg' || fileExt === '.jpeg') {
                    await sharp(filePath)
                        .resize(size.width)
                        .jpeg({ quality: QUALITY })
                        .toFile(responsiveOutputPath);
                } else if (fileExt === '.png') {
                    await sharp(filePath)
                        .resize(size.width)
                        .png({ compressionLevel: 9 })
                        .toFile(responsiveOutputPath);
                }
                
                const optimizedStats = fs.statSync(responsiveOutputPath);
                
                // WebP format
                const responsiveWebPPath = path.join(OUTPUT_DIR, `${fileName}-${size.suffix}.webp`);
                await sharp(filePath)
                    .resize(size.width)
                    .webp({ quality: QUALITY })
                    .toFile(responsiveWebPPath);
                    
                const webpResStats = fs.statSync(responsiveWebPPath);
                
                console.log(`  ${size.suffix} (${size.width}px):`);
                console.log(`    ${fileExt.substring(1)}: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
                console.log(`    WebP: ${(webpResStats.size / 1024).toFixed(2)} KB`);
                
                totalOptimizedSize += optimizedStats.size;
            }
        }
        
        console.log(`\nOptimization Complete!`);
        console.log(`Total original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`Total optimized size (excluding WebP): ${(totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`Total reduction: ${(100 - (totalOptimizedSize / totalOriginalSize * 100)).toFixed(2)}%`);
        console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
        
        // Create HTML snippet example for responsive images
        console.log(`\nExample HTML for responsive images:`);
        console.log(`
<picture>
  <source 
    srcset="
      assets/optimized/image-small.webp 480w,
      assets/optimized/image-medium.webp 800w,
      assets/optimized/image-large.webp 1200w,
      assets/optimized/image-xlarge.webp 2000w"
    sizes="(max-width: 600px) 480px,
           (max-width: 1000px) 800px,
           (max-width: 1600px) 1200px,
           2000px"
    type="image/webp">
  <img 
    srcset="
      assets/optimized/image-small.jpg 480w,
      assets/optimized/image-medium.jpg 800w,
      assets/optimized/image-large.jpg 1200w,
      assets/optimized/image-xlarge.jpg 2000w"
    sizes="(max-width: 600px) 480px,
           (max-width: 1000px) 800px,
           (max-width: 1600px) 1200px,
           2000px"
    src="assets/optimized/image-large.jpg"
    loading="lazy"
    alt="Description">
</picture>
`);
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages(); 