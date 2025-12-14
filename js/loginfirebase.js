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

// Wait for navigation to be ready
let navigationInjected = false;
let authUIInjected = false;

// Listen for navigation ready event
window.addEventListener('navigationInjected', () => {
    navigationInjected = true;
    injectAuthUI();
});

// --- FIXED LOGOUT LOGIC (Event Delegation) ---
// Isse dynamic buttons par bhi click kaam karega
document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('#desktop-logout-btn, #mobile-logout-btn');
    if (logoutBtn) {
        e.preventDefault();
        handleLogout();
    }
});

// Logout Function
async function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        try {
            await signOut(auth);
            showToast("Logged out successfully", 'success');
            
            // UI Reset Immediately
            updateAuthUI(null);
            
            // Redirect if on protected pages
            if (window.location.pathname.includes('/profile.html') || 
                window.location.pathname.includes('/payment.html') ||
                window.location.pathname.includes('/login.html')) {
                window.location.href = '/login.html';
            }
        } catch(error) {
            console.error("Logout Error:", error);
            showToast("Error logging out", 'error');
        }
    }
}

// --- UI Injection Function ---
function injectAuthUI() {
    if (authUIInjected) return;
    
    const desktopContainer = document.getElementById('nav-login-container');
    const mobileContainer = document.getElementById('mobile-login-container');
    const mobileFullContainer = document.getElementById('mobile-full-login-container');
    
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
                    <a href="/payment.html" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-wallet text-gray-500"></i>
                        <span>Payments</span>
                    </a>
                    <a href="/profile.html" class="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <i class="fas fa-user-cog text-gray-500"></i>
                        <span>My Profile</span>
                    </a>
                    <button id="desktop-logout-btn" class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        desktopContainer.appendChild(profileDropdown);
        
        // Dropdown Toggle Logic
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
                <a href="/payment.html" class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="fas fa-wallet text-gray-500 w-5"></i>
                    <span>Payments</span>
                </a>
                <a href="/profile.html" class="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <i class="fas fa-user-cog text-gray-500 w-5"></i>
                    <span>My Profile</span>
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
    checkAuthState();
}

// Add custom styles for auth UI and Toasts
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

        /* Toast Styles */
        .auth-toast { position: fixed; bottom: 20px; right: 20px; background: #1f2937; color: white; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); z-index: 10000; opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); font-size: 14px; display: flex; align-items: center; gap: 10px; font-weight: 500; border-left: 4px solid #3b82f6; pointer-events: none; }
        .auth-toast.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .auth-toast.success { border-left-color: #10b981; }
        .auth-toast.error { border-left-color: #ef4444; }
        .auth-toast i { font-size: 16px; }
    `;
    document.head.appendChild(style);
}

// Toast Notification Function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `auth-toast ${type}`;
    const iconClass = type === 'success' ? 'fa-check-circle text-green-400' : 'fa-exclamation-circle text-red-400';
    toast.innerHTML = `<i class="fas ${iconClass}"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    // Trigger reflow for animation
    void toast.offsetHeight;
    
    requestAnimationFrame(() => toast.classList.add('show'));
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Auth State Monitor ---
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        if (!user) {
            checkFirstTimeVisitor();
        } else {
            // Check/Create profile quietly
            checkUserProfile(user);
        }
    });
}

async function checkUserProfile(user) {
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
        }
    } catch (e) { console.error("Profile check error", e); }
}

// First Time Visitor
function checkFirstTimeVisitor() {
    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    if (!hasVisited && window.location.pathname !== '/login.html') {
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        window.location.href = '/login.html';
    }
}

// --- UI Update Logic ---
function updateAuthUI(user) {
    if (!authUIInjected) {
        setTimeout(() => updateAuthUI(user), 100);
        return;
    }
    
    const desktopLoginBtn = document.getElementById('desktop-login-btn');
    const desktopProfileDropdown = document.getElementById('desktop-profile-dropdown');
    const desktopAvatar = document.getElementById('desktop-user-avatar');
    const dropdownAvatar = document.getElementById('dropdown-user-avatar');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    
    const mobileTopLoginBtn = document.getElementById('mobile-top-login-btn');
    const mobileFullLoginBtn = document.getElementById('mobile-full-login-btn');
    const mobileProfileSection = document.getElementById('mobile-profile-section');
    const mobileAvatar = document.getElementById('mobile-user-avatar');
    const mobileName = document.getElementById('mobile-user-name');
    const mobileEmail = document.getElementById('mobile-user-email');
    
    const footerLoginItem = document.getElementById('footer-login-item');

    if (user) {
        const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random&color=fff`;
        const displayName = user.displayName || user.email.split('@')[0];

        // Desktop
        if (desktopLoginBtn) desktopLoginBtn.style.display = 'none';
        if (desktopProfileDropdown) desktopProfileDropdown.style.display = 'flex';
        if (desktopAvatar) desktopAvatar.src = avatarUrl;
        if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
        if (dropdownName) dropdownName.textContent = displayName;
        if (dropdownEmail) dropdownEmail.textContent = user.email;

        // Mobile
        if (mobileTopLoginBtn) mobileTopLoginBtn.style.display = 'none';
        if (mobileFullLoginBtn) mobileFullLoginBtn.style.display = 'none';
        if (mobileProfileSection) mobileProfileSection.style.display = 'block';
        if (mobileAvatar) mobileAvatar.src = avatarUrl;
        if (mobileName) mobileName.textContent = displayName;
        if (mobileEmail) mobileEmail.textContent = user.email;

        // Footer
        if (footerLoginItem) footerLoginItem.innerHTML = `<span class="text-primary font-bold cursor-default">Welcome, ${displayName}</span>`;

    } else {
        // Desktop
        if (desktopLoginBtn) desktopLoginBtn.style.display = 'block';
        if (desktopProfileDropdown) desktopProfileDropdown.style.display = 'none';

        // Mobile
        if (mobileTopLoginBtn) mobileTopLoginBtn.style.display = 'flex';
        if (mobileFullLoginBtn) mobileFullLoginBtn.style.display = 'block';
        if (mobileProfileSection) mobileProfileSection.style.display = 'none';

        // Footer
        if (footerLoginItem) footerLoginItem.innerHTML = `<a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base">Login</a>`;
    }
}

// Fallback injection after 2 seconds
setTimeout(() => {
    if (!authUIInjected) injectAuthUI();
}, 2000);

// Export for use in other files
export { app, auth, db, provider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };