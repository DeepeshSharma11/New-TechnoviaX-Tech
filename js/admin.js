// Import initialized instances from central file
// Ensure loginfirebase.js exports 'auth' and 'db'
import { auth, db } from "./loginfirebase.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// 🔒 AUTHORIZED ADMINS ONLY
const ADMIN_EMAILS = [
    "info.technoviax@gmail.com",
    "deepeshdesi12@gmail.com",
    "deepeshtech8433@gmail.com" 
];

// DOM Elements
let adminPanel, adminToggleBtn, adminList, closeAdminBtn;

document.addEventListener('DOMContentLoaded', () => {
    adminPanel = document.getElementById('admin-panel');
    adminToggleBtn = document.getElementById('admin-toggle-btn');
    adminList = document.getElementById('admin-list');
    closeAdminBtn = document.getElementById('close-admin');

    // Securely hide on load
    if (adminToggleBtn) adminToggleBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    initSecurityMonitor();
});

function initSecurityMonitor() {
    // Listen to the central Auth instance
    onAuthStateChanged(auth, (user) => {
        if (user && ADMIN_EMAILS.includes(user.email)) {
            console.log("🔒 Admin Identified: " + user.email);
            enableAdminFeatures(user);
        } else {
            // If not admin, remove elements from DOM for security
            if (adminToggleBtn) adminToggleBtn.remove();
            if (adminPanel) adminPanel.remove();
        }
    });
}

function enableAdminFeatures(user) {
    if (!adminToggleBtn || !adminPanel) return;

    // Make button visible and styled
    adminToggleBtn.style.display = 'block';
    adminToggleBtn.innerText = "Admin Dashboard 🔒";
    adminToggleBtn.className = "fixed bottom-4 right-4 z-50 px-6 py-3 rounded-full shadow-2xl text-sm font-bold transition-all transform hover:scale-105 bg-red-600 text-white hover:bg-red-700 border-2 border-white flex items-center gap-2";

    adminToggleBtn.addEventListener('click', () => {
        adminPanel.style.display = 'block';
        loadAllTransactions();
    });

    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
        });
    }

    // Expose secure actions globally so HTML buttons can call them
    window.secureAdminAction = (action, id) => performAdminAction(action, id, user.email);
}

function loadAllTransactions() {
    if (!adminList) return;
    adminList.innerHTML = '<div class="text-center py-4 text-gray-500">Syncing Secure Data...</div>';

    const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            adminList.innerHTML = '<p class="text-center text-gray-500">No transaction records found.</p>';
            return;
        }
        adminList.innerHTML = '';
        
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'N/A';
            
            let statusColor = "text-yellow-600";
            if(data.status === 'Success') statusColor = "text-green-600";
            if(data.status === 'Failed') statusColor = "text-red-600";

            let actionsHTML = '';
            if (data.status === 'Pending Verification') {
                actionsHTML = `
                    <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onclick="window.secureAdminAction('reject', '${id}')" class="px-4 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-bold transition-colors">Reject</button>
                        <button onclick="window.secureAdminAction('approve', '${id}')" class="px-4 py-1.5 text-xs bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 font-bold transition-colors">Approve</button>
                    </div>`;
            } else {
                actionsHTML = `<div class="mt-2 pt-2 border-t border-gray-100 text-right text-xs font-bold text-gray-400">Processed by Admin</div>`;
            }

            adminList.innerHTML += `
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="font-bold text-lg text-gray-800">₹${data.amount}</div>
                            <div class="text-primary font-medium">${data.userName}</div>
                            <div class="text-xs text-gray-500">${data.userEmail}</div>
                            <div class="text-xs text-gray-500 mt-1">${data.purpose} (${data.method})</div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold ${statusColor} text-xs uppercase bg-gray-50 px-2 py-1 rounded inline-block mb-1">${data.status}</div>
                            <div class="text-[10px] text-gray-400 font-mono">${data.transactionId}</div>
                            <div class="text-[10px] text-gray-400 mt-1">${date}</div>
                        </div>
                    </div>
                    ${actionsHTML}
                </div>`;
        });
    });
}

async function performAdminAction(action, id, adminEmail) {
    if (!confirm(`Are you sure you want to ${action.toUpperCase()} this payment?`)) return;
    
    const newStatus = action === 'approve' ? 'Success' : 'Failed';
    try {
        await updateDoc(doc(db, "payments", id), {
            status: newStatus,
            verifiedBy: adminEmail,
            verifiedAt: new Date()
        });
        // Success alert removed for smoother UX, Firestore listener will update UI auto
    } catch (error) {
        alert("Action failed: " + error.message);
    }
}