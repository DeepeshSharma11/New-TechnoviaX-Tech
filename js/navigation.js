/**
 * TechnoviaX - Global Navigation Loader
 * This script injects the header navigation into the page and sets the active link.
 * Fully responsive for all screen sizes including mobile view of desktop site.
 * Designed to work perfectly with loginfirebase.js
 */

(function() {
    const headerHTML = `
    <header class="bg-white shadow-sm fixed w-full top-0 z-50 transition-all duration-300" id="main-header">
        <div class="container mx-auto px-4">
            <nav class="flex justify-between items-center py-3 md:py-4">
                <!-- Logo -->
                <div class="logo flex-shrink-0 flex items-center gap-2">
                    <a href="/" class="text-xl md:text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                        <span class="hidden xs:inline">Technovia</span><span class="text-accent">TechnoviaX</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden lg:flex flex-1 justify-end xl:justify-center">
                    <ul class="nav-links flex items-center list-none gap-1 lg:gap-2 xl:gap-3 2xl:gap-4">
                        <li><a href="/" class="nav-item">Home</a></li>
                        <li><a href="/services.html" class="nav-item">Services</a></li>
                        <li><a href="/about.html" class="nav-item">About</a></li>
                        <li><a href="/portfolio.html" class="nav-item">Portfolio</a></li>
                        <li><a href="/testimonials.html" class="nav-item">Testimonials</a></li>
                        <li><a href="/helpdesk.html" class="nav-item">Helpdesk</a></li>
                        <li><a href="/careers.html" class="nav-item">Careers</a></li>
                        <li><a href="/contact.html" class="nav-item">Contact</a></li>
                        
                        <!-- Login/Auth Section - loginfirebase.js will inject here -->
                        <li id="nav-login-container" class="nav-login-container ml-2 lg:ml-4 xl:ml-6"></li>
                    </ul>
                </div>
                
                <!-- Tablet/Mobile Menu Button with Login -->
                <div class="flex items-center gap-2 lg:hidden">
                    <!-- Login Button for Tablet/Mobile (Visible only when not logged in) -->
                    <div id="mobile-login-container" class="mobile-login-container"></div>
                    
                    <!-- Menu Toggle Button -->
                    <button class="mobile-menu-btn p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 flex items-center justify-center" 
                            aria-label="Toggle navigation menu"
                            aria-expanded="false">
                        <svg class="w-6 h-6 text-gray-700 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            
            <!-- Tablet/Mobile Navigation Menu (Hidden by default) -->
            <div class="mobile-nav-container hidden lg:hidden bg-white border-t border-gray-100 mt-0 shadow-lg max-h-0 overflow-hidden transition-all duration-300 ease-in-out" id="mobile-nav-container">
                <div class="mobile-nav-content py-4 px-4">
                    <ul class="flex flex-col list-none gap-2">
                        <li><a href="/" class="mobile-nav-item">Home</a></li>
                        <li><a href="/services.html" class="mobile-nav-item">Services</a></li>
                        <li><a href="/about.html" class="mobile-nav-item">About</a></li>
                        <li><a href="/portfolio.html" class="mobile-nav-item">Portfolio</a></li>
                        <li><a href="/testimonials.html" class="mobile-nav-item">Testimonials</a></li>
                        <li><a href="/helpdesk.html" class="mobile-nav-item">Helpdesk</a></li>
                        <li><a href="/careers.html" class="mobile-nav-item">Careers</a></li>
                        <li><a href="/contact.html" class="mobile-nav-item">Contact</a></li>
                        <li class="pt-4 mt-4 border-t border-gray-200">
                            <!-- Mobile Login/Profile Area -->
                            <div id="mobile-full-login-container" class="mobile-full-login-container"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    
    <!-- Spacer for fixed header - Responsive height -->
    <div class="header-spacer h-16 md:h-18 lg:h-20"></div>
    `;

    // Function to inject header
    function injectHeader() {
        // Insert at the start of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        setActiveLink();
        setupMobileMenu();
        
        // Update header height for smooth scrolling
        updateHeaderHeight();
        
        // Add CSS for responsive navigation
        addResponsiveStyles();
        
        // Setup resize observer for better responsiveness
        setupResizeObserver();
        
        // Notify that navigation is ready for login injection
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigationReady'));
        }, 100);
    }

    // Add custom responsive styles
    function addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Base Navigation Styles */
            .nav-item {
                position: relative;
                padding: 0.375rem 0.75rem;
                font-size: 0.875rem;
                font-weight: 500;
                color: #4b5563;
                transition: all 0.2s ease;
                border-radius: 0.375rem;
                white-space: nowrap;
                display: inline-block;
            }
            
            .nav-item:hover {
                color: #1e40af;
                background-color: rgba(30, 64, 175, 0.05);
                transform: translateY(-1px);
            }
            
            .nav-item.active {
                color: #1e40af;
                font-weight: 600;
                background-color: rgba(30, 64, 175, 0.08);
            }
            
            .nav-item.active::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background-color: #1e40af;
                border-radius: 1px;
            }
            
            /* Navigation container for login button */
            .nav-login-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: fit-content;
            }
            
            /* Mobile Navigation Styles */
            .mobile-nav-item {
                display: block;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                color: #374151;
                border-radius: 0.5rem;
                transition: all 0.2s ease;
                border-left: 3px solid transparent;
            }
            
            .mobile-nav-item:hover {
                background-color: rgba(30, 64, 175, 0.05);
                transform: translateX(4px);
            }
            
            .mobile-nav-item.active {
                color: #1e40af;
                font-weight: 600;
                background-color: rgba(30, 64, 175, 0.1);
                border-left-color: #1e40af;
            }
            
            /* Mobile login container */
            .mobile-login-container {
                display: flex;
                align-items: center;
            }
            
            .mobile-full-login-container {
                width: 100%;
            }
            
            /* Responsive breakpoints */
            
            /* Extra Extra Small Devices (Mobile Portrait - Very Small) */
            @media (max-width: 359px) {
                .logo a span.hidden.xs\\:inline {
                    display: none;
                }
                
                .nav-links {
                    gap: 0.25rem !important;
                }
                
                .nav-item {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                }
                
                .nav-login-container {
                    margin-left: 0.5rem !important;
                }
            }
            
            /* Extra Small Devices (Mobile Portrait) */
            @media (min-width: 360px) and (max-width: 419px) {
                .nav-links {
                    gap: 0.25rem !important;
                }
                
                .nav-item {
                    padding: 0.375rem 0.5rem;
                    font-size: 0.75rem;
                }
            }
            
            /* Small Devices (Mobile Landscape) */
            @media (min-width: 420px) and (max-width: 639px) {
                .nav-links {
                    gap: 0.375rem !important;
                }
                
                .nav-item {
                    padding: 0.375rem 0.625rem;
                    font-size: 0.8125rem;
                }
            }
            
            /* Medium Devices (Tablet Portrait) */
            @media (min-width: 640px) and (max-width: 767px) {
                .nav-links {
                    gap: 0.5rem !important;
                }
                
                .nav-item {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                }
                
                .mobile-menu-btn {
                    padding: 0.5rem;
                }
            }
            
            /* Large Devices (Tablet Landscape) */
            @media (min-width: 768px) and (max-width: 1023px) {
                .nav-links {
                    gap: 0.625rem !important;
                }
                
                .nav-item {
                    padding: 0.5rem 0.875rem;
                    font-size: 0.875rem;
                }
                
                .mobile-menu-btn {
                    padding: 0.5rem;
                }
                
                .mobile-login-container {
                    margin-right: 0.5rem;
                }
            }
            
            /* Extra Large Devices (Desktop) */
            @media (min-width: 1024px) and (max-width: 1279px) {
                .nav-links {
                    gap: 0.75rem !important;
                }
                
                .nav-item {
                    padding: 0.5rem 1rem;
                    font-size: 0.9375rem;
                }
            }
            
            /* 2XL Devices (Large Desktop) */
            @media (min-width: 1280px) {
                .nav-links {
                    gap: 1rem !important;
                }
                
                .nav-item {
                    padding: 0.625rem 1.25rem;
                    font-size: 1rem;
                }
            }
            
            /* Mobile Menu Container Animation */
            .mobile-nav-container.open {
                max-height: 80vh;
                overflow-y: auto;
            }
            
            /* Mobile menu button animation */
            .mobile-menu-btn.active svg {
                transform: rotate(180deg);
            }
            
            /* Prevent horizontal scroll on mobile */
            body.mobile-menu-open {
                overflow: hidden;
                position: fixed;
                width: 100%;
            }
            
            /* Scrollbar styling for mobile menu */
            .mobile-nav-container::-webkit-scrollbar {
                width: 4px;
            }
            
            .mobile-nav-container::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            
            .mobile-nav-container::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 2px;
            }
            
            /* Touch-friendly targets */
            @media (max-width: 1024px) {
                .nav-item, 
                .mobile-nav-item,
                .mobile-menu-btn,
                .mobile-login-container a,
                .nav-login-container a {
                    min-height: 44px;
                    min-width: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .mobile-menu-btn {
                    width: 44px;
                    height: 44px;
                }
            }
            
            /* Adjust for landscape mode */
            @media (max-height: 500px) and (orientation: landscape) {
                .mobile-nav-container.open {
                    max-height: 60vh;
                }
            }
            
            /* Login button specific styles */
            .nav-login-container a,
            .mobile-login-container a,
            .mobile-full-login-container a {
                text-decoration: none !important;
                font-weight: 600;
            }
            
            /* Better spacing for login button in nav */
            .nav-login-container > * {
                margin: 0 2px;
            }
            
            /* Hide mobile login on very small screens */
            @media (max-width: 359px) {
                .mobile-login-container {
                    display: none !important;
                }
            }
            
            /* Ensure proper z-index for dropdowns */
            .nav-login-container .relative {
                z-index: 60;
            }
            
            /* Smooth transitions for login states */
            .nav-login-container > div,
            .mobile-login-container > div,
            .mobile-full-login-container > div {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Setup resize observer for responsive behavior
    function setupResizeObserver() {
        if ('ResizeObserver' in window) {
            const header = document.getElementById('main-header');
            const headerSpacer = document.querySelector('.header-spacer');
            
            if (header && headerSpacer) {
                const resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (entry.target === header) {
                            headerSpacer.style.height = `${entry.contentRect.height}px`;
                        }
                    }
                });
                
                resizeObserver.observe(header);
            }
        }
    }

    // Function to set active class based on current URL
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        // Desktop links
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (checkIfActive(linkHref, currentPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mobile links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
        mobileNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (checkIfActive(linkHref, currentPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Helper function to check if link is active
    function checkIfActive(linkHref, currentPath) {
        // Remove trailing slashes and .html for comparison
        const normalizePath = (path) => {
            return path.replace(/\/$/, '').replace('.html', '').toLowerCase();
        };
        
        const normalizedLink = normalizePath(linkHref);
        const normalizedCurrent = normalizePath(currentPath);
        
        // Handle index/home pages
        if ((normalizedLink === '' || normalizedLink === '/index' || normalizedLink === '/') && 
            (normalizedCurrent === '' || normalizedCurrent === '/index' || normalizedCurrent === '/')) {
            return true;
        }
        
        // Check exact match
        if (normalizedLink !== '' && normalizedCurrent === normalizedLink) {
            return true;
        }
        
        // Check if current path starts with link path (for nested pages)
        if (normalizedLink !== '' && normalizedLink !== '/' && 
            normalizedCurrent.startsWith(normalizedLink)) {
            return true;
        }
        
        return false;
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNavContainer = document.getElementById('mobile-nav-container');
        
        if (mobileMenuBtn && mobileNavContainer) {
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    // Close menu
                    closeMobileMenu();
                } else {
                    // Open menu
                    openMobileMenu();
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (mobileNavContainer.classList.contains('open') && 
                    !mobileNavContainer.contains(event.target) && 
                    !mobileMenuBtn.contains(event.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu when clicking on a link
            mobileNavContainer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    // Don't close if it's a login link (let it navigate)
                    if (!this.href.includes('login.html')) {
                        closeMobileMenu();
                    }
                });
            });
            
            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
            
            // Close on orientation change
            window.addEventListener('orientationchange', function() {
                setTimeout(closeMobileMenu, 300);
            });
            
            // Close on resize to desktop
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 1024 && mobileNavContainer.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
        }
        
        function openMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            
            if (mobileMenuBtn && mobileNavContainer) {
                // Update button state
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.classList.add('active', 'bg-gray-100');
                
                // Update icon
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                }
                
                // Open menu
                mobileNavContainer.classList.remove('hidden');
                setTimeout(() => {
                    mobileNavContainer.classList.add('open');
                }, 10);
                
                // Prevent body scroll
                document.body.classList.add('mobile-menu-open');
                
                // Dispatch event for login injection if needed
                window.dispatchEvent(new CustomEvent('mobileMenuOpened'));
            }
        }
        
        function closeMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            
            if (mobileMenuBtn && mobileNavContainer) {
                // Update button state
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active', 'bg-gray-100');
                
                // Update icon
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
                
                // Close menu
                mobileNavContainer.classList.remove('open');
                setTimeout(() => {
                    mobileNavContainer.classList.add('hidden');
                }, 300);
                
                // Allow body scroll
                document.body.classList.remove('mobile-menu-open');
            }
        }
        
        // Export close function for external use
        window.closeMobileMenu = closeMobileMenu;
    }

    // Function to update header height for spacing
    function updateHeaderHeight() {
        const headerSpacer = document.querySelector('.header-spacer');
        if (headerSpacer) {
            const header = document.getElementById('main-header');
            if (header) {
                const headerHeight = header.offsetHeight;
                headerSpacer.style.height = `${headerHeight}px`;
                
                // Also update CSS variable for smooth scrolling
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }
        }
    }

    // Function to handle window resize
    function handleResize() {
        updateHeaderHeight();
    }

    // Execute as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Event listeners for responsiveness
    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('load', function() {
        setTimeout(updateHeaderHeight, 100);
        setTimeout(updateHeaderHeight, 500); // After fonts load
    });

    // Debounce utility function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Export functions for external use
    window.Navigation = {
        updateHeaderHeight: updateHeaderHeight,
        setActiveLink: setActiveLink,
        closeMobileMenu: function() {
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            if (mobileNavContainer && mobileNavContainer.classList.contains('open')) {
                closeMobileMenu();
            }
        },
        getLoginContainers: function() {
            return {
                desktop: document.getElementById('nav-login-container'),
                mobileTop: document.getElementById('mobile-login-container'),
                mobileFull: document.getElementById('mobile-full-login-container')
            };
        },
        isMobileMenuOpen: function() {
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            return mobileNavContainer && mobileNavContainer.classList.contains('open');
        }
    };
    
    // Dispatch event when navigation is ready
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigationInjected'));
        }, 1000);
    });
})();