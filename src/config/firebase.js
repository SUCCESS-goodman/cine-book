// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use .env in Vite: VITE_FIREBASE_API_KEY, etc. (optional – falls back to defaults)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAJqsZN7yPhmNG5Kyak4gwTRH-m__E-4FU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cine-book-ebc50.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cine-book-ebc50",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cine-book-ebc50.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "28079161535",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:28079161535:web:c6302420fabc1735c6060a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-P0RP58JGQC",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };