# Silicon Circle

A community platform for teens interested in technology, featuring a forum system built with Firebase.

## Project Overview

Silicon Circle is a fully student-run organization website with:
- Modern landing page with animated computer display
- Event listings and makeathon information
- Application system for new members
- Community forum with subreddit support
- Firebase authentication and data storage

## Setup Instructions

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Register a web app in the project settings
4. Copy the config object and replace the values in `firebase-init.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### Enable Firebase Services

In the Firebase Console, enable the following services:
1. **Authentication**
   - Enable Email/Password sign-in method
2. **Firestore Database**
   - Create a new database in production mode
   - Set up security rules (see below)

### Firestore Security Rules

Set the following security rules in Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection
    match /posts/{document} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.author.uid;
    }
    
    // Comments collection
    match /comments/{document} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.author.uid;
    }
    
    // Subreddits collection
    match /subreddits/{document} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy.uid;
    }
  }
}
```

## Deployment

### GitHub Pages Deployment

To deploy to GitHub Pages:

1. Remove the `github_files` directory if it exists:
   ```bash
   rm -rf github_files
   ```
2. Remove any phantom submodule references:
   ```bash
   git rm --cached github_files
   ```
3. Create a new repository on GitHub
4. Push the code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
5. In GitHub repository settings, enable GitHub Pages from the main branch

## Features Completed

- [x] Modern landing page with animated computer display
- [x] Firebase authentication (Email/Password with email verification)
- [x] Forum with post creation and commenting
- [x] Subreddit system
- [x] Upvoting system
- [x] Responsive design

## Features to Implement

- [ ] Edit/delete posts and comments
- [ ] User profile pages
- [ ] Subreddit moderation features
- [ ] Notifications system
- [ ] Image/file uploads
- [ ] Search functionality
- [ ] Mobile app (PWA)

## Troubleshooting

### Email Verification Not Received

If users aren't receiving email verification emails:

1. Check Firebase Authentication settings
2. Verify the domain is correctly configured
3. Check spam/junk folders
4. Ensure the email template is properly set up in Firebase Console

### GitHub Pages Deployment Issues

If you're seeing phantom submodule issues:

1. Remove the `github_files` directory
2. Clear Git cache:
   ```bash
   git rm --cached github_files
   ```
3. Remove any entries in `.gitmodules` file
4. Commit and push changes

## Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- Firebase (Authentication, Firestore)
- GSAP (Animations)
- Google Fonts (VT323)

## License

This project is open source and available under the MIT License.