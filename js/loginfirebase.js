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

// --- UI Injection Function ---
function injectAuthUI() {
    const navList = document.querySelector('.nav-links');
    
    if (navList && !document.getElementById('nav-login')) {
        // Create a spacer before login button
        const liSpacer = document.createElement('li');
        liSpacer.className = 'ml-4 mr-2';
        liSpacer.innerHTML = '<div class="w-px h-6 bg-gray-300 mx-2"></div>';
        navList.appendChild(liSpacer);
        
        // 1. Create Login Button
        const liLogin = document.createElement('li');
        liLogin.id = 'nav-login';
        liLogin.className = 'nav-login-item';
        const btnClasses = "flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
        liLogin.innerHTML = `<a href="/login.html" class="${btnClasses}"><i class="fas fa-user mr-1"></i> <span>Login</span></a>`;
        navList.appendChild(liLogin);
        
        // Create another spacer after login button
        const liSpacer2 = document.createElement('li');
        liSpacer2.className = 'mr-2';
        liSpacer2.innerHTML = '<div class="w-px h-6 bg-gray-300 mx-2"></div>';
        navList.appendChild(liSpacer2);

        // 2. Create Profile/Logout Section
        const liProfile = document.createElement('li');
        liProfile.id = 'nav-profile';
        liProfile.className = 'hidden nav-profile-item'; 
        liProfile.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md" id="injected-logout-btn">
                <img id="nav-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover">
                <span class="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors truncate max-w-[80px]">Profile</span>
                <i class="fas fa-chevron-down text-gray-400 text-xs group-hover:text-primary ml-1 transition-colors"></i>
            </div>
            <div id="logout-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div class="p-4 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                        <img id="dropdown-avatar" src="https://via.placeholder.com/150" alt="User" class="w-10 h-10 rounded-full border-2 border-primary object-cover">
                        <div class="flex-1 min-w-0">
                            <p id="dropdown-name" class="text-sm font-semibold text-gray-800 truncate"></p>
                            <p id="dropdown-email" class="text-xs text-gray-500 truncate"></p>
                        </div>
                    </div>
                </div>
                <div class="p-2">
                    <button id="dropdown-logout-btn" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        navList.appendChild(liProfile);

        // Add click event for profile dropdown
        const profileBtn = liProfile.querySelector('#injected-logout-btn');
        const dropdown = liProfile.querySelector('#logout-dropdown');
        const dropdownLogoutBtn = liProfile.querySelector('#dropdown-logout-btn');
        
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });
        }
        
        if (dropdownLogoutBtn) {
            dropdownLogoutBtn.addEventListener('click', handleLogout);
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdown && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
            }
        });
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
    // Navbar Elements
    const navLogin = document.getElementById('nav-login');
    const navProfile = document.getElementById('nav-profile');
    const navAvatar = document.getElementById('nav-user-avatar');
    const dropdownAvatar = document.getElementById('dropdown-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    
    // Footer Element
    const footerLoginItem = document.getElementById('footer-login-item');

    // Login Page Elements
    const loginContainer = document.getElementById('login-container');
    const userContainer = document.getElementById('user-container');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const profilePic = document.getElementById('profile-pic');

    if (user) {
        // --- LOGGED IN STATE ---
        
        // 1. Navbar
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        if (navAvatar) navAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;
        if (dropdownAvatar) dropdownAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;
        if (dropdownName) dropdownName.textContent = user.displayName || 'User';
        if (dropdownEmail) dropdownEmail.textContent = user.email;

        // 2. Footer (Change Login Link to User Name)
        if (footerLoginItem) {
            const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
            // Replaces the <a> tag with a span showing the name
            footerLoginItem.innerHTML = `<span class="text-primary font-bold cursor-default">Hi, ${firstName}</span>`;
        }

        // 3. Login Page Content
        if (loginContainer && userContainer) {
            loginContainer.classList.add('hidden');
            userContainer.classList.remove('hidden');
            if (userName) userName.textContent = user.displayName || 'User';
            if (userEmail) userEmail.textContent = user.email;
            if (profilePic) profilePic.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`;
        }
    } else {
        // --- LOGGED OUT STATE ---

        // 1. Navbar
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');

        // 2. Footer (Reset to Login Link)
        if (footerLoginItem) {
            footerLoginItem.innerHTML = `<a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base">Login</a>`;
        }

        // 3. Login Page Content
        if (loginContainer && userContainer) {
            loginContainer.classList.remove('hidden');
            userContainer.classList.add('hidden');
        }
        
        checkFirstTimeVisitor();
    }
});

// --- Page Initialization ---
document.addEventListener('DOMContentLoaded', () => {
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

// Export for use in other files if needed
export { auth, provider, signInWithPopup, signInWithEmailAndPassword, signOut };