// Import functions from Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- Helper Functions ---
function showError(elementId, msg) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
    } else {
        alert(msg);
    }
}

// 1. Redirect URL Helper
// यह चेक करता है कि URL में '?redirect=' है या नहीं
function getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || '/'; // अगर नहीं है तो Home ('/') पर भेजो
}

// 2. Create Redirect String for Buttons
// यह करंट पेज का पाथ (Path) लॉगिन लिंक में जोड़ता है
function getCurrentPageParam() {
    const path = window.location.pathname;
    // अगर हम पहले से लॉगिन या रजिस्टर पेज पर हैं, तो रिडायरेक्ट मत जोड़ो
    if (path.includes('login.html') || path.includes('register.html')) {
        return '';
    }
    return `?redirect=${encodeURIComponent(path)}`;
}


// --- LOGIN LOGIC ---
const emailForm = document.getElementById('email-login-form');
const googleBtn = document.getElementById('google-login-btn');

// Google Login
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);
                
                if (!docSnap.exists()) {
                    await setDoc(userRef, {
                        name: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        createdAt: new Date()
                    });
                }
                
                // Login Successful -> Redirect User back
                window.location.href = getRedirectUrl();
            })
            .catch((error) => showError('error-message', error.message));
    });
}

// Email Login
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Login Successful -> Redirect User back
                window.location.href = getRedirectUrl();
            })
            .catch((error) => {
                let msg = "Login failed.";
                if (error.code === 'auth/invalid-credential') msg = "Wrong email or password.";
                showError('error-message', msg);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
    });
}

// --- SIGN UP LOGIC ---
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const signupBtn = document.getElementById('signup-btn');
        const originalText = signupBtn.innerHTML;

        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                createdAt: new Date(),
                role: 'user'
            });

            alert("Account created successfully!");
            // Signup Successful -> Redirect (Default to Home usually, or handle redirect param too)
            window.location.href = '/';

        } catch (error) {
            console.error("Signup Error:", error);
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') msg = "Email already registered.";
            if (error.code === 'auth/weak-password') msg = "Password too weak.";
            showError('signup-error', msg);
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalText;
        }
    });
}

// --- UI INJECTION & AUTH STATE ---
function injectAuthUI() {
    const navList = document.querySelector('.nav-links');
    if (navList && !document.getElementById('nav-login')) {
        const liLogin = document.createElement('li');
        liLogin.id = 'nav-login';
        
        // Premium Button Style
        const btnClasses = "flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
        
        // Add Redirect Parameter to Link
        const redirectParam = getCurrentPageParam();
        liLogin.innerHTML = `<a href="/login.html${redirectParam}" class="${btnClasses}"><i class="fas fa-user"></i> <span>Login</span></a>`;
        
        navList.appendChild(liLogin);

        const liProfile = document.createElement('li');
        liProfile.id = 'nav-profile';
        liProfile.className = 'hidden'; 
        liProfile.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md" id="injected-logout-btn">
                <img id="nav-user-avatar" src="https://via.placeholder.com/150" alt="User" class="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover">
                <span class="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Logout</span>
            </div>
        `;
        navList.appendChild(liProfile);
        
        const logoutBtn = liProfile.querySelector('#injected-logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    if(confirm("Are you sure you want to logout?")) {
        signOut(auth).then(() => {
             // Reload current page to refresh UI state
             window.location.reload();
        });
    }
}

// Global Auth Listener
onAuthStateChanged(auth, (user) => {
    const navLogin = document.getElementById('nav-login');
    const navProfile = document.getElementById('nav-profile');
    const navAvatar = document.getElementById('nav-user-avatar');
    const footerLoginItem = document.getElementById('footer-login-item');

    if (user) {
        // Logged In
        if (navLogin) navLogin.classList.add('hidden');
        if (navProfile) navProfile.classList.remove('hidden');
        if (navAvatar) navAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`;
        
        if (footerLoginItem) {
            const firstName = user.displayName ? user.displayName.split(' ')[0] : 'User';
            footerLoginItem.innerHTML = `<span class="text-primary font-bold cursor-default">Hi, ${firstName}</span>`;
        }
    } else {
        // Logged Out
        if (navLogin) navLogin.classList.remove('hidden');
        if (navProfile) navProfile.classList.add('hidden');
        
        if (footerLoginItem) {
            // Update Footer link with redirect as well
            const redirectParam = getCurrentPageParam();
            footerLoginItem.innerHTML = `<a href="/login.html${redirectParam}" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base">Login</a>`;
        }
    }
});

// Init
document.addEventListener('DOMContentLoaded', injectAuthUI);