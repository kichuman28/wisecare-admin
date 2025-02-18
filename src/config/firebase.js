import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Replace this with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC1VhE9RoSzn89dYtqFn0U3ABUHTMO3dg",
    authDomain: "wise-care-app.firebaseapp.com",
    projectId: "wise-care-app",
    storageBucket: "wise-care-app.firebasestorage.app",
    messagingSenderId: "623753415843",
    appId: "1:623753415843:web:bb6f22b30f3edcd46e4316",
    measurementId: "G-7T5CVBZVV3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized successfully');

// Initialize Firestore
const db = getFirestore(app);
console.log('Firestore initialized successfully');

export { db }; 