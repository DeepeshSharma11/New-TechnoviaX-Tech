// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

// --- DOM Elements ---
const loginContainer = document.getElementById('login-container');
const userContainer = document.getElementById('user-container');
const googleBtn = document.getElementById('google-login-btn');
const emailForm = document.getElementById('email-login-form'); 
const logoutBtn = document.getElementById('logout-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const errorMessage = document.getElementById('error-message');

// --- UI Injection Function (Navbar Logic) ---
function injectAuthUI() {
    const navList = document.querySelector('.nav-links');
    
    // Check if nav exists and login button is not already present
    if (navList && !document.getElementById('nav-login')) {
        console.log("Injecting Auth Buttons...");
        
        // 1. Create Login Button
        const liLogin = document.createElement('li');
        liLogin.id = 'nav-login';
        
        // Responsive & Stylish Button Classes
        // Mobile: Simple text link
        // Desktop (md:): Solid blue button with rounded corners
        const btnClasses = "flex items-center gap-2 font-bold transition-all " + 
                           "text-secondary hover:text-primary " + // Mobile styles
                           "md:bg-primary md:text-white md:px-6 md:py-2 md:rounded-full md:hover:bg-primary-dark md:shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5"; // Desktop styles
        
        liLogin.innerHTML = `<a href="/login.html" class="${btnClasses}">
            <i class="fas fa-user-circle text-lg"></i> <span>Login</span>
        </a>`;
        navList.appendChild(liLogin);

        // 2. Create Profile/Logout Section
        const liProfile = document.createElement('li');
        liProfile.id = 'nav-profile';
        liProfile.className = 'hidden'; 
        liProfile.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group md:bg-gray-50 md:px-3 md:py-1.5 md:rounded-full md:border md:border-gray-200 md:hover:border-primary transition-colors" id="injected-logout-btn">
                <img id="nav-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border border-white shadow-sm object-cover">
                <span class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Logout</span>
                <i class="fas fa-sign-out-alt text-gray-400 group-hover:text-red-500 ml-1"></i>
            </div>
        `;
        navList.appendChild(liProfile);

        const injectedLogout = liProfile.querySelector('#injected-logout-btn');
        if (injectedLogout) injectedLogout.addEventListener('click', handleLogout);
    }
}

// --- First Time Visitor Logic ---
function checkFirstTimeVisitor() {
    // Check if 'visited' flag exists in Local Storage
    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    
    // If NOT visited AND we are NOT already on the login page
    // (Prevents infinite redirect loop if user is already on login page)
    if (!hasVisited && window.location.pathname !== '/login.html') {
        console.log("First time visitor detected. Redirecting to login/signup...");
        
        // Set the flag immediately so this doesn't happen on next page load
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        
        // Redirect to login page
        window.location.href = '/login.html';
    }
}

// --- 1. Google Login Logic ---
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        if (errorMessage) errorMessage.classList.add('hidden');
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Google User signed in:", result.user);
            }).catch((error) => {
                console.error("Google Login Error:", error);
                showError("Google Login failed: " + error.message);
            });
    });
}

// --- 2. Email/Password Login Logic ---
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        
        // Loading State
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        if (errorMessage) errorMessage.classList.add('hidden');

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Email User signed in:", userCredential.user);
            })
            .catch((error) => {
                console.error("Email Login Error:", error);
                let msg = "Login failed. Please check your credentials.";
                if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
                if (error.code === 'auth/too-many-requests') msg = "Too many attempts. Try again later.";
                showError(msg);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
}

function showError(msg) {
    if (errorMessage) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    } else {
        alert(msg);
    }
}

// --- Logout Logic ---
function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        signOut(auth).then(() => {
            console.log("User signed out");
            if (window.location.pathname === '/login.html') {
                const submitBtn = emailForm?.querySelector('button[type="submit"]');
                if(submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Sign In';
                }
            } else {
                 window.location.href = '/';
            }
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    }
}

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (signOutBtn) signOutBtn.addEventListener('click', handleLogout);


// --- Auth State Monitor ---
onAuthStateChanged(auth, (user) => {
    // Navbar Elements
    const navLogin = document.getElementById('nav-login');
    const navProfile = document.getElementById('nav-profile');
    const navAvatar = document.getElementById('nav-user-avatar') || document.getElementById('user-avatar');

    // Login Page Elements
    const profilePicEl = document.getElementById('profile-pic');
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');

    if (user) {
        // LOGGED IN
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        if (navAvatar) navAvatar.src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email);

        if (loginContainer && userContainer) {
            loginContainer.classList.add('hidden');
            userContainer.classList.remove('hidden');
            if (userNameEl) userNameEl.textContent = user.displayName || 'User';
            if (userEmailEl) userEmailEl.textContent = user.email;
            if (profilePicEl) profilePicEl.src = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email);
        }
        
    } else {
        // LOGGED OUT
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');

        if (loginContainer && userContainer) {
            loginContainer.classList.remove('hidden');
            userContainer.classList.add('hidden');
        }
        
        // ONLY CHECK FOR FIRST TIME VISIT IF USER IS LOGGED OUT
        checkFirstTimeVisitor();
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    injectAuthUI();
    
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