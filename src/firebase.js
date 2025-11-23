// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDH5sJUiAxFyyF7dgiof4o4w6Ecbtl1IXw",
  authDomain: "expense-e9baa.firebaseapp.com",
  projectId: "expense-e9baa",
  storageBucket: "expense-e9baa.firebasestorage.app",
  messagingSenderId: "591162085156",
  appId: "1:591162085156:web:ac0b047ae514ceb21dedb1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Export Firestore DB
export const db = getFirestore(app);
