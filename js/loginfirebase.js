/**
 * TechnoviaX - Firebase Authentication
 * Integrated with Navigation.js
 */

// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Global logout function
window.firebaseLogout = async function() {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            showToast("Logged out successfully", 'success');
        } catch (error) {
            console.error("Logout error:", error);
            showToast("Error logging out", 'error');
        }
    }
};

// Wait for navigation to be ready
function waitForNavigation() {
    return new Promise((resolve) => {
        if (window.Navigation && document.getElementById('nav-login-container')) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (window.Navigation && document.getElementById('nav-login-container')) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn("Navigation not found, injecting UI directly");
                injectDirectUI();
                resolve();
            }, 5000);
        }
    });
}

// Fallback UI injection
function injectDirectUI() {
    const desktopContainer = document.getElementById('nav-login-container');
    const mobileContainer = document.getElementById('mobile-login-container');
    const mobileFullContainer = document.getElementById('mobile-full-login-container');
    
    if (!desktopContainer) return;
    
    // Show login buttons by default
    desktopContainer.innerHTML = `<a href="login.html" class="firebase-login-btn"><i class="fas fa-user mr-1"></i> Login</a>`;
    if (mobileContainer) mobileContainer.innerHTML = `<a href="login.html" class="firebase-login-btn text-sm px-3 py-1.5"><i class="fas fa-user"></i></a>`;
    if (mobileFullContainer) mobileFullContainer.innerHTML = `<a href="login.html" class="firebase-login-btn w-full flex items-center justify-center py-2.5"><i class="fas fa-user mr-2"></i> Login</a>`;
}

// Initialize Firebase Auth
async function initFirebaseAuth() {
    await waitForNavigation();
    
    // Listen for auth state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            await createUserProfile(user);
            updateAuthUI(user);
        } else {
            // User is signed out
            updateAuthUI(null);
        }
    });
}

// Update UI based on auth state
function updateAuthUI(user) {
    if (window.updateFirebaseAuthUI) {
        window.updateFirebaseAuthUI(!!user, user);
    } else {
        // Fallback to direct update
        const desktopContainer = document.getElementById('nav-login-container');
        if (!desktopContainer) return;
        
        if (user) {
            const userName = user.displayName || user.email.split('@')[0];
            const userAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff`;
            
            desktopContainer.innerHTML = `
                <div class="flex items-center gap-2">
                    <div class="firebase-profile-btn">
                        <img src="${userAvatar}" alt="${userName}" class="w-6 h-6 rounded-full">
                        <span class="hidden xl:inline text-sm">${userName}</span>
                    </div>
                    <button onclick="window.firebaseLogout()" class="firebase-logout-btn text-sm">
                        <i class="fas fa-sign-out-alt mr-1"></i>
                        <span class="hidden xl:inline">Logout</span>
                    </button>
                </div>
            `;
        } else {
            desktopContainer.innerHTML = `<a href="login.html" class="firebase-login-btn"><i class="fas fa-user mr-1"></i> Login</a>`;
        }
    }
}

// Toast Helper
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 translate-y-10 opacity-0 z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation-circle'} mr-2"></i> ${message}`;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// User Profile Creation in Firestore
async function createUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                totalLogins: 1,
                isActive: true
            });
        } else {
            // Update last login
            await setDoc(userRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
        }
    } catch (e) {
        console.error("Profile Sync Error", e);
    }
}

// Login Page Specific Logic
function setupLoginPage() {
    // Google Login
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                await signInWithPopup(auth, provider);
                window.location.href = '/index.html';
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }

    // Email/Password Login
    const emailForm = document.getElementById('email-login-form');
    if (emailForm) {
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = '/index.html';
            } catch (error) {
                showToast("Login failed: " + error.message, 'error');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFirebaseAuth();
    setupLoginPage();
});

// Start initialization immediately if DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initFirebaseAuth();
    setupLoginPage();
}

// Export for other modules
export { app, auth, db, provider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };