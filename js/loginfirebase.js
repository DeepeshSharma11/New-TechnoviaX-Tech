// Import functions from Firebase SDKs (Using stable version 10.13.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBk33C9Xlw54hwJkgfC0mJWeFXBtZi7FPM",
    authDomain: "technoviax-tech.firebaseapp.com",
    projectId: "technoviax-tech",
    storageBucket: "technoviax-tech.firebasestorage.app",
    messagingSenderId: "238376394946",
    appId: "1:238376394946:web:4fbb7be471316c0cea5b5b",
    measurementId: "G-BYG4TMPMMV"
};

// Global App ID
const appId = typeof __app_id !== 'undefined' ? __app_id : 'technoviax-prod';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Global Logout Function (Attached to window so navigation.js can access it)
window.firebaseLogout = async function() {
    // Show standard confirm dialog
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            // Toast functionality relies on navigation.js or index.html scripts
            // We console log as fallback
            console.log("Logged out successfully");
            if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('payment.html')) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
};

// --- Auth State Listener ---
onAuthStateChanged(auth, async (user) => {
    // 1. Update UI using the function from navigation.js
    if (window.updateFirebaseAuthUI) {
        window.updateFirebaseAuthUI(!!user, user);
    } else {
        // Fallback: If navigation.js hasn't loaded yet, retry shortly
        const checkNav = setInterval(() => {
            if (window.updateFirebaseAuthUI) {
                window.updateFirebaseAuthUI(!!user, user);
                clearInterval(checkNav);
            }
        }, 100);
    }

    // 2. Handle User Data
    if (user) {
        // Ensure user profile exists in Firestore
        await createUserProfile(user);
        
        // Save simple session flag
        localStorage.setItem('userLoggedIn', 'true');
    } else {
        localStorage.removeItem('userLoggedIn');
        checkFirstTimeVisitor();
    }
});

// Helper: Create/Update User Profile in Firestore
async function createUserProfile(user) {
    try {
        // Don't create profile for anonymous users
        if (user.isAnonymous) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            lastLogin: serverTimestamp(),
            isActive: true
        };

        if (user.displayName) userData.name = user.displayName;
        if (user.photoURL) userData.photoURL = user.photoURL;

        if (!userSnap.exists()) {
            userData.createdAt = serverTimestamp();
            userData.name = user.displayName || user.email.split('@')[0]; // Fallback name
            await setDoc(userRef, userData);
        } else {
             await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        }
    } catch (e) {
        console.error("Profile Sync Error", e);
    }
}

// Helper: First Time Visitor Logic
function checkFirstTimeVisitor() {
    // Only redirect if not already on login page
    if (window.location.pathname.includes('login.html')) return;

    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    if (!hasVisited) {
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        // Optional: Redirect to login on first visit
        // window.location.href = 'login.html'; 
    }
}

// --- Login Page Logic (Attaches only if elements exist) ---
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.href = 'index.html';
        } catch (e) {
            alert("Google Login Failed: " + e.message);
        }
    });
}

const emailForm = document.getElementById('email-login-form');
if (emailForm) {
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'index.html';
        } catch (e) {
            alert("Login Failed: " + e.message);
        }
    });
}

// Export functions for use in other modules (like careers.html)
export { 
    app, auth, db, storage, provider,
    signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously,
    collection, addDoc, doc, setDoc, getDoc, serverTimestamp, 
    ref, uploadBytes, getDownloadURL 
};