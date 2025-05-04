/**
 * CSS Optimization Script
 * 
 * This script will minify CSS files in the css directory.
 * How to use: 
 * 1. Install Node.js
 * 2. Run npm install clean-css
 * 3. Run node optimize-css.js
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// Configuration
const CSS_DIR = path.join(__dirname, 'css');
const OUTPUT_DIR = path.join(__dirname, 'css', 'minified');
const EXCLUDED_FILES = ['style.css.bak']; // Files to exclude

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process CSS files
fs.readdir(CSS_DIR, (err, files) => {
    if (err) {
        console.error('Error reading CSS directory:', err);
        return;
    }

    // Filter for CSS files and exclude specified files
    const cssFiles = files.filter(file => 
        file.endsWith('.css') && !EXCLUDED_FILES.includes(file)
    );

    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;

    cssFiles.forEach(file => {
        const filePath = path.join(CSS_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, file);
        
        // Read the CSS file
        const css = fs.readFileSync(filePath, 'utf8');
        
        // Minify the CSS
        const minified = new CleanCSS({
            level: 2, // Advanced optimization
            compatibility: 'ie8', // IE8 compatibility
            format: 'keep-breaks', // Keep important breaks for readability
        }).minify(css);

        // Write the minified CSS to the output directory
        fs.writeFileSync(outputPath, minified.styles);
        
        const originalSize = Buffer.byteLength(css, 'utf8');
        const minifiedSize = Buffer.byteLength(minified.styles, 'utf8');
        
        // Update totals
        totalOriginalSize += originalSize;
        totalMinifiedSize += minifiedSize;
        
        // Log the results
        console.log(`Processed ${file}:`);
        console.log(`  Original size: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`  Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
        console.log(`  Reduction: ${(100 - (minifiedSize / originalSize * 100)).toFixed(2)}%`);
    });

    console.log(`\nTotal:`);
    console.log(`  Original size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`  Minified size: ${(totalMinifiedSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${(100 - (totalMinifiedSize / totalOriginalSize * 100)).toFixed(2)}%`);
    
    console.log(`\nMinified CSS files have been saved to ${OUTPUT_DIR}`);
    console.log('To use these files, update your HTML to point to the minified versions.');
}); 