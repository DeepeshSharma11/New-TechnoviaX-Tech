// Import from central Firebase config
import { auth, db } from "./loginfirebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    getDocs,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// DOM Elements
const lockScreen = document.getElementById('login-lock-screen');
const paymentContent = document.getElementById('payment-content');
const userNameInput = document.getElementById('user-name');
const userEmailInput = document.getElementById('user-email');
const paymentForm = document.getElementById('payment-form');
const historyList = document.getElementById('history-list');
const historyLoading = document.getElementById('history-loading');
const historyEmpty = document.getElementById('history-empty');
const amountInput = document.getElementById('amount');
const upiQr = document.getElementById('upi-qr');
const refreshHistoryBtn = document.getElementById('refresh-history');

// Constants
const UPI_ID = "technoviaxtech@ybl";
const BASE_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=TechnoviaX%20Tech&cu=INR`;

// Initialize QR Code
if (upiQr) {
    upiQr.src = BASE_QR_URL;
}

// Update QR when amount changes
if (amountInput && upiQr) {
    amountInput.addEventListener('input', (e) => {
        const amt = e.target.value;
        const url = amt ? `${BASE_QR_URL}&am=${amt}` : BASE_QR_URL;
        upiQr.src = url;
    });
}

// Toggle Payment Methods
const methodRadios = document.querySelectorAll('input[name="method"]');
const upiSection = document.getElementById('upi-section');
const bankSection = document.getElementById('bank-section');
const cardSection = document.getElementById('card-section');

methodRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        upiSection.classList.add('hidden');
        bankSection.classList.add('hidden');
        cardSection.classList.add('hidden');
        
        if (e.target.value === 'upi') upiSection.classList.remove('hidden');
        if (e.target.value === 'bank') bankSection.classList.remove('hidden');
        if (e.target.value === 'card') cardSection.classList.remove('hidden');
    });
});

// Auth State Monitor
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        lockScreen.classList.add('hidden');
        paymentContent.classList.remove('opacity-30', 'pointer-events-none');
        userNameInput.value = user.displayName || 'Valued Client';
        userEmailInput.value = user.email;
        
        // Load user's payment history (one-time fetch for cost efficiency)
        loadPaymentHistory(user.uid);
    } else {
        // User is logged out
        lockScreen.classList.remove('hidden');
        paymentContent.classList.add('opacity-30', 'pointer-events-none');
        historyList.innerHTML = '';
        historyLoading.classList.add('hidden');
        historyEmpty.classList.remove('hidden');
    }
});

// Load User Payment History (One-time fetch instead of real-time)
async function loadPaymentHistory(userId) {
    if (!userId) return;
    
    historyLoading.classList.remove('hidden');
    historyEmpty.classList.add('hidden');
    
    try {
        const q = query(
            collection(db, "payments"), 
            where("userId", "==", userId), 
            orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        historyLoading.classList.add('hidden');
        
        if (querySnapshot.empty) {
            historyEmpty.classList.remove('hidden');
            historyList.innerHTML = '';
            return;
        }
        
        historyEmpty.classList.add('hidden');
        historyList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) : 'Recently';
            
            const statusClass = data.status === 'Success' ? 'status-success' : 
                              (data.status === 'Failed' ? 'status-failed' : 'status-pending');
            
            const icon = data.status === 'Success' ? 'fa-check-circle' : 
                        (data.status === 'Failed' ? 'fa-times-circle' : 'fa-clock');
            
            const statusColor = data.status === 'Success' ? 'bg-green-100 text-success' : 
                              (data.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600');
            
            historyList.innerHTML += `
                <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-bold text-secondary text-lg">₹${data.amount}</span>
                                <span class="status-badge ${statusClass}">${data.status}</span>
                            </div>
                            <p class="text-sm text-gray-600">${data.purpose}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-xs text-gray-500">${date}</span>
                                <span class="text-xs text-gray-400">•</span>
                                <span class="text-xs text-gray-500 capitalize">${data.method}</span>
                            </div>
                            <p class="text-xs text-gray-400 font-mono mt-1">Ref: ${data.transactionId}</p>
                        </div>
                        <div class="text-right">
                            <div class="w-10 h-10 rounded-full ${statusColor} flex items-center justify-center">
                                <i class="fas ${icon}"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading payment history:", error);
        historyLoading.classList.add('hidden');
        historyList.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <i class="fas fa-exclamation-triangle text-xl mb-2"></i>
                <p class="text-sm">Unable to load payment history</p>
                <p class="text-xs mt-1">Please try again later</p>
            </div>
        `;
    }
}

// Refresh History Button
if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            loadPaymentHistory(user.uid);
            // Add visual feedback
            refreshHistoryBtn.classList.add('animate-spin');
            setTimeout(() => {
                refreshHistoryBtn.classList.remove('animate-spin');
            }, 500);
        }
    });
}

// Submit Payment Form
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) {
            alert("Please log in to submit a payment.");
            return;
        }
        
        const submitBtn = document.getElementById('submit-payment');
        const originalBtnText = submitBtn.innerHTML;
        
        // Get form values
        const amount = document.getElementById('amount').value;
        const purpose = document.getElementById('purpose').value;
        const transactionId = document.getElementById('transaction-id').value;
        const method = document.querySelector('input[name="method"]:checked').value;
        
        // Validation
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        
        if (!transactionId.trim()) {
            alert("Please enter a transaction reference ID.");
            return;
        }
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            // Add payment to Firestore
            await addDoc(collection(db, "payments"), {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || "User",
                amount: amount,
                purpose: purpose,
                transactionId: transactionId,
                method: method,
                status: "Pending Verification",
                createdAt: serverTimestamp()
            });
            
            // Success message
            alert("✅ Payment submitted successfully!\n\nYour payment is now pending admin verification. You'll receive an email confirmation once approved.");
            
            // Reset form
            paymentForm.reset();
            
            // Reset QR to default
            if (upiQr) {
                upiQr.src = BASE_QR_URL;
            }
            
            // Reload history
            loadPaymentHistory(user.uid);
            
        } catch (error) {
            console.error("Error submitting payment:", error);
            alert("❌ Error submitting payment: " + error.message);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're already logged in
    if (auth.currentUser) {
        const user = auth.currentUser;
        userNameInput.value = user.displayName || 'Valued Client';
        userEmailInput.value = user.email;
        loadPaymentHistory(user.uid);
    }
    
    // Add loading spinner style
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #1e40af;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});