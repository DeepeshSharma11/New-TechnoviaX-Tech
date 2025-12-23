document.addEventListener("DOMContentLoaded", function () {
  // 1. Pehle check karein ki kya user ne is session mein popup dekh liya hai?
  // Agar aap chahte hain ki har page refresh par aaye, to if condition hata dein.
  if (sessionStorage.getItem('quotePopupSeen')) {
      return; // Agar pehle dekh chuka hai, to wapas mat dikhao
  }

  // 2. Modal HTML Template
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
                  <form onsubmit="handleQuoteSubmit(event)" class="space-y-4">
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none" placeholder="Enter your name">
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Service</label>
                          <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none bg-white">
                              <option>Web Development</option>
                              <option>App Development</option>
                              <option>Digital Marketing</option>
                          </select>
                      </div>
                      <button type="submit" class="w-full bg-blue-800 text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition shadow-lg">
                          Request Quote Now
                      </button>
                  </form>
              </div>
          </div>
      </div>
  `;

  // 3. HTML ko Body mein inject karna
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 4. Popup ko show karne ka logic (Delay ke sath)
  setTimeout(() => {
      const modal = document.getElementById('quoteModal');
      const card = document.getElementById('modalCard');
      
      if(modal && card) {
          modal.classList.remove('opacity-0', 'invisible');
          modal.classList.add('opacity-100', 'visible');
          card.classList.remove('scale-90');
          card.classList.add('scale-100');
          
          // Body scroll band karna jab popup khula ho
          document.body.style.overflow = 'hidden';
      }
  }, 1000); // 1 Second delay
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
      
      // Session Storage set karein taki user ko dobara popup na dikhe jab tak wo tab band karke wapas na aaye
      sessionStorage.setItem('quotePopupSeen', 'true');
  }
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = 'Sending...';
  
  // Fake server delay simulation
  setTimeout(() => {
      btn.innerText = 'Sent Successfully!';
      btn.classList.add('bg-green-600');
      setTimeout(() => {
          closeQuoteModal();
      }, 1000);
  }, 1500);
}