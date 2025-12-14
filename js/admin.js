// Import from central Firebase config
import { auth, db } from "./loginfirebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot,
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Authorized admins only
const ADMIN_EMAILS = [
    "info.technoviax@gmail.com",
    "deepeshdesi12@gmail.com",
    "deepeshtech8433@gmail.com"
];

// DOM Elements
let adminPanel, adminToggleBtn, adminList, closeAdminBtn;

// Admin actions exposed globally
window.secureAdminAction = null;

document.addEventListener('DOMContentLoaded', () => {
    adminPanel = document.getElementById('admin-panel');
    adminToggleBtn = document.getElementById('admin-toggle-btn');
    adminList = document.getElementById('admin-list');
    closeAdminBtn = document.getElementById('close-admin');

    // Securely hide on load
    if (adminToggleBtn) adminToggleBtn.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'none';

    // Start security monitoring
    initSecurityMonitor();
});

function initSecurityMonitor() {
    onAuthStateChanged(auth, (user) => {
        if (user && ADMIN_EMAILS.includes(user.email)) {
            console.log("🔒 Admin authorized: " + user.email);
            enableAdminFeatures(user);
        } else {
            // Remove admin elements if not authorized
            if (adminToggleBtn) adminToggleBtn.remove();
            if (adminPanel) adminPanel.remove();
        }
    });
}

function enableAdminFeatures(user) {
    if (!adminToggleBtn || !adminPanel) return;

    // Make admin button visible
    adminToggleBtn.style.display = 'block';
    adminToggleBtn.innerHTML = `
        <i class="fas fa-shield-alt mr-2"></i>
        Admin Dashboard
    `;
    adminToggleBtn.className = `
        fixed bottom-4 right-4 z-50 px-4 py-3 rounded-full shadow-2xl 
        text-sm font-bold transition-all transform hover:scale-105 
        bg-gradient-to-r from-red-600 to-red-700 text-white 
        hover:from-red-700 hover:to-red-800 border-2 border-white 
        flex items-center gap-2
    `;

    // Toggle admin panel
    adminToggleBtn.addEventListener('click', () => {
        adminPanel.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        loadAllTransactions();
    });

    // Close admin panel
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', () => {
            adminPanel.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Expose secure admin actions globally
    window.secureAdminAction = (action, id) => performAdminAction(action, id, user.email);
}

function loadAllTransactions() {
    if (!adminList) return;
    
    adminList.innerHTML = `
        <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p class="text-gray-500">Loading secure transaction data...</p>
        </div>
    `;

    const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            adminList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-database text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">No transaction records found.</p>
                </div>
            `;
            return;
        }

        adminList.innerHTML = '';
        
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            
            // Format date
            const date = data.createdAt ? data.createdAt.toDate().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'N/A';
            
            // Status styling
            let statusColor = "bg-yellow-100 text-yellow-800";
            let statusIcon = "fa-clock";
            
            if (data.status === 'Success') {
                statusColor = "bg-green-100 text-green-800";
                statusIcon = "fa-check-circle";
            } else if (data.status === 'Failed') {
                statusColor = "bg-red-100 text-red-800";
                statusIcon = "fa-times-circle";
            }
            
            // Action buttons (only for pending)
            let actionsHTML = '';
            if (data.status === 'Pending Verification') {
                actionsHTML = `
                    <div class="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
                        <button onclick="secureAdminAction('reject', '${id}')" 
                                class="px-4 py-2 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 font-bold transition-colors flex items-center gap-1">
                            <i class="fas fa-times"></i> Reject
                        </button>
                        <button onclick="secureAdminAction('approve', '${id}')" 
                                class="px-4 py-2 text-xs bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 font-bold transition-colors flex items-center gap-1">
                            <i class="fas fa-check"></i> Approve
                        </button>
                    </div>
                `;
            } else {
                const processedBy = data.verifiedBy ? `by ${data.verifiedBy.split('@')[0]}` : '';
                actionsHTML = `
                    <div class="mt-3 pt-3 border-t border-gray-200 text-right">
                        <span class="text-xs font-bold text-gray-500">${data.status} ${processedBy}</span>
                    </div>
                `;
            }

            adminList.innerHTML += `
                <div class="bg-white p-4 rounded-xl shadow border border-gray-200 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="font-bold text-xl text-gray-800">₹${data.amount}</span>
                                <span class="text-xs px-2 py-1 rounded-full ${statusColor} font-bold uppercase">
                                    <i class="fas ${statusIcon} mr-1"></i> ${data.status}
                                </span>
                            </div>
                            
                            <div class="mb-2">
                                <div class="font-semibold text-primary">${data.userName}</div>
                                <div class="text-xs text-gray-600">${data.userEmail}</div>
                            </div>
                            
                            <div class="text-sm text-gray-700">
                                <span class="font-medium">${data.purpose}</span> 
                                <span class="text-gray-500">• ${data.method}</span>
                            </div>
                            
                            <div class="text-xs text-gray-500 font-mono mt-1">Ref: ${data.transactionId}</div>
                        </div>
                        
                        <div class="text-right ml-4">
                            <div class="text-xs text-gray-400 whitespace-nowrap">${date}</div>
                        </div>
                    </div>
                    ${actionsHTML}
                </div>
            `;
        });
    }, (error) => {
        console.error("Error loading transactions:", error);
        adminList.innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Failed to load transactions</p>
                <p class="text-sm mt-1">${error.message}</p>
            </div>
        `;
    });
}

async function performAdminAction(action, id, adminEmail) {
    const actionText = action === 'approve' ? 'APPROVE' : 'REJECT';
    const confirmText = action === 'approve' 
        ? `Approve this payment? This will mark it as successful.`
        : `Reject this payment? This will mark it as failed.`;
    
    if (!confirm(`🔒 ADMIN ACTION: ${actionText}\n\n${confirmText}`)) return;
    
    const newStatus = action === 'approve' ? 'Success' : 'Failed';
    
    try {
        await updateDoc(doc(db, "payments", id), {
            status: newStatus,
            verifiedBy: adminEmail,
            verifiedAt: new Date()
        });
        
        // Optional: Show success toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-lg z-[100] animate-fadeIn';
        toast.innerHTML = `
            <i class="fas fa-check-circle mr-2"></i>
            Payment ${newStatus.toLowerCase()} successfully
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
        
    } catch (error) {
        alert("❌ Action failed: " + error.message);
    }
}

// Add animation styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);
});