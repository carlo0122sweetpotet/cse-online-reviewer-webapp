import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Your config from Firebase Console
  apiKey: "AIzaSyDtsTNYPtAtvNz7VpktzZ1nuBPuV_OrIws",
  authDomain: "quiz-app-befeb.firebaseapp.com",
  projectId: "quiz-app-befeb",
  storageBucket: "quiz-app-befeb.firebasestorage.app",
  messagingSenderId: "1020407315558",
  appId: "1:1020407315558:web:ab696fc7aa8b931d5d81a7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;