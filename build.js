/**
 * Portfolio Website Build & Optimization Script
 * 
 * This script automates the optimization process for the entire portfolio website:
 * 1. Minifies CSS files
 * 2. Optimizes images
 * 3. Minifies HTML files
 * 4. Minifies JavaScript files
 * 
 * How to use:
 * 1. Install Node.js
 * 2. Run: npm install clean-css html-minifier terser sharp
 * 3. Run: node build.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const CleanCSS = require('clean-css');
const htmlMinifier = require('html-minifier');
const Terser = require('terser');
const sharp = require('sharp');

// Configuration
const CONFIG = {
    input: {
        root: __dirname,
        css: path.join(__dirname, 'css'),
        js: path.join(__dirname, 'js'),
        html: __dirname,
        assets: path.join(__dirname, 'assets')
    },
    output: {
        root: path.join(__dirname, 'dist'),
        css: path.join(__dirname, 'dist', 'css'),
        js: path.join(__dirname, 'dist', 'js'),
        html: path.join(__dirname, 'dist'),
        assets: path.join(__dirname, 'dist', 'assets')
    },
    excluded: {
        css: ['style.css.bak'],
        js: [],
        html: ['add-blog-posts.html', 'admin-blog.html', 'create-admin-user.html'],
        files: ['.git', 'node_modules', 'dist', 'build.js', 'optimize-css.js', 'optimize-images.js']
    },
    imageOptions: {
        jpeg: { quality: 80 },
        png: { compressionLevel: 9 },
        webp: { quality: 75 }
    },
    copyDirectories: ['fonts', 'icons', 'videos']
};

// Create output directories
function createDirectories() {
    console.log('Creating output directories...');
    Object.values(CONFIG.output).forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // Create directories for additional assets
    CONFIG.copyDirectories.forEach(dir => {
        const outputDir = path.join(CONFIG.output.root, dir);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    });
    
    console.log('✓ Output directories created');
}

// Minify CSS files
async function minifyCSS() {
    console.log('\nMinifying CSS files...');
    
    const cssFiles = fs.readdirSync(CONFIG.input.css);
    const filteredCssFiles = cssFiles.filter(file => 
        file.endsWith('.css') && !CONFIG.excluded.css.includes(file)
    );
    
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    
    for (const file of filteredCssFiles) {
        const inputPath = path.join(CONFIG.input.css, file);
        const outputPath = path.join(CONFIG.output.css, file);
        
        const css = fs.readFileSync(inputPath, 'utf8');
        const minified = new CleanCSS({
            level: 2, // Advanced optimization
            compatibility: 'ie8'
        }).minify(css);
        
        fs.writeFileSync(outputPath, minified.styles);
        
        const originalSize = Buffer.byteLength(css, 'utf8');
        const minifiedSize = Buffer.byteLength(minified.styles, 'utf8');
        
        totalOriginalSize += originalSize;
        totalMinifiedSize += minifiedSize;
        
        console.log(`  ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(minifiedSize / 1024).toFixed(2)} KB (${(100 - (minifiedSize / originalSize * 100)).toFixed(2)}% reduction)`);
    }
    
    console.log(`✓ CSS minification complete: ${(totalOriginalSize / 1024).toFixed(2)} KB → ${(totalMinifiedSize / 1024).toFixed(2)} KB (${(100 - (totalMinifiedSize / totalOriginalSize * 100)).toFixed(2)}% reduction)`);
}

// Minify JavaScript files
async function minifyJS() {
    console.log('\nMinifying JavaScript files...');
    
    const jsFiles = fs.readdirSync(CONFIG.input.js);
    const filteredJsFiles = jsFiles.filter(file => 
        file.endsWith('.js') && !CONFIG.excluded.js.includes(file)
    );
    
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    
    for (const file of filteredJsFiles) {
        const inputPath = path.join(CONFIG.input.js, file);
        const outputPath = path.join(CONFIG.output.js, file);
        
        const js = fs.readFileSync(inputPath, 'utf8');
        
        try {
            const minified = await Terser.minify(js, {
                compress: true,
                mangle: true
            });
            
            fs.writeFileSync(outputPath, minified.code);
            
            const originalSize = Buffer.byteLength(js, 'utf8');
            const minifiedSize = Buffer.byteLength(minified.code, 'utf8');
            
            totalOriginalSize += originalSize;
            totalMinifiedSize += minifiedSize;
            
            console.log(`  ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(minifiedSize / 1024).toFixed(2)} KB (${(100 - (minifiedSize / originalSize * 100)).toFixed(2)}% reduction)`);
        } catch (error) {
            console.error(`  Error minifying ${file}: ${error.message}`);
            // Copy the original file if there's an error
            fs.copyFileSync(inputPath, outputPath);
        }
    }
    
    console.log(`✓ JavaScript minification complete: ${(totalOriginalSize / 1024).toFixed(2)} KB → ${(totalMinifiedSize / 1024).toFixed(2)} KB (${(100 - (totalMinifiedSize / totalOriginalSize * 100)).toFixed(2)}% reduction)`);
}

// Minify HTML files
function minifyHTML() {
    console.log('\nMinifying HTML files...');
    
    const htmlFiles = fs.readdirSync(CONFIG.input.html).filter(file => 
        file.endsWith('.html') && !CONFIG.excluded.html.includes(file)
    );
    
    let totalOriginalSize = 0;
    let totalMinifiedSize = 0;
    
    for (const file of htmlFiles) {
        const inputPath = path.join(CONFIG.input.html, file);
        const outputPath = path.join(CONFIG.output.html, file);
        
        const html = fs.readFileSync(inputPath, 'utf8');
        
        const minified = htmlMinifier.minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true
        });
        
        fs.writeFileSync(outputPath, minified);
        
        const originalSize = Buffer.byteLength(html, 'utf8');
        const minifiedSize = Buffer.byteLength(minified, 'utf8');
        
        totalOriginalSize += originalSize;
        totalMinifiedSize += minifiedSize;
        
        console.log(`  ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(minifiedSize / 1024).toFixed(2)} KB (${(100 - (minifiedSize / originalSize * 100)).toFixed(2)}% reduction)`);
    }
    
    console.log(`✓ HTML minification complete: ${(totalOriginalSize / 1024).toFixed(2)} KB → ${(totalMinifiedSize / 1024).toFixed(2)} KB (${(100 - (totalMinifiedSize / totalOriginalSize * 100)).toFixed(2)}% reduction)`);
}

// Optimize images
async function optimizeImages() {
    console.log('\nOptimizing images...');
    
    // Create optimized directory if it doesn't exist
    const optimizedDir = path.join(CONFIG.output.assets, 'optimized');
    if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
    }
    
    // Define image extensions to process
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    try {
        // Get all files in assets directory
        const files = fs.readdirSync(CONFIG.input.assets);
        
        // Filter out image files
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });
        
        console.log(`  Found ${imageFiles.length} images to optimize`);
        
        let totalOriginalSize = 0;
        let totalOptimizedSize = 0;
        
        // Process each image
        for (const file of imageFiles) {
            const inputPath = path.join(CONFIG.input.assets, file);
            const fileStats = fs.statSync(inputPath);
            const originalSize = fileStats.size;
            totalOriginalSize += originalSize;
            
            const fileExt = path.extname(file).toLowerCase();
            const fileName = path.basename(file, fileExt);
            
            // Copy original to dist directory
            const outputPath = path.join(CONFIG.output.assets, file);
            fs.copyFileSync(inputPath, outputPath);
            
            // Create optimized version
            try {
                // WebP version
                const webpPath = path.join(optimizedDir, `${fileName}.webp`);
                await sharp(inputPath)
                    .webp(CONFIG.imageOptions.webp)
                    .toFile(webpPath);
                
                // Optimized original format
                const optimizedPath = path.join(optimizedDir, file);
                
                if (fileExt === '.jpg' || fileExt === '.jpeg') {
                    await sharp(inputPath)
                        .jpeg(CONFIG.imageOptions.jpeg)
                        .toFile(optimizedPath);
                } else if (fileExt === '.png') {
                    await sharp(inputPath)
                        .png(CONFIG.imageOptions.png)
                        .toFile(optimizedPath);
                } else {
                    // For other formats, just copy
                    fs.copyFileSync(inputPath, optimizedPath);
                }
                
                const optimizedStats = fs.statSync(optimizedPath);
                const webpStats = fs.statSync(webpPath);
                
                console.log(`  ${file}: ${(originalSize / 1024).toFixed(2)} KB → ${(optimizedStats.size / 1024).toFixed(2)} KB | WebP: ${(webpStats.size / 1024).toFixed(2)} KB`);
                
                totalOptimizedSize += optimizedStats.size;
            } catch (error) {
                console.error(`  Error optimizing ${file}: ${error.message}`);
                fs.copyFileSync(inputPath, path.join(optimizedDir, file));
            }
        }
        
        console.log(`✓ Image optimization complete: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)} MB → ${(totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB (${(100 - (totalOptimizedSize / totalOriginalSize * 100)).toFixed(2)}% reduction)`);
    } catch (error) {
        console.error('Error during image optimization:', error);
    }
}

// Copy other files and directories
function copyOtherFiles() {
    console.log('\nCopying other files...');
    
    // Copy additional directories
    CONFIG.copyDirectories.forEach(dir => {
        const inputDir = path.join(CONFIG.input.root, dir);
        const outputDir = path.join(CONFIG.output.root, dir);
        
        if (fs.existsSync(inputDir)) {
            // Create recursive copy function
            const copyDir = (src, dest) => {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest, { recursive: true });
                }
                
                const entries = fs.readdirSync(src, { withFileTypes: true });
                
                for (const entry of entries) {
                    const srcPath = path.join(src, entry.name);
                    const destPath = path.join(dest, entry.name);
                    
                    if (entry.isDirectory()) {
                        copyDir(srcPath, destPath);
                    } else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            };
            
            copyDir(inputDir, outputDir);
            console.log(`  ✓ Copied directory: ${dir}`);
        }
    });
    
    // Copy other important files (like README, favicon, etc.)
    const filesToCopy = [
        'favicon.ico',
        'robots.txt',
        'sitemap.xml',
        'README.md'
    ];
    
    filesToCopy.forEach(file => {
        const inputPath = path.join(CONFIG.input.root, file);
        const outputPath = path.join(CONFIG.output.root, file);
        
        if (fs.existsSync(inputPath)) {
            fs.copyFileSync(inputPath, outputPath);
            console.log(`  ✓ Copied file: ${file}`);
        }
    });
    
    console.log('✓ All additional files copied');
}

// Generate a manifest.json file for PWA support
function createManifest() {
    console.log('\nGenerating PWA manifest.json...');
    
    const manifest = {
        "name": "Muhammad Irfan - Portfolio",
        "short_name": "Irfan Portfolio",
        "description": "Muhammad Irfan's professional portfolio showcasing skills, projects, and experience",
        "start_url": "/index.html",
        "display": "standalone",
        "background_color": "#0f172a",
        "theme_color": "#3b82f6",
        "icons": [
            {
                "src": "assets/favicon-192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "assets/favicon-512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    };
    
    const outputPath = path.join(CONFIG.output.root, 'manifest.json');
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    
    console.log('✓ manifest.json created');
}

// Create a service worker for offline support
function createServiceWorker() {
    console.log('\nGenerating service-worker.js...');
    
    const serviceWorkerContent = `// Service Worker for Muhammad Irfan's Portfolio
const CACHE_NAME = 'irfan-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/skills.html',
    '/education.html',
    '/work-experience.html',
    '/projects.html',
    '/blog.html',
    '/contact.html',
    '/css/style.css',
    '/css/enhanced-header.css',
    '/css/mobile-menu-fix.css',
    '/js/script.js',
    '/js/performance-utils.js',
    '/assets/optimized/irfan1.webp',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response from the cached version
                if (response) {
                    return response;
                }
                
                // Not in cache - fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Don't cache if it's not a valid response or it's not a GET request
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' || event.request.method !== 'GET') {
                            return networkResponse;
                        }
                        
                        // Clone the response since it can only be consumed once
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return networkResponse;
                    });
            })
            .catch(error => {
                // If both cache and network failed, attempt to serve offline page
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                
                // For image requests, return a placeholder
                if (event.request.destination === 'image') {
                    return caches.match('/assets/placeholder.png');
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});`;
    
    const outputPath = path.join(CONFIG.output.root, 'service-worker.js');
    fs.writeFileSync(outputPath, serviceWorkerContent);
    
    console.log('✓ service-worker.js created');
}

// Create an offline page
function createOfflinePage() {
    console.log('\nGenerating offline.html...');
    
    const offlinePageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - Muhammad Irfan Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            background-color: #0f172a;
            color: #f9fafb;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
            padding: 2rem;
        }
        .container {
            max-width: 600px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #3b82f6;
        }
        p {
            margin-bottom: 2rem;
            font-size: 1.2rem;
        }
        .icon {
            font-size: 5rem;
            margin-bottom: 2rem;
            color: #8b5cf6;
        }
        .btn {
            display: inline-block;
            padding: 0.8rem 1.8rem;
            border-radius: 50px;
            font-weight: 500;
            background-color: #3b82f6;
            color: #fff;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background-color: #2563eb;
            transform: translateY(-3px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📶</div>
        <h1>You're Offline</h1>
        <p>Sorry, it seems you're currently offline and the page you requested hasn't been cached. Please check your internet connection and try again.</p>
        <a href="index.html" class="btn">Try Again</a>
    </div>
</body>
</html>`;
    
    const outputPath = path.join(CONFIG.output.root, 'offline.html');
    fs.writeFileSync(outputPath, offlinePageContent);
    
    console.log('✓ offline.html created');
}

// Generate package.json
function createPackageJson() {
    console.log('\nGenerating package.json...');
    
    const packageJson = {
        "name": "muhammad-irfan-portfolio",
        "version": "1.0.0",
        "description": "Muhammad Irfan's professional portfolio website",
        "main": "index.html",
        "scripts": {
            "optimize": "node build.js",
            "optimize-css": "node optimize-css.js",
            "optimize-images": "node optimize-images.js"
        },
        "dependencies": {
            "clean-css": "^4.2.4",
            "html-minifier": "^4.0.0",
            "sharp": "^0.32.1",
            "terser": "^5.17.2"
        },
        "author": "Muhammad Irfan",
        "license": "MIT"
    };
    
    const outputPath = path.join(CONFIG.input.root, 'package.json');
    fs.writeFileSync(outputPath, JSON.stringify(packageJson, null, 2));
    
    console.log('✓ package.json created');
}

// Main build function
async function build() {
    console.log('🚀 Starting build process...');
    console.log('------------------------');
    
    // Create package.json if it doesn't exist
    if (!fs.existsSync(path.join(CONFIG.input.root, 'package.json'))) {
        createPackageJson();
    }
    
    // Create output directories
    createDirectories();
    
    // Run optimization tasks
    await minifyCSS();
    await minifyJS();
    minifyHTML();
    await optimizeImages();
    copyOtherFiles();
    
    // Create PWA files
    createManifest();
    createServiceWorker();
    createOfflinePage();
    
    console.log('\n✨ Build complete! Files are ready in the dist directory.');
    console.log('To deploy the site, copy all files from the dist directory to your web server.');
}

// Run the build
build(); 