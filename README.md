# Muhammad Irfan - Portfolio Website

A responsive personal portfolio website with a blog functionality integrated with Firebase.

## Features

### Main Portfolio
- Responsive design with modern UI
- Dark mode support
- Sections for Home, About, Skills, Education, Experience, Projects, Blog, and Contact
- Optimized animations and performance

### Blog Section
- Dynamic blog posts loaded from Firebase
- Search functionality
- Category filtering
- Newsletter subscription
- Individual blog post pages with related posts

## Blog Setup

The blog functionality is implemented using Firebase Firestore as the backend database. To set up the blog functionality:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore database in your project
3. Replace the placeholders in `js/firebase-config.js` with your Firebase project credentials
4. Add blog posts by running the `add-blog-posts.html` page once

## Blog Structure

The blog functionality consists of the following files:

- `blog.html` - Main blog page with post listings
- `blog-post.html` - Individual blog post detail page
- `css/blog.css` - Styling for the blog listing page
- `css/blog-post.css` - Styling for the blog post detail page
- `js/blog.js` - JavaScript for the blog listing page
- `js/blog-post.js` - JavaScript for the blog post detail page
- `js/add-blog-posts.js` - Script to add sample blog posts to Firebase

## Firebase Collections

The blog functionality uses the following Firebase collections:

- `blogPosts` - Collection for blog post data with the following fields:
  - `title` - Post title
  - `content` - Post content
  - `excerpt` - Short excerpt for preview (optional)
  - `category` - Post category (web, mobile, ai, career)
  - `date` - Publication date (Firestore timestamp)
  - `imageUrl` - URL to post image (optional)

- `newsletterSubscribers` - Collection for newsletter subscribers with the following fields:
  - `email` - Subscriber email
  - `timestamp` - Subscription date

## Credits

- Font Awesome for icons
- Google Fonts for typography
- AOS for animations
- Firebase for backend functionality 