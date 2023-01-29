// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase
export const USERS_COLLECTION = 'users'
export const POSTS_COLLECTION = 'posts'
export const SPACES_COLLECTION = 'spaces'
export const COMMENTS_COLLECTION = 'comments'
export const BUCKET_URL = 'gs://api-project-842573764225.appspot.com'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmmz5VF3TdTjLxWCK6L-omHCGtJgEJLFU",
  authDomain: "api-project-842573764225.firebaseapp.com",
  projectId: "api-project-842573764225",
  storageBucket: "api-project-842573764225.appspot.com",
  messagingSenderId: "842573764225",
  appId: "1:842573764225:web:0e5d2a0963f854ddcb9f80"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const storage = getStorage(app)