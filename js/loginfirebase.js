// Import functions from Firebase SDKs (Stable Version 10.13.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import { 
    getStorage
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// --- FIREBASE CONFIGURATION ---
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
provider.setCustomParameters({
    prompt: 'select_account'
});
const db = getFirestore(app);
const storage = getStorage(app);

// --- UI INJECTION LOGIC ---
let authUIInjected = false;
let lastAuthState = null;

// Fast UI Injection
function injectAuthUI() {
    if (authUIInjected) return;
    
    // Get containers
    const desktopContainer = document.getElementById('nav-login-container');
    const mobileContainer = document.getElementById('mobile-login-container');
    const mobileFullContainer = document.getElementById('mobile-full-login-container');
    
    // Retry if containers aren't ready yet
    if (!desktopContainer) {
        setTimeout(injectAuthUI, 100);
        return;
    }
    
    // Inject minimal UI
    injectDesktopUI(desktopContainer);
    injectMobileUI(mobileContainer, mobileFullContainer);
    
    authUIInjected = true;
    
    // Check current auth state immediately
    if (auth.currentUser) {
        updateAuthUI(auth.currentUser);
    }
}

// Fast Desktop UI Injection
function injectDesktopUI(container) {
    if (!container.querySelector('#desktop-login-btn') && !container.querySelector('#desktop-profile-btn')) {
        container.innerHTML = `
            <!-- Login Button -->
            <div id="desktop-login-btn" class="desktop-login-btn">
                <a href="/login.html" class="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap shadow hover:shadow-lg">
                    <i class="fas fa-sign-in-alt text-sm"></i>
                    <span class="text-sm">Login</span>
                </a>
            </div>
            
            <!-- Profile Dropdown -->
            <div id="desktop-profile-dropdown" class="desktop-profile-dropdown hidden relative">
                <button id="desktop-profile-btn" class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/10 transition-colors">
                    <img id="desktop-user-avatar" src="https://ui-avatars.com/api/?name=User&background=667eea&color=fff" alt="User" class="w-8 h-8 rounded-full">
                    <i class="fas fa-chevron-down text-xs text-gray-300"></i>
                </button>
                
                <div id="desktop-dropdown-menu" class="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl border border-gray-800 hidden z-50">
                    <div class="p-3 border-b border-gray-800">
                        <div class="flex items-center gap-2">
                            <img id="dropdown-user-avatar" src="https://ui-avatars.com/api/?name=User&background=667eea&color=fff" alt="User" class="w-10 h-10 rounded-full">
                            <div>
                                <p id="dropdown-user-name" class="text-sm font-semibold text-white truncate max-w-[150px]"></p>
                                <p id="dropdown-user-email" class="text-xs text-gray-400 truncate max-w-[150px]"></p>
                            </div>
                        </div>
                    </div>
                    <div class="p-2 space-y-1">
                        <a href="/dashboard.html" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                            <i class="fas fa-tachometer-alt w-4"></i>
                            <span>Dashboard</span>
                        </a>
                        <a href="/profile.html" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                            <i class="fas fa-user-cog w-4"></i>
                            <span>My Profile</span>
                        </a>
                        <button id="desktop-logout-btn" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <i class="fas fa-sign-out-alt w-4"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup dropdown toggle
        const profileBtn = container.querySelector('#desktop-profile-btn');
        const dropdownMenu = container.querySelector('#desktop-dropdown-menu');
        
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            });
        }
    }
}

// Fast Mobile UI Injection
function injectMobileUI(mobileContainer, mobileFullContainer) {
    // Top mobile container
    if (mobileContainer && !mobileContainer.querySelector('#mobile-top-login-btn')) {
        mobileContainer.innerHTML = `
            <div id="mobile-top-login-btn" class="mobile-top-login-btn">
                <a href="/login.html" class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600">
                    <i class="fas fa-sign-in-alt text-xs"></i>
                    <span class="hidden sm:inline">Login</span>
                </a>
            </div>
        `;
    }
    
    // Full mobile container
    if (mobileFullContainer && !mobileFullContainer.querySelector('#mobile-full-login-btn')) {
        mobileFullContainer.innerHTML = `
            <div id="mobile-full-login-btn" class="mobile-full-login-btn w-full">
                <a href="/login.html" class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full">
                    <i class="fas fa-user mr-1"></i>
                    <span>Login / Register</span>
                </a>
            </div>
            
            <!-- Mobile Profile Section -->
            <div id="mobile-profile-section" class="mobile-profile-section hidden w-full">
                <div class="bg-gray-800 rounded-lg p-3 mb-3">
                    <div class="flex items-center gap-3">
                        <img id="mobile-user-avatar" src="https://ui-avatars.com/api/?name=User&background=667eea&color=fff" alt="User" class="w-10 h-10 rounded-full">
                        <div>
                            <p id="mobile-user-name" class="text-sm font-semibold text-white"></p>
                            <p id="mobile-user-email" class="text-xs text-gray-400"></p>
                        </div>
                    </div>
                </div>
                <div class="space-y-1">
                    <a href="/dashboard.html" class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg">
                        <i class="fas fa-tachometer-alt w-4"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="/profile.html" class="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg">
                        <i class="fas fa-user-cog w-4"></i>
                        <span>My Profile</span>
                    </a>
                    <button id="mobile-logout-btn" class="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <i class="fas fa-sign-out-alt w-4"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }
}

// Global Logout Function - Optimized
window.firebaseLogout = async function() {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            console.log("Logged out successfully");
            // Redirect only if on protected pages
            const protectedPages = ['profile.html', 'dashboard.html', 'payment.html'];
            const currentPage = window.location.pathname.split('/').pop();
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    }
};

// Fast Auth State Listener
onAuthStateChanged(auth, async (user) => {
    // Prevent redundant updates
    if (lastAuthState === user?.uid) return;
    lastAuthState = user?.uid;
    
    // Ensure UI is injected
    if (!authUIInjected) {
        injectAuthUI();
    }
    
    // Update UI immediately
    updateAuthUI(user);
    
    if (user) {
        // Create/update user profile in background (non-blocking)
        setTimeout(() => createUserProfile(user), 0);
        localStorage.setItem('userLoggedIn', 'true');
    } else {
        localStorage.removeItem('userLoggedIn');
    }
});

// Optimized UI Updater
function updateAuthUI(user) {
    if (!authUIInjected) {
        setTimeout(() => updateAuthUI(user), 100);
        return;
    }
    
    const name = user ? (user.displayName || user.email.split('@')[0]) : '';
    const avatar = user ? (user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`) : '';
    
    // Desktop elements
    const dLogin = document.getElementById('desktop-login-btn');
    const dProfile = document.getElementById('desktop-profile-dropdown');
    const dAvatar = document.getElementById('desktop-user-avatar');
    const ddAvatar = document.getElementById('dropdown-user-avatar');
    const ddName = document.getElementById('dropdown-user-name');
    const ddEmail = document.getElementById('dropdown-user-email');
    
    // Mobile elements
    const mTopLogin = document.getElementById('mobile-top-login-btn');
    const mFullLogin = document.getElementById('mobile-full-login-btn');
    const mProfile = document.getElementById('mobile-profile-section');
    const mAvatar = document.getElementById('mobile-user-avatar');
    const mName = document.getElementById('mobile-user-name');
    const mEmail = document.getElementById('mobile-user-email');
    
    if (user) {
        // Desktop - logged in
        if (dLogin) dLogin.style.display = 'none';
        if (dProfile) dProfile.style.display = 'block';
        if (dAvatar) dAvatar.src = avatar;
        if (ddAvatar) ddAvatar.src = avatar;
        if (ddName) ddName.textContent = name;
        if (ddEmail) ddEmail.textContent = user.email;
        
        // Mobile - logged in
        if (mTopLogin) mTopLogin.style.display = 'none';
        if (mFullLogin) mFullLogin.style.display = 'none';
        if (mProfile) mProfile.style.display = 'block';
        if (mAvatar) mAvatar.src = avatar;
        if (mName) mName.textContent = name;
        if (mEmail) mEmail.textContent = user.email;
    } else {
        // Desktop - logged out
        if (dLogin) dLogin.style.display = 'block';
        if (dProfile) dProfile.style.display = 'none';
        
        // Mobile - logged out
        if (mTopLogin) mTopLogin.style.display = 'flex';
        if (mFullLogin) mFullLogin.style.display = 'block';
        if (mProfile) mProfile.style.display = 'none';
    }
}

// Optimized User Profile Creation
async function createUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        const userData = {
            uid: user.uid,
            email: user.email,
            lastLogin: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isActive: true
        };
        
        if (user.displayName) userData.name = user.displayName;
        if (user.photoURL) userData.photoURL = user.photoURL;
        
        if (!userSnap.exists()) {
            userData.createdAt = serverTimestamp();
            userData.name = user.displayName || user.email.split('@')[0];
            await setDoc(userRef, userData);
            console.log("New user profile created");
        } else {
            await updateDoc(userRef, { 
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp() 
            });
        }
    } catch (e) {
        console.error("Profile Sync Error", e);
    }
}

// Fast Login Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Google Login
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                console.log("Google login successful:", result.user.email);
                window.location.href = 'index.html';
            } catch (e) {
                console.error("Google Login Failed:", e);
                alert("Google Login Failed: " + e.message);
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
                console.log("Email login successful");
                window.location.href = 'index.html';
            } catch (e) {
                console.error("Login Failed:", e);
                alert("Login Failed: " + e.message);
            }
        });
    }
});

// Initialize UI injection
setTimeout(injectAuthUI, 50);

// Export for use in other modules
export { 
    app, auth, db, storage, provider,
    signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    updateProfile,
    doc, getDoc, setDoc, updateDoc, serverTimestamp
};