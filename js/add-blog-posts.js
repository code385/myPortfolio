// Initialize Firebase
const db = firebase.firestore();

// Sample blog posts data
const blogPosts = [
    {
        title: "Getting Started with Web Development",
        content: "Web development is an exciting field that combines creativity with technical skills. In this post, we'll explore the fundamentals of HTML, CSS, and JavaScript, and how they work together to create beautiful, interactive websites. We'll also discuss modern frameworks and tools that can help you become a more efficient developer.",
        excerpt: "Learn the basics of web development and discover the essential tools and technologies every developer should know.",
        category: "web",
        date: firebase.firestore.Timestamp.fromDate(new Date("2023-10-15")),
        imageUrl: "images/blog/web-dev.jpg"
    },
    {
        title: "Building Your First Mobile App",
        content: "Mobile app development has become increasingly important in today's digital landscape. This guide will walk you through the process of creating your first mobile application, from choosing the right framework to publishing on app stores. We'll cover both native and cross-platform development approaches.",
        excerpt: "A comprehensive guide to mobile app development for beginners, covering essential concepts and best practices.",
        category: "mobile",
        date: firebase.firestore.Timestamp.fromDate(new Date("2023-11-20")),
        imageUrl: "images/blog/mobile-dev.jpg"
    },
    {
        title: "Introduction to Machine Learning",
        content: "Machine learning is revolutionizing industries across the globe. In this article, we'll explore the basics of machine learning, including supervised and unsupervised learning, neural networks, and deep learning. We'll also discuss practical applications and how to get started with ML projects.",
        excerpt: "Discover the fundamentals of machine learning and how it's transforming technology and business.",
        category: "ai",
        date: firebase.firestore.Timestamp.fromDate(new Date("2023-12-05")),
        imageUrl: "images/blog/ml.jpg"
    },
    {
        title: "Career Tips for Software Developers",
        content: "Building a successful career in software development requires more than just technical skills. This post covers essential career advice, including how to build a strong portfolio, network effectively, and stay updated with industry trends. We'll also discuss salary negotiation and career progression.",
        excerpt: "Essential career advice for software developers looking to advance their professional journey.",
        category: "career",
        date: firebase.firestore.Timestamp.fromDate(new Date("2024-01-10")),
        imageUrl: "images/blog/career.jpg"
    },
    {
        title: "Responsive Web Design Best Practices",
        content: "In today's multi-device world, responsive design is crucial. This article covers the best practices for creating websites that work seamlessly across all devices. We'll discuss CSS Grid, Flexbox, media queries, and modern approaches to responsive design.",
        excerpt: "Learn the best practices for creating responsive websites that work perfectly on all devices.",
        category: "web",
        date: firebase.firestore.Timestamp.fromDate(new Date("2024-02-15")),
        imageUrl: "images/blog/responsive.jpg"
    },
    {
        title: "The Future of AI in Software Development",
        content: "Artificial Intelligence is changing how we develop software. This post explores the latest AI tools and techniques that are transforming the development process, from code generation to testing and deployment. We'll also discuss the ethical considerations of AI in development.",
        excerpt: "Explore how AI is revolutionizing software development and what the future holds for developers.",
        category: "ai",
        date: firebase.firestore.Timestamp.fromDate(new Date("2024-03-01")),
        imageUrl: "images/blog/ai-future.jpg"
    }
];

// Function to add blog posts to Firestore
async function addBlogPosts() {
    try {
        for (const post of blogPosts) {
            await db.collection('blogPosts').add(post);
            console.log(`Added post: ${post.title}`);
        }
        console.log('All blog posts added successfully!');
    } catch (error) {
        console.error('Error adding blog posts:', error);
    }
}

// Call the function to add posts
addBlogPosts();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase (uses the firebase-config.js)
    console.log("Starting blog post creation script...");
    
    // Listen for Firebase initialization
    document.addEventListener('firebase-ready', function(e) {
        if (e.detail.success) {
            console.log("Firebase ready, starting blog post creation");
            createSampleBlogPosts();
        } else {
            console.error("Firebase failed to initialize:", e.detail.error);
            document.body.innerHTML += "<p>Error: Firebase failed to initialize</p>";
        }
    });
    
    async function createSampleBlogPosts() {
        try {
            // Make sure Firebase and Firestore are available
            if (!firebase || !firebase.firestore) {
                throw new Error("Firebase or Firestore not available");
            }
            
            const db = firebase.firestore();
            const blogCollection = db.collection('blogPosts');
            
            // Sample blog posts data
            const samplePosts = [
                {
                    title: "Getting Started with HTML and CSS",
                    category: "web",
                    excerpt: "A beginner's guide to understanding HTML structure and CSS styling basics.",
                    content: `# Getting Started with HTML and CSS

HTML and CSS are the fundamental building blocks of the web. In this article, we'll cover the basics of both technologies.

## HTML Basics

HTML (HyperText Markup Language) provides the structure of a webpage. It uses elements enclosed in tags to define different parts of a document.

Here's a simple HTML structure:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage.</p>
</body>
</html>
```

## CSS Basics

CSS (Cascading Style Sheets) is used to style HTML elements. You can change colors, fonts, spacing, and more with CSS.

Basic CSS syntax looks like this:

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    line-height: 1.6;
    color: #666;
}
```

## Combining HTML and CSS

To link a CSS file to an HTML document, you use the <link> tag in the <head> section:

```html
<head>
    <title>My First Webpage</title>
    <link rel="stylesheet" href="styles.css">
</head>
```

This is just the beginning of your web development journey. Practice by creating simple pages and gradually adding more complex features as you learn.`,
                    date: new Date(),
                    imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Introduction to JavaScript for Beginners",
                    category: "web",
                    excerpt: "Learn the basics of JavaScript to add interactivity to your websites.",
                    content: `# Introduction to JavaScript for Beginners

JavaScript is the programming language of the web that allows you to add dynamic behavior to your websites.

## What is JavaScript?

JavaScript is a versatile programming language that runs in web browsers. It allows you to:
- Respond to user interactions
- Modify HTML content
- Validate forms
- Create animations
- Communicate with servers

## Basic JavaScript Syntax

Here's a simple JavaScript example:

```javascript
// Variables
let name = "John";
const age = 30;

// Functions
function greet() {
    console.log("Hello, " + name + "!");
}

// Calling a function
greet();

// Conditionals
if (age >= 18) {
    console.log("You are an adult.");
} else {
    console.log("You are under 18.");
}

// Loops
for (let i = 0; i < 5; i++) {
    console.log("Count: " + i);
}
```

## Adding JavaScript to HTML

You can add JavaScript to your HTML using the <script> tag:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My JavaScript Page</title>
</head>
<body>
    <h1 id="heading">Hello World</h1>
    <button onclick="changeText()">Click Me</button>

    <script>
        function changeText() {
            document.getElementById("heading").innerHTML = "Text Changed!";
        }
    </script>
</body>
</html>
```

## JavaScript Events

JavaScript can respond to events like clicks, form submissions, and page loading:

```javascript
// Wait for the document to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Get a reference to a button
    const button = document.getElementById("myButton");
    
    // Add a click event listener
    button.addEventListener("click", function() {
        alert("Button was clicked!");
    });
});
```

Practice these concepts by creating small projects, and you'll be on your way to mastering JavaScript!`,
                    date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
                    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Responsive Web Design Fundamentals",
                    category: "web",
                    excerpt: "Learn how to create websites that look great on all devices using responsive design principles.",
                    content: `# Responsive Web Design Fundamentals

In today's multi-device world, it's crucial to create websites that work well on screens of all sizes. This is where responsive web design comes in.

## What is Responsive Web Design?

Responsive web design is an approach that makes web pages render well on different devices and window sizes. Instead of creating separate websites for different devices, a single responsive site adapts to the viewer's screen.

## Key Principles of Responsive Design

### 1. Flexible Grids

Use relative units like percentages rather than fixed units like pixels for layout elements:

```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.column {
    width: 33.33%;
    float: left;
    padding: 15px;
}
```

### 2. Flexible Images

Make images scale with their containers:

```css
img {
    max-width: 100%;
    height: auto;
}
```

### 3. Media Queries

Use CSS media queries to apply different styles based on the device's characteristics:

```css
/* Base styles for all devices */
body {
    font-size: 16px;
}

/* Styles for tablets */
@media (max-width: 768px) {
    body {
        font-size: 14px;
    }
    .column {
        width: 50%;
    }
}

/* Styles for mobile phones */
@media (max-width: 480px) {
    body {
        font-size: 12px;
    }
    .column {
        width: 100%;
        float: none;
    }
}
```

## Mobile-First Approach

Start by designing for the smallest screen, then progressively enhance the design for larger screens. This ensures your essential content works well on all devices.

```css
/* Mobile first - base styles for small screens */
.navigation {
    display: none;
}
.mobile-menu {
    display: block;
}

/* Then enhance for larger screens */
@media (min-width: 768px) {
    .navigation {
        display: block;
    }
    .mobile-menu {
        display: none;
    }
}
```

## Testing Responsive Designs

Always test your responsive designs on actual devices or using browser developer tools. Look for issues with:
- Layout
- Text readability
- Button/link tap targets
- Image scaling
- Navigation usability

By applying these responsive web design principles, you'll create websites that deliver a great user experience across all devices, from smartphones to desktop computers.`,
                    date: new Date(new Date().setDate(new Date().getDate() - 4)), // 4 days ago
                    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Flutter vs React Native: Choosing the Right Mobile Framework",
                    category: "mobile",
                    excerpt: "A comparison of two popular cross-platform mobile development frameworks to help you choose the right one for your project.",
                    content: `# Flutter vs React Native: Choosing the Right Mobile Framework

Cross-platform mobile development has evolved significantly in recent years. Two frameworks stand out in this space: Flutter and React Native. Let's compare them to help you choose the right one for your next project.

## Flutter Overview

Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.

### Flutter Pros

1. **Performance**: Flutter applications compile to native code, offering near-native performance.

2. **Consistent UI**: Flutter's widget-based architecture allows for pixel-perfect consistency across platforms.

3. **Hot Reload**: Make changes and see them instantly without losing the application state.

4. **Single Codebase**: Write once, run on both iOS and Android with minimal platform-specific code.

5. **Strong Developer Tools**: Excellent debugging tools and comprehensive documentation.

### Flutter Cons

1. **Large App Size**: Flutter apps tend to be larger than native apps.

2. **Relatively New**: The ecosystem is still growing compared to React Native.

3. **Learning Curve**: Requires learning Dart, which isn't as widely used as JavaScript.

## React Native Overview

React Native, developed by Facebook, allows you to build mobile apps using JavaScript and React.

### React Native Pros

1. **JavaScript & React**: Use familiar web technologies and the large npm ecosystem.

2. **Large Community**: Mature ecosystem with many libraries and resources.

3. **Fast Refresh**: Similar to Flutter's hot reload for rapid development.

4. **Native Components**: Uses the platform's standard rendering engines, resulting in a native look and feel.

5. **Web Developer Friendly**: Easy transition for React web developers.

### React Native Cons

1. **Performance**: Can lag behind Flutter for complex animations and heavy computations.

2. **Platform Inconsistencies**: May require platform-specific code for consistent behavior.

3. **Third-Party Dependencies**: Heavy reliance on community-maintained libraries.

4. **Native Module Bridging**: Can be complex when integrating with native code.

## Which Framework Should You Choose?

### Choose Flutter if:

- You need highly custom, complex UI with animations
- Performance is a critical concern
- You want more predictable behavior across platforms
- You don't mind learning Dart
- You're building an app from scratch

### Choose React Native if:

- You or your team already know JavaScript/React
- You need to integrate with lots of web services
- Your app UI mostly follows platform conventions
- You want to share code with a web version
- You need to leverage a large ecosystem of JavaScript libraries

## Conclusion

Both Flutter and React Native are excellent frameworks with their own strengths. Your choice should depend on your team's expertise, project requirements, and long-term goals. For UI-heavy applications with custom designs, Flutter might be better. For web developers looking to enter mobile development or projects requiring extensive third-party integrations, React Native could be the way to go.`,
                    date: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
                    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Introduction to Machine Learning Concepts",
                    category: "ai",
                    excerpt: "A beginner-friendly explanation of core machine learning concepts and terminology.",
                    content: `# Introduction to Machine Learning Concepts

Machine learning is revolutionizing industries from healthcare to finance. This article introduces key machine learning concepts for beginners.

## What is Machine Learning?

Machine learning is a subset of artificial intelligence that enables computers to learn from data without being explicitly programmed. Instead of writing rules manually, we train models on data, and they improve their performance with experience.

## Types of Machine Learning

### Supervised Learning

In supervised learning, the algorithm learns from labeled training data. It's like learning with a teacher who shows you questions (inputs) and answers (outputs).

**Examples:**
- Predicting house prices based on features (regression)
- Classifying emails as spam or not spam (classification)
- Image recognition (classification)

### Unsupervised Learning

Unsupervised learning works with unlabeled data, finding patterns and relationships without guidance.

**Examples:**
- Customer segmentation (clustering)
- Anomaly detection
- Feature learning

### Reinforcement Learning

Reinforcement learning involves an agent learning to make decisions by taking actions in an environment to maximize rewards.

**Examples:**
- Game playing (like Chess or Go)
- Robot navigation
- Resource management

## Key Machine Learning Terminology

### Features and Labels

- **Features**: The input variables used to make predictions
- **Labels**: The output variable we're trying to predict (in supervised learning)

### Training and Testing

- **Training**: The process of learning patterns from data
- **Testing**: Evaluating the model on unseen data to measure performance

### Overfitting and Underfitting

- **Overfitting**: When a model learns the training data too well, including its noise and outliers
- **Underfitting**: When a model is too simple to capture the underlying pattern in the data

### Model Evaluation

- **Accuracy**: Percentage of correct predictions
- **Precision**: Ratio of true positives to all positive predictions
- **Recall**: Ratio of true positives to all actual positives
- **F1-Score**: Harmonic mean of precision and recall

## Common Machine Learning Algorithms

1. **Linear Regression**: For predicting continuous values
2. **Logistic Regression**: For binary classification problems
3. **Decision Trees**: Tree-structured models for classification and regression
4. **Random Forest**: Ensemble of decision trees for improved accuracy
5. **Support Vector Machines (SVM)**: For classification with clear margins
6. **K-Means**: For clustering data into groups
7. **Neural Networks**: Deep learning models inspired by the human brain

## Getting Started with Machine Learning

If you're interested in machine learning, here are some steps to get started:

1. Learn Python, the most popular language for ML
2. Study statistics and linear algebra fundamentals
3. Start with simple algorithms like linear regression
4. Use libraries like scikit-learn for implementation
5. Work on small projects with public datasets
6. Gradually move to more complex algorithms

Machine learning has a learning curve, but with consistent practice and understanding of these fundamental concepts, you can begin building powerful models for various applications.`,
                    date: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
                    imageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "How to Build an Effective Tech Portfolio",
                    category: "career",
                    excerpt: "Learn how to create a standout portfolio that will impress potential employers and clients in the tech industry.",
                    content: `# How to Build an Effective Tech Portfolio

A strong portfolio is crucial for tech professionals to showcase their skills and land opportunities. Whether you're a developer, designer, or data scientist, here's how to create a portfolio that stands out.

## Why You Need a Portfolio

A portfolio serves multiple purposes:
- Demonstrates your skills beyond a resume
- Shows your ability to complete projects
- Highlights your unique style and approach
- Provides talking points for interviews
- Establishes your personal brand in the industry

## Essential Elements of a Tech Portfolio

### 1. Focused Personal Statement

Start with a clear, concise statement about who you are and what you do. Keep it under 200 words and focus on your specialties and career goals.

Example:
> "Full-stack developer with 3 years of experience building React applications and Node.js backends. Passionate about creating intuitive user experiences and scalable architectures. Looking for opportunities to solve complex problems in fintech or healthcare."

### 2. Showcase Your Best Projects

Quality trumps quantity. Include 3-6 projects that demonstrate:
- Different skills and technologies
- Your role and contributions (especially for team projects)
- Problem-solving abilities
- Impact and results

For each project, include:
- Project name and description
- Technologies used
- Your specific role
- Screenshots or demos
- Links to live sites and repositories
- Challenges and how you overcame them

### 3. Skills Section

List relevant technical skills categorized by:
- Programming languages
- Frameworks and libraries
- Tools and platforms
- Methodologies
- Soft skills

Avoid listing skills you've only briefly encountered. Focus on technologies you could confidently discuss in an interview.

### 4. Clean, Professional Design

Your portfolio's design speaks volumes about your attention to detail:
- Ensure responsive design for all devices
- Use consistent typography and color schemes
- Prioritize fast loading times
- Make navigation intuitive
- Ensure accessibility
- Avoid clutter and distractions

### 5. About Page

Include a personalized about page that shows your:
- Professional journey
- Educational background
- Values and working style
- Interests and hobbies (briefly)
- Professional photo

### 6. Easy Contact Information

Make it simple for potential employers to reach you:
- Email address
- LinkedIn profile
- GitHub/GitLab/Bitbucket
- Other relevant professional networks

## Portfolio Platforms and Options

Choose the right platform based on your skills and needs:

1. **Custom Website**: Shows coding skills but requires maintenance
2. **GitHub Pages**: Free, developer-friendly, integrated with your repositories
3. **Template Services**: Like Wix, Squarespace, or WordPress for quick setup
4. **Specialized Platforms**: Behance (design), Kaggle (data science), etc.

## Maintaining Your Portfolio

A stale portfolio can hurt more than help:
- Update regularly with new projects
- Remove outdated technologies
- Refresh the design annually
- Update your bio as your career progresses
- Fix any broken links or issues promptly

## Conclusion

An effective tech portfolio is your 24/7 professional showcase. Invest time in creating something that represents your best work and aligns with your career goals. Remember that your portfolio itself is a project - it demonstrates your skills in design, development, and professional presentation.`,
                    date: new Date(new Date().setDate(new Date().getDate() - 15)), // 15 days ago
                    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                }
            ];
            
            console.log("Starting to add sample blog posts...");
            
            // Create a counter for successful posts
            let successCount = 0;
            
            // Add each post to Firestore
            for (const post of samplePosts) {
                try {
                    // Check if a post with this title already exists
                    const querySnapshot = await blogCollection.where('title', '==', post.title).limit(1).get();
                    
                    if (!querySnapshot.empty) {
                        console.log(`Post "${post.title}" already exists, skipping...`);
                        continue;
                    }
                    
                    // Add the post to Firestore
                    await blogCollection.add(post);
                    successCount++;
                    console.log(`Added post: ${post.title}`);
                } catch (error) {
                    console.error(`Error adding post "${post.title}":`, error);
                }
            }
            
            // Display results on the page
            document.body.innerHTML = `
                <h1>Blog Post Creation Completed</h1>
                <p>Successfully added ${successCount} out of ${samplePosts.length} posts.</p>
                <p>You can now <a href="blog.html">view your blog</a> or <a href="admin-blog.html">manage posts in the admin panel</a>.</p>
            `;
            
        } catch (error) {
            console.error("Error in createSampleBlogPosts:", error);
            document.body.innerHTML += `<p>Error: ${error.message}</p>`;
        }
    }
}); 