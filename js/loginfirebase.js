// Import functions from Firebase SDKs (Stable Version 10.13.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    signInAnonymously,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc,
    serverTimestamp, 
    collection, 
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    increment
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// --- FIREBASE CONFIGURATION ---
// Note: Google Cloud Console mein "HTTP Referrer" restriction zaroor lagayein apne domain ke liye.
const firebaseConfig = {
    apiKey: "AIzaSyBk33C9Xlw54hwJkgfC0mJWeFXBtZi7FPM", // Real API Key
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
const storage = getStorage(app);
const appId = 'technoviax-prod'; // Fixed App ID

// --- UI INJECTION LOGIC ---
let navigationInjected = false;
let authUIInjected = false;

// Listen for navigation ready event
window.addEventListener('navigationInjected', () => {
    navigationInjected = true;
    injectAuthUI();
});

// Also try to inject if navigation is already there (fallback)
if (document.getElementById('nav-login-container')) {
    injectAuthUI();
}

function injectAuthUI() {
    if (authUIInjected) return;
    
    const desktopContainer = document.getElementById('nav-login-container');
    const mobileContainer = document.getElementById('mobile-login-container');
    const mobileFullContainer = document.getElementById('mobile-full-login-container');
    
    // Retry if containers aren't ready yet
    if (!desktopContainer) {
        setTimeout(injectAuthUI, 500);
        return;
    }
    
    // 1. DESKTOP LOGIN BUTTON (Initial State)
    if (!desktopContainer.querySelector('#desktop-login-btn') && !desktopContainer.querySelector('#desktop-profile-dropdown')) {
        const loginBtn = document.createElement('div');
        loginBtn.id = 'desktop-login-btn';
        loginBtn.className = 'nav-login-btn';
        loginBtn.innerHTML = `
            <a href="/login.html" class="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap">
                <i class="fas fa-user mr-1 text-sm"></i> 
                <span class="text-sm">Login</span>
            </a>
        `;
        desktopContainer.appendChild(loginBtn);
    }

    // 2. MOBILE LOGIN BUTTONS (Initial State)
    if (mobileContainer && !mobileContainer.querySelector('#mobile-top-login-btn')) {
        mobileContainer.innerHTML = `
            <div id="mobile-top-login-btn" class="mobile-top-login-btn">
                <a href="/login.html" class="flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm whitespace-nowrap">
                    <i class="fas fa-user text-xs"></i>
                    <span class="hidden sm:inline">Login</span>
                </a>
            </div>
        `;
    }

    if (mobileFullContainer && !mobileFullContainer.querySelector('#mobile-full-login-btn')) {
        mobileFullContainer.innerHTML = `
            <div id="mobile-full-login-btn" class="mobile-full-login-btn w-full">
                <a href="/login.html" class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full">
                    <i class="fas fa-user mr-2"></i>
                    <span>Login / Register</span>
                </a>
            </div>
        `;
    }

    // 4. DESKTOP PROFILE DROPDOWN (Hidden by default)
    if (!desktopContainer.querySelector('#desktop-profile-dropdown')) {
        const profileDropdown = document.createElement('div');
        profileDropdown.id = 'desktop-profile-dropdown';
        profileDropdown.className = 'hidden nav-profile-dropdown relative';
        profileDropdown.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group" id="desktop-profile-btn">
                <img id="desktop-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-9 h-9 rounded-full border-2 border-white/20 shadow-sm object-cover">
                <i class="fas fa-chevron-down text-gray-400 text-xs group-hover:text-primary transition-colors"></i>
            </div>
            <div id="desktop-dropdown-menu" class="hidden absolute right-0 mt-3 w-64 bg-[#0f172a] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden transform transition-all duration-200 origin-top-right">
                <div class="p-4 border-b border-white/10 bg-slate-900/50">
                    <div class="flex items-center gap-3">
                        <img id="dropdown-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover">
                        <div class="flex-1 min-w-0">
                            <p id="dropdown-user-name" class="text-sm font-bold text-white truncate"></p>
                            <p id="dropdown-user-email" class="text-xs text-gray-400 truncate"></p>
                        </div>
                    </div>
                </div>
                <div class="p-2">
                    <a href="/profile.html" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-emerald-400 rounded-lg transition-colors">
                        <i class="fas fa-user-cog w-5"></i>
                        <span>My Profile</span>
                    </a>
                    <button id="desktop-logout-btn" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1">
                        <i class="fas fa-sign-out-alt w-5"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        desktopContainer.appendChild(profileDropdown);
        
        // Setup dropdown toggle
        const profileBtn = profileDropdown.querySelector('#desktop-profile-btn');
        const dropdownMenu = profileDropdown.querySelector('#desktop-dropdown-menu');
        
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
        }
        
        document.addEventListener('click', () => {
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // 5. MOBILE PROFILE (Hidden by default)
    if (mobileFullContainer && !mobileFullContainer.querySelector('#mobile-profile-section')) {
        const mobileProfile = document.createElement('div');
        mobileProfile.id = 'mobile-profile-section';
        mobileProfile.className = 'hidden mobile-profile-section w-full animate-fade-in';
        mobileProfile.innerHTML = `
            <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 mb-4 border border-white/10">
                <div class="flex items-center gap-3">
                    <img id="mobile-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-sm object-cover">
                    <div class="flex-1 min-w-0">
                        <p id="mobile-user-name" class="text-sm font-bold text-white truncate"></p>
                        <p id="mobile-user-email" class="text-xs text-gray-400 truncate"></p>
                    </div>
                </div>
            </div>
            <div class="space-y-1">
                <a href="/profile.html" class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-emerald-400 rounded-lg transition-colors">
                    <i class="fas fa-user-cog w-5"></i>
                    <span>My Profile</span>
                </a>
                <button id="mobile-logout-btn" class="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-2">
                    <i class="fas fa-sign-out-alt w-5"></i>
                    <span>Logout</span>
                </button>
            </div>
        `;
        mobileFullContainer.appendChild(mobileProfile);
    }

    authUIInjected = true;
    
    // Trigger auth check to update UI immediately
    if (auth.currentUser) {
        updateAuthUI(auth.currentUser);
    }
}

// Global Logout Function
window.firebaseLogout = async function() {
    if (confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            console.log("Logged out successfully");
            // Redirect if on a protected page
            if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('payment.html')) {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
};

// Global Logout Event Listeners (Delegated)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#desktop-logout-btn, #mobile-logout-btn');
    if (btn) {
        window.firebaseLogout();
    }
});

// --- Auth State Listener ---
onAuthStateChanged(auth, async (user) => {
    // Ensure UI is injected before updating
    if (!authUIInjected) injectAuthUI();
    
    updateAuthUI(user);
    
    if (user) {
        await createUserProfile(user);
        localStorage.setItem('userLoggedIn', 'true');
    } else {
        localStorage.removeItem('userLoggedIn');
        checkFirstTimeVisitor();
    }
});

// UI Updater Function
function updateAuthUI(user) {
    if (!authUIInjected) return;

    // Elements
    const dLogin = document.getElementById('desktop-login-btn');
    const dProfile = document.getElementById('desktop-profile-dropdown');
    const dAvatar = document.getElementById('desktop-user-avatar');
    const ddAvatar = document.getElementById('dropdown-user-avatar');
    const ddName = document.getElementById('dropdown-user-name');
    const ddEmail = document.getElementById('dropdown-user-email');
    
    const mTopLogin = document.getElementById('mobile-top-login-btn');
    const mFullLogin = document.getElementById('mobile-full-login-btn');
    const mProfile = document.getElementById('mobile-profile-section');
    const mAvatar = document.getElementById('mobile-user-avatar');
    const mName = document.getElementById('mobile-user-name');
    const mEmail = document.getElementById('mobile-user-email');
    
    const footerLogin = document.getElementById('footer-login-item');

    if (user) {
        const name = user.displayName || user.email.split('@')[0];
        const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`;

        // Desktop Update
        if(dLogin) dLogin.style.display = 'none';
        if(dProfile) dProfile.style.display = 'flex';
        if(dAvatar) dAvatar.src = avatar;
        if(ddAvatar) ddAvatar.src = avatar;
        if(ddName) ddName.textContent = name;
        if(ddEmail) ddEmail.textContent = user.email;

        // Mobile Update
        if(mTopLogin) mTopLogin.style.display = 'none';
        if(mFullLogin) mFullLogin.style.display = 'none';
        if(mProfile) mProfile.style.display = 'block';
        if(mAvatar) mAvatar.src = avatar;
        if(mName) mName.textContent = name;
        if(mEmail) mEmail.textContent = user.email;

        // Footer Update
        if(footerLogin) footerLogin.innerHTML = `<span class="text-emerald-400 font-bold">Welcome, ${name}</span>`;
    } else {
        // Desktop Reset
        if(dLogin) dLogin.style.display = 'block';
        if(dProfile) dProfile.style.display = 'none';

        // Mobile Reset
        if(mTopLogin) mTopLogin.style.display = 'flex';
        if(mFullLogin) mFullLogin.style.display = 'block';
        if(mProfile) mProfile.style.display = 'none';

        // Footer Reset
        if(footerLogin) footerLogin.innerHTML = `<a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-sign-in-alt text-xs"></i> Login</a>`;
    }
}

// User Profile Creation
async function createUserProfile(user) {
    try {
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
            userData.name = user.displayName || user.email.split('@')[0];
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
    if (window.location.pathname.includes('login.html')) return;
    // You can add logic here to redirect new users to login if needed
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

// Initial Injection Attempt
setTimeout(() => { if (!authUIInjected) injectAuthUI(); }, 1000);

// Export functions for use in other modules
export { 
    app, auth, db, storage, provider,
    signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously,
    updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider,
    collection, addDoc, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy, limit, increment, serverTimestamp, 
    ref, uploadBytes, getDownloadURL 
};