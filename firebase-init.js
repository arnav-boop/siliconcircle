// Replace the config below with your own Firebase project config
// Instructions:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Register a web app in the project settings
// 4. Copy the config object and replace the values below

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Optional: Enable offline persistence
// firebase.firestore().enablePersistence().catch((err) => {
//   if (err.code == 'failed-precondition') {
//     console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
//   } else if (err.code == 'unimplemented') {
//     console.log('The current browser doesn\'t support all of the features required to enable persistence.');
//   }
// });
