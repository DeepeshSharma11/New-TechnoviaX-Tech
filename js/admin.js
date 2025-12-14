import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- SECURITY CONFIGURATION ---
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBk33C9Xlw54hwJkgfC0mJWeFXBtZi7FPM",
    authDomain: "technoviax-tech.firebaseapp.com",
    projectId: "technoviax-tech",
    storageBucket: "technoviax-tech.firebasestorage.app",
    messagingSenderId: "238376394946",
    appId: "1:238376394946:web:4fbb7be471316c0cea5b5b",
    measurementId: "G-BYG4TMPMMV"
};

// 🔒 AUTHORIZED ADMINS ONLY
// Sirf ye emails hi admin panel dekh payenge.
const ADMIN_EMAILS = [
    "info.technoviax@gmail.com",
    "deepeshdesi12@gmail.com",
    "deepeshtech8433@gmail.com" 
];

// Initialize Services
const app = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
let adminPanel, adminToggleBtn, adminList, closeAdminBtn;

document.addEventListener('DOMContentLoaded', () => {
    // Bind elements securely
    adminPanel = document.getElementById('admin-panel');
    adminToggleBtn = document.getElementById('admin-toggle-btn');
    adminList = document.getElementById('admin-list');
    closeAdminBtn = document.getElementById('close-admin');

    // Initially Hide Everything (Security First)
    if (adminToggleBtn) adminToggleBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    // Start Security Monitor
    initSecurityMonitor();
});

function initSecurityMonitor() {
    onAuthStateChanged(auth, (user) => {
        if (user && ADMIN_EMAILS.includes(user.email)) {
            console.log("%c [SECURE ADMIN] Access Granted: " + user.email, "color: green; font-weight: bold;");
            enableAdminFeatures(user);
        } else {
            console.log("%c [SECURE ADMIN] Access Denied. Hiding Controls.", "color: red;");
            nukeAdminControls(); // Remove elements from DOM completely
        }
    });
}

// 🛡️ FUNCTION: Remove Admin Elements for Non-Admins
function nukeAdminControls() {
    if (adminToggleBtn) adminToggleBtn.remove();
    if (adminPanel) adminPanel.remove();
    // Clear variables to free memory and prevent console hacking
    adminPanel = null;
    adminToggleBtn = null;
}

// 🔓 FUNCTION: Enable Features for Admins
function enableAdminFeatures(user) {
    if (!adminToggleBtn || !adminPanel) return;

    // Show Toggle Button
    adminToggleBtn.style.display = 'block';
    adminToggleBtn.innerText = "Admin Dashboard 🔒";
    adminToggleBtn.classList.remove('opacity-50');
    adminToggleBtn.classList.add('bg-red-600', 'hover:bg-red-700', 'text-white');

    // Event Listeners
    adminToggleBtn.addEventListener('click', () => {
        adminPanel.style.display = 'block'; // Use standard display property
        adminPanel.classList.remove('hidden');
        loadAllTransactions();
    });

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            adminPanel.classList.add('hidden');
        });
    }

    // Initialize Admin Actions Globally (Securely scoped)
    window.secureAdminAction = (action, id) => performAdminAction(action, id, user.email);
}

// 📡 FUNCTION: Load Real-time Data
function loadAllTransactions() {
    if (!adminList) return;
    
    adminList.innerHTML = '<div class="text-center py-4"><i class="fas fa-circle-notch fa-spin text-primary"></i> Syncing Secure Data...</div>';

    const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            adminList.innerHTML = '<p class="text-center text-gray-500">No transaction records found.</p>';
            return;
        }

        adminList.innerHTML = ''; // Clear list

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'N/A';
            
            // Status Styling
            let statusColor = "bg-yellow-100 text-yellow-700";
            if (data.status === 'Success') statusColor = "bg-green-100 text-green-700";
            if (data.status === 'Failed') statusColor = "bg-red-100 text-red-700";

            // Action Buttons Logic
            let actionsHTML = '';
            if (data.status === 'Pending Verification') {
                actionsHTML = `
                    <div class="flex justify-end gap-3 mt-3 border-t border-gray-100 pt-3">
                        <button onclick="window.secureAdminAction('reject', '${id}')" 
                                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200">
                            <i class="fas fa-times mr-1"></i> Reject
                        </button>
                        <button onclick="window.secureAdminAction('approve', '${id}')" 
                                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 transition-colors border border-green-200">
                            <i class="fas fa-check mr-1"></i> Verify & Approve
                        </button>
                    </div>
                `;
            } else {
                actionsHTML = `
                    <div class="mt-2 text-right text-xs font-bold text-gray-400 italic">
                        Processed: ${data.status}
                    </div>
                `;
            }

            // Secure Card Template
            const card = `
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full ${data.status === 'Success' ? 'bg-green-500' : (data.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-400')}"></div>
                    
                    <div class="flex justify-between items-start pl-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-gray-800 text-lg">₹${data.amount}</span>
                                <span class="text-xs px-2 py-0.5 rounded ${statusColor} border border-opacity-20 border-current">${data.status}</span>
                            </div>
                            <p class="text-sm font-medium text-primary mt-1">${data.userName} <span class="text-gray-400 font-normal">(${data.userEmail})</span></p>
                            <p class="text-xs text-gray-500 mt-0.5">${data.purpose} • ${data.method}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 select-all" title="Transaction ID">${data.transactionId}</p>
                            <p class="text-[10px] text-gray-400 mt-1">${date}</p>
                        </div>
                    </div>
                    ${actionsHTML}
                </div>
            `;
            adminList.innerHTML += card;
        });
    }, (error) => {
        console.error("Secure Sync Error:", error);
    });
}

// ⚡ FUNCTION: Perform Action (Approve/Reject)
async function performAdminAction(action, id, adminEmail) {
    const confirmation = confirm(`Are you sure you want to ${action.toUpperCase()} this transaction?`);
    if (!confirmation) return;

    const newStatus = action === 'approve' ? 'Success' : 'Failed';

    try {
        const docRef = doc(db, "payments", id);
        
        // 1. Update Status
        await updateDoc(docRef, {
            status: newStatus,
            verifiedBy: adminEmail,
            verifiedAt: new Date()
        });

        // 2. Audit Log (Console for now, typically sent to a logging collection)
        console.log(`[AUDIT] Transaction ${id} marked as ${newStatus} by ${adminEmail}`);
        
        // 3. UI Feedback
        alert(`Transaction successfully marked as ${newStatus}.`);

    } catch (error) {
        console.error("Admin Action Failed:", error);
        alert("Operation failed. Check console for security errors.");
    }
}