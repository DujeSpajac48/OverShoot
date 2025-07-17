import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPmJXRYOt-GtCrHvZ8uMvOORE44pssyPY",
  authDomain: "overshoot-376d8.firebaseapp.com",
  projectId: "overshoot-376d8",
  storageBucket: "overshoot-376d8.appspot.com",
  messagingSenderId: "792712359588",
  appId: "1:792712359588:web:8231d25ebb4102a6a4c031",
  measurementId: "G-V2KDL9SWPH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Samo db export