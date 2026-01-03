// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY_HERE",
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

// Wait for navigation to be ready
let navigationInjected = false;
let authUIInjected = false;

// Listen for navigation ready event
window.addEventListener('navigationInjected', () => {
    navigationInjected = true;
    injectAuthUI();
});

// --- UI Injection Function ---
function injectAuthUI() {
    if (authUIInjected) return;
    
    const desktopContainer = document.getElementById('nav-login-container');
    const mobileContainer = document.getElementById('mobile-login-container');
    const mobileFullContainer = document.getElementById('mobile-full-login-container');
    
    // Retry if containers aren't ready yet
    if (!desktopContainer || !mobileContainer || !mobileFullContainer) {
        setTimeout(injectAuthUI, 100);
        return;
    }
    
    // 1. DESKTOP LOGIN BUTTON
    if (desktopContainer && !desktopContainer.querySelector('#desktop-login-btn')) {
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

    // 2. MOBILE LOGIN BUTTON
    if (mobileContainer && !mobileContainer.querySelector('#mobile-top-login-btn')) {
        const mobileTopBtn = document.createElement('div');
        mobileTopBtn.id = 'mobile-top-login-btn';
        mobileTopBtn.className = 'mobile-top-login-btn';
        mobileTopBtn.innerHTML = `
            <a href="/login.html" class="flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm whitespace-nowrap">
                <i class="fas fa-user text-xs"></i>
                <span class="hidden sm:inline">Login</span>
            </a>
        `;
        mobileContainer.appendChild(mobileTopBtn);
    }

    // 3. MOBILE FULL LOGIN
    if (mobileFullContainer && !mobileFullContainer.querySelector('#mobile-full-login-btn')) {
        const mobileFullBtn = document.createElement('div');
        mobileFullBtn.id = 'mobile-full-login-btn';
        mobileFullBtn.className = 'mobile-full-login-btn w-full';
        mobileFullBtn.innerHTML = `
            <a href="/login.html" class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full">
                <i class="fas fa-user mr-2"></i>
                <span>Login / Register</span>
            </a>
        `;
        mobileFullContainer.appendChild(mobileFullBtn);
    }

    // 4. DESKTOP PROFILE DROPDOWN
    if (desktopContainer && !desktopContainer.querySelector('#desktop-profile-dropdown')) {
        const profileDropdown = document.createElement('div');
        profileDropdown.id = 'desktop-profile-dropdown';
        profileDropdown.className = 'hidden nav-profile-dropdown';
        profileDropdown.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group relative" id="desktop-profile-btn">
                <img id="desktop-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover">
                <i class="fas fa-chevron-down text-gray-400 text-xs group-hover:text-primary transition-colors"></i>
            </div>
            <div id="desktop-dropdown-menu" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div class="p-4 border-b border-gray-100 bg-gray-50">
                    <div class="flex items-center gap-3">
                        <img id="dropdown-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-10 h-10 rounded-full border-2 border-primary object-cover">
                        <div class="flex-1 min-w-0">
                            <p id="dropdown-user-name" class="text-sm font-semibold text-gray-800 truncate"></p>
                            <p id="dropdown-user-email" class="text-xs text-gray-500 truncate"></p>
                        </div>
                    </div>
                </div>
                <div class="p-2">
                    <a href="/dashboard.html" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-tachometer-alt text-gray-500"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="/profile.html" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-user-cog text-gray-500"></i>
                        <span>My Profile</span>
                    </a>
                    <a href="/payment.html" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-wallet text-gray-500"></i>
                        <span>Payments</span>
                    </a>
                    <button id="desktop-logout-btn" class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                        <i class="fas fa-sign-out-alt"></i>
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
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // 5. MOBILE PROFILE
    if (mobileFullContainer && !mobileFullContainer.querySelector('#mobile-profile-section')) {
        const mobileProfile = document.createElement('div');
        mobileProfile.id = 'mobile-profile-section';
        mobileProfile.className = 'hidden mobile-profile-section w-full';
        mobileProfile.innerHTML = `
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-3">
                <div class="flex items-center gap-3">
                    <img id="mobile-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover">
                    <div class="flex-1 min-w-0">
                        <p id="mobile-user-name" class="text-sm font-semibold text-gray-800 truncate"></p>
                        <p id="mobile-user-email" class="text-xs text-gray-500 truncate"></p>
                    </div>
                </div>
            </div>
            <div class="space-y-1">
                <a href="/dashboard.html" class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="fas fa-tachometer-alt text-gray-500 w-5"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/profile.html" class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="fas fa-user-cog text-gray-500 w-5"></i>
                    <span>My Profile</span>
                </a>
                <a href="/payment.html" class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="fas fa-wallet text-gray-500 w-5"></i>
                    <span>Payments</span>
                </a>
                <button id="mobile-logout-btn" class="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                    <i class="fas fa-sign-out-alt w-5"></i>
                    <span>Logout</span>
                </button>
            </div>
        `;
        mobileFullContainer.appendChild(mobileProfile);
    }

    authUIInjected = true;
    addAuthStyles();
    
    // Trigger auth check to update UI immediately
    if (auth.currentUser) {
        updateAuthUI(auth.currentUser);
    }
}

// Add custom styles for auth UI
function addAuthStyles() {
    if (document.querySelector('#auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'auth-styles';
    style.textContent = `
        .nav-login-btn a{min-height:36px;min-width:36px}
        .mobile-top-login-btn a{min-height:32px;min-width:32px}
        .mobile-full-login-btn a{min-height:44px}
        .nav-profile-dropdown{position:relative}
        #desktop-dropdown-menu{min-width:240px}
        .mobile-profile-section{animation:fadeIn 0.3s ease-in}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .nav-login-btn a:active,.mobile-top-login-btn a:active,.mobile-full-login-btn a:active{transform:scale(0.95)}
        @media (max-width:639px){.nav-login-btn a span{display:none}.nav-login-btn a{padding:0.5rem;min-width:40px;justify-content:center}.mobile-top-login-btn{display:none}}
        @media (min-width:640px) and (max-width:767px){.mobile-top-login-btn a span{font-size:0.875rem}.nav-login-btn a{font-size:0.875rem;padding:0.5rem 0.75rem}}
        @media (min-width:768px) and (max-width:1023px){.nav-login-btn a{font-size:0.875rem;padding:0.5rem 1rem}}
        @media (min-width:1024px){.mobile-top-login-btn,.mobile-full-login-btn{display:none!important}}
    `;
    document.head.appendChild(style);
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

// Global Logout Handler (Delegation for dynamic elements)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('#desktop-logout-btn, #mobile-logout-btn');
    if (btn) {
        if(confirm("Are you sure you want to logout?")) {
            signOut(auth).then(() => {
                showToast("Logged out successfully");
                // Reset UI to logged out state immediately
                updateAuthUI(null);
                if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('payment.html')) {
                    window.location.href = '/login.html';
                }
            }).catch((error) => {
                console.error(error);
                showToast("Error logging out", 'error');
            });
        }
    }
});

// Main Auth Listener
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    if (user) {
        createUserProfile(user); // Ensure profile exists in DB
    } else {
        checkFirstTimeVisitor();
    }
});

function checkFirstTimeVisitor() {
    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    if (!hasVisited && window.location.pathname !== '/login.html') {
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        window.location.href = '/login.html';
    }
}

// UI Updater
function updateAuthUI(user) {
    if (!authUIInjected) return; // Wait for injection

    // Desktop Elements
    const dLogin = document.getElementById('desktop-login-btn');
    const dProfile = document.getElementById('desktop-profile-dropdown');
    const dAvatar = document.getElementById('desktop-user-avatar');
    const ddAvatar = document.getElementById('dropdown-user-avatar');
    const ddName = document.getElementById('dropdown-user-name');
    const ddEmail = document.getElementById('dropdown-user-email');
    
    // Mobile Elements
    const mTopLogin = document.getElementById('mobile-top-login-btn');
    const mFullLogin = document.getElementById('mobile-full-login-btn');
    const mProfile = document.getElementById('mobile-profile-section');
    const mAvatar = document.getElementById('mobile-user-avatar');
    const mName = document.getElementById('mobile-user-name');
    const mEmail = document.getElementById('mobile-user-email');
    
    const footerLogin = document.getElementById('footer-login-item');

    if (user) {
        const name = user.displayName || user.email.split('@')[0];
        const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

        // Desktop
        if(dLogin) dLogin.style.display = 'none';
        if(dProfile) dProfile.style.display = 'flex';
        if(dAvatar) dAvatar.src = avatar;
        if(ddAvatar) ddAvatar.src = avatar;
        if(ddName) ddName.textContent = name;
        if(ddEmail) ddEmail.textContent = user.email;

        // Mobile
        if(mTopLogin) mTopLogin.style.display = 'none';
        if(mFullLogin) mFullLogin.style.display = 'none';
        if(mProfile) mProfile.style.display = 'block';
        if(mAvatar) mAvatar.src = avatar;
        if(mName) mName.textContent = name;
        if(mEmail) mEmail.textContent = user.email;

        // Footer
        if(footerLogin) footerLogin.innerHTML = `<span class="text-primary font-bold">Welcome, ${name}</span>`;
    } else {
        // Desktop
        if(dLogin) dLogin.style.display = 'block';
        if(dProfile) dProfile.style.display = 'none';

        // Mobile
        if(mTopLogin) mTopLogin.style.display = 'flex';
        if(mFullLogin) mFullLogin.style.display = 'block';
        if(mProfile) mProfile.style.display = 'none';

        // Footer
        if(footerLogin) footerLogin.innerHTML = `<a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base">Login</a>`;
    }
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

// Login Page Specific Logic (Event Listeners for Login buttons on login.html)
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider).then(() => {
            window.location.href = '/index.html'; // Redirect after login
        }).catch(e => showToast(e.message, 'error'));
    });
}

const emailForm = document.getElementById('email-login-form');
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        signInWithEmailAndPassword(auth, email, password).then(() => {
            window.location.href = '/index.html';
        }).catch(e => showToast("Login failed: " + e.message, 'error'));
    });
}

// Fallback injection after 2 seconds (in case event missed)
setTimeout(() => { if (!authUIInjected) injectAuthUI(); }, 2000);

export { app, auth, db, provider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };