# Silicon Circle

A community platform for teens interested in technology, featuring a forum system built with Firebase.

## Project Overview

Silicon Circle is a fully student-run organization website with:
- Modern landing page with animated computer display
- Event listings and makeathon information
- Application system for new members
- Community forum with subreddit support
- Firebase authentication and data storage

## Features

- **Modern UI**: Retro-futuristic design with CRT monitor effects
- **Authentication**: Secure user login/signup with email verification
- **Forum System**: Reddit-like forum with posts, comments, and subreddits
- **Real-time Data**: Powered by Firebase Firestore for real-time updates
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Register a web app in the project settings
4. Copy the config object and replace the values in `firebase-init.js`

### Enable Firebase Services

In the Firebase Console, enable:
1. **Authentication** with Email/Password provider
2. **Firestore Database** with appropriate security rules

## Deployment

The project can be deployed to any static hosting service like GitHub Pages, Netlify, or Vercel.

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Firebase (Authentication, Firestore)
- GSAP (Animations)
- Google Fonts (VT323)

## License

This project is open source and available under the MIT License.