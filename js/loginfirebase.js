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

// --- UI Injection Function for Responsive Navigation ---
function injectAuthUI() {
    // Wait for navigation to be injected
    setTimeout(() => {
        // 1. DESKTOP LOGIN BUTTON (nav-login-container में)
        const desktopLoginContainer = document.getElementById('nav-login-container');
        if (desktopLoginContainer && !desktopLoginContainer.querySelector('#desktop-login-btn')) {
            const loginBtn = document.createElement('div');
            loginBtn.id = 'desktop-login-btn';
            loginBtn.className = 'nav-login-btn';
            loginBtn.innerHTML = `
                <a href="/login.html" class="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap">
                    <i class="fas fa-user mr-1 text-sm"></i> 
                    <span class="text-sm">Login</span>
                </a>
            `;
            desktopLoginContainer.appendChild(loginBtn);
        }

        // 2. MOBILE LOGIN BUTTON (top bar में - tablet/mobile के लिए)
        const mobileLoginContainer = document.getElementById('mobile-login-container');
        if (mobileLoginContainer && !mobileLoginContainer.querySelector('#mobile-top-login-btn')) {
            const mobileTopBtn = document.createElement('div');
            mobileTopBtn.id = 'mobile-top-login-btn';
            mobileTopBtn.className = 'mobile-top-login-btn';
            mobileTopBtn.innerHTML = `
                <a href="/login.html" class="flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-sm hover:shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-sm whitespace-nowrap">
                    <i class="fas fa-user text-xs"></i>
                    <span class="hidden sm:inline">Login</span>
                </a>
            `;
            mobileLoginContainer.appendChild(mobileTopBtn);
        }

        // 3. MOBILE FULL LOGIN (mobile menu में)
        const mobileFullLoginContainer = document.getElementById('mobile-full-login-container');
        if (mobileFullLoginContainer && !mobileFullLoginContainer.querySelector('#mobile-full-login-btn')) {
            const mobileFullBtn = document.createElement('div');
            mobileFullBtn.id = 'mobile-full-login-btn';
            mobileFullBtn.className = 'mobile-full-login-btn w-full';
            mobileFullBtn.innerHTML = `
                <a href="/login.html" class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full">
                    <i class="fas fa-user mr-2"></i>
                    <span>Login / Register</span>
                </a>
            `;
            mobileFullLoginContainer.appendChild(mobileFullBtn);
        }

        // 4. DESKTOP PROFILE DROPDOWN (logged in state के लिए)
        const desktopProfileContainer = document.getElementById('nav-login-container');
        if (desktopProfileContainer && !desktopProfileContainer.querySelector('#desktop-profile-dropdown')) {
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
                        <button id="desktop-logout-btn" class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            `;
            desktopProfileContainer.appendChild(profileDropdown);
            
            // Add click event for desktop profile dropdown
            const profileBtn = profileDropdown.querySelector('#desktop-profile-btn');
            const dropdownMenu = profileDropdown.querySelector('#desktop-dropdown-menu');
            const desktopLogoutBtn = profileDropdown.querySelector('#desktop-logout-btn');
            
            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('hidden');
                });
            }
            
            if (desktopLogoutBtn) {
                desktopLogoutBtn.addEventListener('click', handleLogout);
            }
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                    dropdownMenu.classList.add('hidden');
                }
            });
        }

        // 5. MOBILE PROFILE (logged in state के लिए mobile में)
        const mobileFullContainer = document.getElementById('mobile-full-login-container');
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
                    <button id="mobile-logout-btn" class="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
                        <i class="fas fa-sign-out-alt w-5"></i>
                        <span>Logout</span>
                    </button>
                </div>
            `;
            mobileFullContainer.appendChild(mobileProfile);
            
            const mobileLogoutBtn = mobileProfile.querySelector('#mobile-logout-btn');
            if (mobileLogoutBtn) {
                mobileLogoutBtn.addEventListener('click', handleLogout);
            }
        }

        // Add custom styles for responsive auth UI
        addAuthStyles();
        
    }, 500); // Navigation inject होने का wait करें
}

// Add custom styles for auth UI
function addAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Auth UI Responsive Styles */
        .nav-login-btn a {
            min-height: 36px;
            min-width: 36px;
        }
        
        .mobile-top-login-btn a {
            min-height: 32px;
            min-width: 32px;
        }
        
        .mobile-full-login-btn a {
            min-height: 44px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 639px) {
            .nav-login-btn a span {
                display: none;
            }
            
            .nav-login-btn a {
                padding: 0.5rem;
                min-width: 40px;
                justify-content: center;
            }
            
            .mobile-top-login-btn {
                display: none;
            }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
            .mobile-top-login-btn a span {
                font-size: 0.875rem;
            }
            
            .nav-login-btn a {
                font-size: 0.875rem;
                padding: 0.5rem 0.75rem;
            }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
            .nav-login-btn a {
                font-size: 0.875rem;
                padding: 0.5rem 1rem;
            }
        }
        
        @media (min-width: 1024px) {
            .mobile-top-login-btn,
            .mobile-full-login-btn {
                display: none !important;
            }
        }
        
        /* Desktop profile dropdown positioning */
        .nav-profile-dropdown {
            position: relative;
        }
        
        #desktop-dropdown-menu {
            min-width: 240px;
        }
        
        /* Mobile profile section */
        .mobile-profile-section {
            animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Active state for buttons */
        .nav-login-btn a:active,
        .mobile-top-login-btn a:active,
        .mobile-full-login-btn a:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
}

// --- First Time Visitor Logic ---
function checkFirstTimeVisitor() {
    const hasVisited = localStorage.getItem('hasVisitedTechnoviaX');
    if (!hasVisited && window.location.pathname !== '/login.html') {
        localStorage.setItem('hasVisitedTechnoviaX', 'true');
        window.location.href = '/login.html';
    }
}

// --- Login/Logout Logic ---
const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        const errorMsg = document.getElementById('error-message');
        if (errorMsg) errorMsg.classList.add('hidden');
        signInWithPopup(auth, provider).catch((error) => {
            if (errorMsg) {
                errorMsg.textContent = error.message;
                errorMsg.classList.remove('hidden');
            }
        });
    });
}

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

function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
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

// --- Auth State Monitor (Updates UI Everywhere) ---
onAuthStateChanged(auth, (user) => {
    // Update all UI elements based on auth state
    updateAuthUI(user);
    
    if (!user) {
        checkFirstTimeVisitor();
    }
});

// Function to update all auth UI elements
function updateAuthUI(user) {
    // 1. Desktop Elements
    const desktopLoginBtn = document.getElementById('desktop-login-btn');
    const desktopProfileDropdown = document.getElementById('desktop-profile-dropdown');
    const desktopAvatar = document.getElementById('desktop-user-avatar');
    const dropdownAvatar = document.getElementById('dropdown-user-avatar');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    
    // 2. Mobile Top Bar Elements
    const mobileTopLoginBtn = document.getElementById('mobile-top-login-btn');
    
    // 3. Mobile Full Menu Elements
    const mobileFullLoginBtn = document.getElementById('mobile-full-login-btn');
    const mobileProfileSection = document.getElementById('mobile-profile-section');
    const mobileAvatar = document.getElementById('mobile-user-avatar');
    const mobileName = document.getElementById('mobile-user-name');
    const mobileEmail = document.getElementById('mobile-user-email');
    
    // 4. Footer Element
    const footerLoginItem = document.getElementById('footer-login-item');
    
    // 5. Login Page Elements
    const loginContainer = document.getElementById('login-container');
    const userContainer = document.getElementById('user-container');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const profilePic = document.getElementById('profile-pic');

    if (user) {
        // --- LOGGED IN STATE ---
        
        // 1. Desktop Navigation
        if (desktopLoginBtn) desktopLoginBtn.classList.add('hidden');
        if (desktopProfileDropdown) desktopProfileDropdown.classList.remove('hidden');
        
        // Update user info
        const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=random&color=fff`;
        if (desktopAvatar) desktopAvatar.src = avatarUrl;
        if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
        if (dropdownName) dropdownName.textContent = user.displayName || 'User';
        if (dropdownEmail) dropdownEmail.textContent = user.email;

        // 2. Mobile Top Bar
        if (mobileTopLoginBtn) mobileTopLoginBtn.classList.add('hidden');

        // 3. Mobile Full Menu
        if (mobileFullLoginBtn) mobileFullLoginBtn.classList.add('hidden');
        if (mobileProfileSection) mobileProfileSection.classList.remove('hidden');
        if (mobileAvatar) mobileAvatar.src = avatarUrl;
        if (mobileName) mobileName.textContent = user.displayName || 'User';
        if (mobileEmail) mobileEmail.textContent = user.email;

        // 4. Footer
        if (footerLoginItem) {
            const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
            footerLoginItem.innerHTML = `<span class="text-primary font-bold cursor-default">Hi, ${firstName}</span>`;
        }

        // 5. Login Page
        if (loginContainer && userContainer) {
            loginContainer.classList.add('hidden');
            userContainer.classList.remove('hidden');
            if (userName) userName.textContent = user.displayName || 'User';
            if (userEmail) userEmail.textContent = user.email;
            if (profilePic) profilePic.src = avatarUrl;
        }
    } else {
        // --- LOGGED OUT STATE ---
        
        // 1. Desktop Navigation
        if (desktopLoginBtn) desktopLoginBtn.classList.remove('hidden');
        if (desktopProfileDropdown) desktopProfileDropdown.classList.add('hidden');

        // 2. Mobile Top Bar
        if (mobileTopLoginBtn) mobileTopLoginBtn.classList.remove('hidden');

        // 3. Mobile Full Menu
        if (mobileFullLoginBtn) mobileFullLoginBtn.classList.remove('hidden');
        if (mobileProfileSection) mobileProfileSection.classList.add('hidden');

        // 4. Footer
        if (footerLoginItem) {
            footerLoginItem.innerHTML = `<a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base">Login</a>`;
        }

        // 5. Login Page
        if (loginContainer && userContainer) {
            loginContainer.classList.remove('hidden');
            userContainer.classList.add('hidden');
        }
    }
}

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Inject auth UI
    injectAuthUI();
    
    // Update copyright year if element exists
    const year = document.getElementById('year');
    if(year) year.textContent = new Date().getFullYear();
    
    // Handle loading screen
    const loading = document.getElementById('loading');
    if(loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => loading.style.display = 'none', 500);
        }, 500);
    }
});

// Retry injection if navigation takes time to load
setTimeout(injectAuthUI, 1000);
setTimeout(injectAuthUI, 2000);

// Export for use in other files if needed
export { auth, provider, signInWithPopup, signInWithEmailAndPassword, signOut };