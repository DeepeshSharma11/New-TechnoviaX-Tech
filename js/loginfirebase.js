// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Your web app's Firebase configuration
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

// --- UI Injection Function ---
// यह फंक्शन हर पेज पर Login/Logout बटन अपने आप बना देगा
function injectAuthUI() {
    const navList = document.querySelector('.nav-links');
    
    // अगर पेज पर नेविगेशन लिस्ट है और Login बटन पहले से नहीं है
    if (navList && !document.getElementById('nav-login')) {
        console.log("Injecting Auth Buttons...");
        
        // 1. Create Login Button
        const liLogin = document.createElement('li');
        liLogin.id = 'nav-login';
        // अगर हम अभी login पेज पर हैं, तो active क्लास लगाएं
        const isActive = window.location.pathname.includes('login.html') ? 'text-primary font-bold' : 'text-secondary font-medium hover:text-primary transition-colors';
        liLogin.innerHTML = `<a href="/login.html" class="${isActive}">Login</a>`;
        navList.appendChild(liLogin);

        // 2. Create Profile/Logout Section (Hidden by default)
        const liProfile = document.createElement('li');
        liProfile.id = 'nav-profile';
        liProfile.className = 'hidden'; // शुरुआत में छुपा रहेगा
        liProfile.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group" id="injected-logout-btn">
                <img id="nav-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border border-gray-200 object-cover">
                <span class="text-sm font-medium text-gray-700 group-hover:text-red-500 transition-colors">Logout</span>
            </div>
        `;
        navList.appendChild(liProfile);

        // Logout click event
        const logoutBtn = liProfile.querySelector('#injected-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

// --- Login Logic (For Login Page) ---
const googleBtn = document.getElementById('google-login-btn');
const errorMessage = document.getElementById('error-message');

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

// --- Logout Logic (Global) ---
function handleLogout() {
    // Confirm logout
    if(confirm("Are you sure you want to logout?")) {
        signOut(auth).then(() => {
            console.log("User signed out");
            // Optional: Reload page to reset UI state clearly
            // window.location.reload(); 
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    }
}

// लॉगिन पेज वाला Logout बटन (अगर मौजूद हो)
const pageLogoutBtn = document.getElementById('logout-btn'); // In Header (static)
const pageSignOutBtn = document.getElementById('sign-out-btn'); // In Body (static)

if (pageLogoutBtn) pageLogoutBtn.addEventListener('click', handleLogout);
if (pageSignOutBtn) pageSignOutBtn.addEventListener('click', handleLogout);


// --- Auth State Monitor (Updates UI on all pages) ---
onAuthStateChanged(auth, (user) => {
    // Dynamic elements (जो अभी inject हुए)
    const navLogin = document.getElementById('nav-login');
    const navProfile = document.getElementById('nav-profile');
    const navAvatar = document.getElementById('nav-user-avatar') || document.getElementById('user-avatar'); // Support both IDs

    // Login Page Specific elements
    const loginContainer = document.getElementById('login-container');
    const userContainer = document.getElementById('user-container');
    const profilePicEl = document.getElementById('profile-pic');
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');

    if (user) {
        // --- USER IS LOGGED IN ---
        
        // 1. Update Navbar (Global)
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        
        if (navAvatar) {
            navAvatar.src = user.photoURL || 'https://via.placeholder.com/150';
        }

        // 2. Update Login Page UI (If on login.html)
        if (loginContainer) loginContainer.classList.add('hidden');
        if (userContainer) userContainer.classList.remove('hidden');
        if (userNameEl) userNameEl.textContent = user.displayName;
        if (userEmailEl) userEmailEl.textContent = user.email;
        if (profilePicEl) profilePicEl.src = user.photoURL || 'https://via.placeholder.com/150';
        
    } else {
        // --- USER IS LOGGED OUT ---

        // 1. Update Navbar (Global)
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');

        // 2. Update Login Page UI (If on login.html)
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (userContainer) userContainer.classList.add('hidden');
    }
});

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Navbar Buttons first
    injectAuthUI();

    // 2. Standard utilities (Year, Loader)
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
        }, 500);
    }
});