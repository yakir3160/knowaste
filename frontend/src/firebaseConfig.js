// This file is used to initialize the firebase app and export the auth and db objects to be used in other files.
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Directly using your Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyCvGGpbmVpf-jZTNsClUDgDMURcP4zxxB4',
    authDomain: "knowwaste-f88b2.firebaseapp.com",
    projectId: "knowwaste-f88b2",
    storageBucket: "knowwaste-f88b2.appspot.com",
    messagingSenderId: "347995591885",
    appId: "1:347995591885:web:c9d2d38e6b4b374dc70584",
    measurementId: "G-DGP0BW2Z0X"
};

console.log(firebaseConfig); // Log the configuration to ensure it's correctly set

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
