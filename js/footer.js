// footer.js - Dynamic Footer Loader
(function() {
    'use strict';
    
    // Using Tailwind classes directly instead of custom .footer-gradient
    const footerHTML = `
    <footer class="bg-gradient-to-br from-secondary to-dark text-white py-12 sm:py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
                <div>
                    <div class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                        Technovia<span class="text-accent">X</span> <span class="text-primary-light">Tech</span>
                    </div>
                    <p class="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                        Leading IT solutions provider delivering innovative technology services for businesses worldwide.
                    </p>
                    <div class="flex gap-3">
                        <a href="#" class="social-icon text-white hover:text-blue-500 transition-colors text-lg" aria-label="Facebook">
                            <i class="fab fa-facebook"></i>
                        </a>
                        <a href="#" class="social-icon text-white hover:text-blue-400 transition-colors text-lg" aria-label="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-icon text-white hover:text-blue-600 transition-colors text-lg" aria-label="LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="https://www.instagram.com/ur_x_deepesh21/" class="social-icon text-white hover:text-pink-500 transition-colors text-lg" aria-label="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-5 pb-2 border-b border-gray-700">Quick Links</h3>
                    <ul class="space-y-2 sm:space-y-3">
                        <li><a href="/" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-home text-xs"></i> Home</a></li>
                        <li><a href="/services.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-cogs text-xs"></i> Services</a></li>
                        <li><a href="/about.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-info-circle text-xs"></i> About</a></li>
                        <li><a href="/portfolio.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-briefcase text-xs"></i> Portfolio</a></li>
                        <li><a href="/careers.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-user-tie text-xs"></i> Careers</a></li>
                         <li><a href="/payment.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-user-tie text-xs"></i> Secure Payment</a></li>
                        <!-- ID used by loginfirebase.js to inject user name -->
                        <li id="footer-login-item"><a href="/login.html" class="text-gray-300 hover:text-accent transition-colors text-sm sm:text-base flex items-center gap-2"><i class="fas fa-sign-in-alt text-xs"></i> Login</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-5 pb-2 border-b border-gray-700">Services</h3>
                    <ul class="space-y-2 sm:space-y-3">
                        <li><a href="/services.html#web-development" class="text-gray-300 hover:text-primary-light transition-colors text-sm sm:text-base"><i class="fas fa-chevron-right text-xs mr-2"></i> Web Development</a></li>
                        <li><a href="/services.html#app-development" class="text-gray-300 hover:text-primary-light transition-colors text-sm sm:text-base"><i class="fas fa-chevron-right text-xs mr-2"></i> App Development</a></li>
                        <li><a href="/services.html#cloud-solutions" class="text-gray-300 hover:text-primary-light transition-colors text-sm sm:text-base"><i class="fas fa-chevron-right text-xs mr-2"></i> Cloud Solutions</a></li>
                        <li><a href="/services.html#digital-marketing" class="text-gray-300 hover:text-primary-light transition-colors text-sm sm:text-base"><i class="fas fa-chevron-right text-xs mr-2"></i> Digital Marketing</a></li>
                        <li><a href="/services.html#cybersecurity" class="text-gray-300 hover:text-primary-light transition-colors text-sm sm:text-base"><i class="fas fa-chevron-right text-xs mr-2"></i> Cybersecurity</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-5 pb-2 border-b border-gray-700">Contact Info</h3>
                    <ul class="space-y-3 sm:space-y-4">
                        <li class="text-gray-300 text-sm sm:text-base flex items-start">
                            <i class="fas fa-map-marker-alt mr-3 text-accent mt-1"></i>
                            <span>Tech Street, Bareilly, Uttar Pradesh, India</span>
                        </li>
                        <li class="text-gray-300 text-sm sm:text-base flex items-center">
                            <i class="fas fa-phone mr-3 text-accent"></i>
                            <span>+91 8433125736</span>
                        </li>
                        <li class="text-gray-300 text-sm sm:text-base flex items-center">
                            <i class="fas fa-envelope mr-3 text-accent"></i>
                            <span>info.technoviax@gmail.com</span>
                        </li>
                        <li class="text-gray-300 text-sm sm:text-base flex items-center">
                            <i class="fab fa-whatsapp mr-3 text-accent"></i>
                            <span>+91 8433125736</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="text-center pt-6 sm:pt-8 border-t border-gray-700">
                <p class="text-gray-400 text-sm sm:text-base">
                    &copy; <span id="current-year">2023</span> TechnoviaX Tech. All Rights Reserved.
                </p>
                <div class="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
                    <a href="/privacy.html" class="text-gray-400 hover:text-accent transition-colors text-xs sm:text-sm">
                        <i class="fas fa-shield-alt mr-1"></i> Privacy Policy
                    </a>
                    <a href="/disclaimer.html" class="text-gray-400 hover:text-accent transition-colors text-xs sm:text-sm">
                        <i class="fas fa-exclamation-triangle mr-1"></i> Disclaimer
                    </a>
                    <a href="/terms.html" class="text-gray-400 hover:text-accent transition-colors text-xs sm:text-sm">
                        <i class="fas fa-file-contract mr-1"></i> Terms & Conditions
                    </a>
                </div>
            </div>
        </div>
    </footer>
    `;
    
    function injectFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
            
            // Update copyright year
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
            
            // Dispatch event to notify listeners (like loginfirebase.js) that footer is ready
            window.dispatchEvent(new CustomEvent('footerInjected'));
            
        } else {
            // Retry if container not found
            setTimeout(injectFooter, 50);
        }
    }
    
    // Inject footer when DOM is ready or if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
    
    // Export function for manual injection if needed
    window.Footer = {
        inject: injectFooter,
        updateYear: function() {
            const yearElement = document.getElementById('current-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        }
    };
})();