document.addEventListener("DOMContentLoaded", function () {
  // 1. Pehle check karein ki kya user ne is session mein popup dekh liya hai?
  if (sessionStorage.getItem('quotePopupSeen')) {
      return; 
  }

  // 2. Modal HTML Template
  // Added: id="quote-form", access_key, id="quote-status", id="quote-submit-btn"
  const modalHTML = `
      <div id="quoteModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 opacity-0 invisible transition-all duration-300">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onclick="closeQuoteModal()"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-90 transition-transform duration-300" id="modalCard">
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-white relative">
                  <button onclick="closeQuoteModal()" class="absolute top-4 right-4 text-white/80 hover:text-white transition">
                      <i class="fas fa-times text-xl"></i>
                  </button>
                  <h2 class="text-2xl font-bold mb-1">Get Your Free Quote</h2>
                  <p class="text-blue-100 text-sm">Grow your business with TechnoviaX.</p>
              </div>

              <!-- Form -->
              <div class="p-6">
                  <form id="quote-form" onsubmit="handleQuoteSubmit(event)" class="space-y-4">
                      <!-- Required for Web3Forms -->
                      <input type="hidden" name="access_key" value="27443247-267a-43b2-9dfc-0b2a5f55713e">
                      <input type="hidden" name="subject" value="New Quote Request from Popup">
                      
                      <!-- Status Message Area -->
                      <div id="quote-status" class="hidden mb-4 text-sm font-medium text-center rounded p-3"></div>

                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none" placeholder="Enter your name">
                      </div>
                      
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none" placeholder="Enter your email">
                      </div>

                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                          <select name="service" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none bg-white">
                              <option value="Web Development">Web Development</option>
                              <option value="App Development">App Development</option>
                              <option value="Digital Marketing">Digital Marketing</option>
                              <option value="Other">Other</option>
                          </select>
                      </div>
                      
                      <button type="submit" id="quote-submit-btn" class="w-full bg-blue-800 text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition shadow-lg">
                          Request Quote Now
                      </button>
                  </form>
              </div>
          </div>
      </div>
  `;

  // 3. HTML ko Body mein inject karna
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 4. FormHandler Integration Logic
  // Wait briefly for forms.js to initialize
  setTimeout(() => {
    if (window.formHandler) {
        const form = document.getElementById('quote-form');
        const status = document.getElementById('quote-status');
        const submitBtn = document.getElementById('quote-submit-btn');

        if (form && status && submitBtn) {
            // Register form with the existing FormHandler
            window.formHandler.forms.set('quote', {
                element: form,
                status: status,
                submitBtn: submitBtn
            });

            // Override default submit to use FormHandler
            form.onsubmit = null; // Clear inline handler
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                window.formHandler.handleFormSubmit('quote').then(() => {
                    // Check if success (FormHandler adds specific class or hides form)
                    // If successful, close modal after 3 seconds
                    // We check if the status contains success styling class from forms.js
                    if (status.classList.contains('form-status-success')) {
                        setTimeout(closeQuoteModal, 3000);
                    }
                });
            });
        }
    }
  }, 200);

  // 5. Popup ko show karne ka logic (Delay ke sath)
  setTimeout(() => {
      const modal = document.getElementById('quoteModal');
      const card = document.getElementById('modalCard');
      
      if(modal && card) {
          modal.classList.remove('opacity-0', 'invisible');
          modal.classList.add('opacity-100', 'visible');
          card.classList.remove('scale-90');
          card.classList.add('scale-100');
          
          document.body.style.overflow = 'hidden';
      }
  }, 1000);
});

// --- Helper Functions (Global Scope) ---

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  const card = document.getElementById('modalCard');
  
  if(modal && card) {
      modal.classList.add('opacity-0', 'invisible');
      modal.classList.remove('opacity-100', 'visible');
      card.classList.add('scale-90');
      card.classList.remove('scale-100');
      
      document.body.style.overflow = 'auto';
      
      sessionStorage.setItem('quotePopupSeen', 'true');
  }
}

// Fallback function in case forms.js is not loaded
function handleQuoteSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const status = document.getElementById('quote-status');
  
  // Basic loading state
  btn.innerText = 'Sending...';
  btn.disabled = true;
  
  if(status) {
    status.className = 'block mb-4 text-sm font-medium text-center rounded p-3 bg-blue-50 text-blue-700';
    status.innerText = 'Sending...';
  }
  
  // Submit to Web3Forms directly if FormHandler missing
  const formData = new FormData(e.target);
  
  fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          if(status) {
            status.className = 'block mb-4 text-sm font-medium text-center rounded p-3 bg-green-50 text-green-700';
            status.innerText = 'Sent Successfully!';
          }
          btn.innerText = 'Success!';
          setTimeout(closeQuoteModal, 2000);
      } else {
          throw new Error('Submission failed');
      }
  })
  .catch(error => {
      if(status) {
        status.className = 'block mb-4 text-sm font-medium text-center rounded p-3 bg-red-50 text-red-700';
        status.innerText = 'Error sending message.';
      }
      btn.innerText = 'Try Again';
      btn.disabled = false;
  });
}