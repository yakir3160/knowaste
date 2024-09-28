// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvGGpbmVpf-jZTNsClUDgDMURcP4zxxB4",
    authDomain: "knowwaste-f88b2.firebaseapp.com",
    projectId: "knowwaste-f88b2",
    storageBucket: "knowwaste-f88b2.appspot.com",
    messagingSenderId: "347995591885",
    appId: "1:347995591885:web:c9d2d38e6b4b374dc70584",
    measurementId: "G-DGP0BW2Z0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);