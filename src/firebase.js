import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

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
export const app = initializeApp(firebaseConfig);
console.log('Firebase initialized successfully');

// Initialize Firestore
export const db = getFirestore(app);
console.log('Firestore initialized successfully');

// Initialize Auth
export const auth = getAuth(app);
console.log('Firebase Auth initialized successfully');

// Initialize Realtime Database
export const rtdb = getDatabase(app);
console.log('Realtime Database initialized successfully');

// Export all services as default export
export default {
    app,
    auth,
    db,
    rtdb
}; 