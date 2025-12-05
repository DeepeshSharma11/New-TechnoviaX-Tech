// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

// --- UI Injection Function (Premium Login Button) ---
function injectAuthUI() {
    const navList = document.querySelector('.nav-links');
    
    if (navList && !document.getElementById('nav-login')) {
        // 1. Create Login Button
        const liLogin = document.createElement('li');
        liLogin.id = 'nav-login';
        
        // Premium Button Style
        // Blue Gradient, Shadow, Rounded-Full, Hover Effects
        const btnClasses = "flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
        
        liLogin.innerHTML = `<a href="/login.html" class="${btnClasses}">
            <i class="fas fa-user"></i> <span>Login</span>
        </a>`;
        
        navList.appendChild(liLogin);

        // 2. Create Profile/Logout Section (Hidden by default)
        const liProfile = document.createElement('li');
        liProfile.id = 'nav-profile';
        liProfile.className = 'hidden'; 
        liProfile.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md" id="injected-logout-btn">
                <img id="nav-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover">
                <span class="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Logout</span>
                <i class="fas fa-sign-out-alt text-gray-400 group-hover:text-red-500 ml-1 transition-colors"></i>
            </div>
        `;
        navList.appendChild(liProfile);

        const logoutBtn = liProfile.querySelector('#injected-logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
}

// --- First Time Visitor Logic ---
function checkFirstTimeVisitor() {
    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    if (!hasVisited && window.location.pathname !== '/login.html') {
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        window.location.href = '/login.html';
    }
}

// --- Google Login Logic ---
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const errorMsg = document.getElementById('error-message');
        if (errorMsg) errorMsg.classList.add('hidden');
        signInWithPopup(auth, provider)
            .then((result) => console.log("User signed in"))
            .catch((error) => {
                console.error("Error:", error);
                if (errorMsg) {
                    errorMsg.textContent = error.message;
                    errorMsg.classList.remove('hidden');
                }
            });
    });
}

// --- Email Login Logic ---
const emailForm = document.getElementById('email-login-form');
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = emailForm.querySelector('button[type="submit"]');
        const errorMsg = document.getElementById('error-message');
        
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        if (errorMsg) errorMsg.classList.add('hidden');

        signInWithEmailAndPassword(auth, email, password)
            .then(() => { /* Auth state listener handles redirect */ })
            .catch((error) => {
                if (errorMsg) {
                    errorMsg.textContent = "Invalid email or password.";
                    errorMsg.classList.remove('hidden');
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
}

// --- Logout Logic ---
function handleLogout() {
    if(confirm("Logout?")) {
        signOut(auth).then(() => {
            if (window.location.pathname === '/login.html') window.location.reload();
            else window.location.href = '/';
        });
    }
}
const pageLogoutBtn = document.getElementById('logout-btn');
const pageSignOutBtn = document.getElementById('sign-out-btn');
if (pageLogoutBtn) pageLogoutBtn.addEventListener('click', handleLogout);
if (pageSignOutBtn) pageSignOutBtn.addEventListener('click', handleLogout);

// --- Auth State Monitor ---
onAuthStateChanged(auth, (user) => {
    const navLogin = document.getElementById('nav-login');
    const navProfile = document.getElementById('nav-profile');
    const navAvatar = document.getElementById('nav-user-avatar') || document.getElementById('user-avatar');
    
    // Login Page Elements
    const loginContainer = document.getElementById('login-container');
    const userContainer = document.getElementById('user-container');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const profilePic = document.getElementById('profile-pic');

    if (user) {
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        if (navAvatar) navAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;

        if (loginContainer && userContainer) {
            loginContainer.classList.add('hidden');
            userContainer.classList.remove('hidden');
            if (userName) userName.textContent = user.displayName || 'User';
            if (userEmail) userEmail.textContent = user.email;
            if (profilePic) profilePic.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;
        }
    } else {
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');
        
        if (loginContainer && userContainer) {
            loginContainer.classList.remove('hidden');
            userContainer.classList.add('hidden');
        }
        checkFirstTimeVisitor();
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    injectAuthUI();
    const year = document.getElementById('year');
    if(year) year.textContent = new Date().getFullYear();
    
    const loading = document.getElementById('loading');
    if(loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
        }, 500);
    }
});