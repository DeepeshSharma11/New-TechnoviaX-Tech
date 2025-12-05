// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBk33C9Xlw54hwJkgfC0mJWeFXBtZi7FPM",
    authDomain: "technoviax-tech.firebaseapp.com",
    projectId: "technoviax-tech",
    storageBucket: "technoviax-tech.firebasestorage.app",
    messagingSenderId: "238376394946",
    appId: "1:238376394946:web:4fbb7be471316c0cea5b5b",
    measurementId: "G-BYG4TMPMMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const loginContainer = document.getElementById('login-container');
const userContainer = document.getElementById('user-container');
const googleBtn = document.getElementById('google-login-btn');
const navLogin = document.getElementById('nav-login');
const navProfile = document.getElementById('nav-profile');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const errorMessage = document.getElementById('error-message');

// --- Login Logic ---
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("User signed in:", result.user);
                if (errorMessage) errorMessage.classList.add('hidden');
            }).catch((error) => {
                console.error("Login Error:", error);
                if (errorMessage) {
                    errorMessage.textContent = "Login failed: " + error.message;
                    errorMessage.classList.remove('hidden');
                }
            });
    });
}

// --- Logout Logic ---
function handleLogout() {
    signOut(auth).then(() => {
        console.log("User signed out");
    }).catch((error) => {
        console.error("Sign out error", error);
    });
}

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (signOutBtn) signOutBtn.addEventListener('click', handleLogout);

// --- Auth State Monitor ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        if (loginContainer) loginContainer.classList.add('hidden');
        if (userContainer) userContainer.classList.remove('hidden');
        
        // Update User Info in Profile Section
        const userNameEl = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');
        const profilePicEl = document.getElementById('profile-pic');

        if (userNameEl) userNameEl.textContent = user.displayName;
        if (userEmailEl) userEmailEl.textContent = user.email;
        if (profilePicEl) profilePicEl.src = user.photoURL || 'https://via.placeholder.com/150';
        
        // Update Navbar
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        if (userAvatar) userAvatar.src = user.photoURL || 'https://via.placeholder.com/150';
        
    } else {
        // User is signed out
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (userContainer) userContainer.classList.add('hidden');
        
        // Update Navbar
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');
    }
});

// --- Page Load Utilities ---
document.addEventListener('DOMContentLoaded', () => {
    // Set Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Remove Loader
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
        }, 500);
    }
});