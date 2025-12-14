/**
 * TechnoviaX - Global Navigation Loader
 * This script injects the header navigation into the page and sets the active link.
 */

(function() {
    const headerHTML = `
    <header class="bg-white shadow-md fixed w-full top-0 z-40 transition-all duration-300" id="main-header">
        <div class="container mx-auto px-4">
            <nav class="flex justify-between items-center py-3 md:py-4">
                <!-- Logo -->
                <div class="logo flex items-center gap-2">
                    <a href="/" class="text-xl md:text-2xl font-bold text-primary hover:scale-105 transition-transform">
                        Technovia<span class="text-accent">X</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:block flex-1">
                    <ul class="nav-links flex items-center justify-end list-none gap-4 lg:gap-6 xl:gap-8">
                        <li><a href="/" class="nav-item">Home</a></li>
                        <li><a href="/services.html" class="nav-item">Services</a></li>
                        <li><a href="/about.html" class="nav-item">About</a></li>
                        <li><a href="/portfolio.html" class="nav-item">Portfolio</a></li>
                        <li><a href="/testimonials.html" class="nav-item">Testimonials</a></li>
                        <li><a href="/helpdesk.html" class="nav-item">Helpdesk</a></li>
                        <li><a href="/careers.html" class="nav-item">Careers</a></li>
                        <li><a href="/contact.html" class="nav-item">Contact</a></li>
                        
                        <!-- Spacer before login button -->
                        <li class="nav-spacer ml-4 mr-2">
                            <div class="w-px h-6 bg-gray-300"></div>
                        </li>
                        
                        <!-- Login Button Container - loginfirebase.js will inject here -->
                        <li id="nav-login-container" class="nav-login-container"></li>
                        
                        <!-- Spacer after login button -->
                        <li class="nav-spacer ml-2">
                            <div class="w-px h-6 bg-gray-300"></div>
                        </li>
                    </ul>
                </div>
                
                <!-- Mobile Menu Button -->
                <button class="md:hidden mobile-menu-btn p-2 rounded-lg hover:bg-gray-100 transition-colors ml-4" aria-label="Toggle navigation menu">
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </nav>
            
            <!-- Mobile Navigation Menu (Hidden by default) -->
            <div class="mobile-nav hidden md:hidden py-4 border-t border-gray-100 mt-2">
                <ul class="flex flex-col list-none gap-3">
                    <li><a href="/" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Home</a></li>
                    <li><a href="/services.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Services</a></li>
                    <li><a href="/about.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">About</a></li>
                    <li><a href="/portfolio.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Portfolio</a></li>
                    <li><a href="/testimonials.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Testimonials</a></li>
                    <li><a href="/helpdesk.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Helpdesk</a></li>
                    <li><a href="/careers.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Careers</a></li>
                    <li><a href="/contact.html" class="mobile-nav-item block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">Contact</a></li>
                    <li class="pt-4 border-t border-gray-100">
                        <div class="mobile-login-container px-4"></div>
                    </li>
                </ul>
            </div>
        </div>
    </header>
    
    <!-- Spacer for fixed header - DIFFERENT HEIGHT FOR MOBILE & DESKTOP -->
    <div class="header-spacer h-[64px] md:h-[80px] lg:h-[84px]"></div>
    `;

    // Function to inject header
    function injectHeader() {
        // Insert at the start of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        setActiveLink();
        setupMobileMenu();
        
        // Update header height for smooth scrolling
        updateHeaderHeight();
        
        // Add CSS for nav item spacing
        addNavStyles();
    }

    // Add custom styles for navigation spacing
    function addNavStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .nav-item {
                position: relative;
                padding: 0.5rem 0.75rem;
                font-size: 0.95rem;
                font-weight: 500;
                color: #374151;
                transition: all 0.2s ease;
                border-radius: 0.375rem;
                white-space: nowrap;
            }
            
            .nav-item:hover {
                color: #1e40af;
                background-color: rgba(30, 64, 175, 0.05);
            }
            
            .nav-item.active {
                color: #1e40af;
                font-weight: 600;
            }
            
            .nav-spacer {
                opacity: 0.5;
            }
            
            /* Desktop specific spacing */
            @media (min-width: 768px) {
                .nav-links {
                    gap: 0.75rem !important;
                }
                
                .nav-login-container {
                    margin-left: 0.5rem;
                }
            }
            
            /* Mobile adjustments */
            @media (max-width: 767px) {
                .mobile-nav-item {
                    font-size: 1rem;
                    padding: 0.875rem 1rem;
                }
                
                .mobile-login-container {
                    padding: 0.5rem 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to set active class based on current URL
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        // Desktop links
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            let isActive = checkIfActive(linkHref, currentPath);
            
            if (isActive) {
                link.classList.add('active');
                // Add active indicator
                const indicator = document.createElement('span');
                indicator.className = 'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full';
                indicator.style.bottom = '-4px';
                link.style.position = 'relative';
                link.appendChild(indicator);
            }
        });

        // Mobile links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
        mobileNavLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            let isActive = checkIfActive(linkHref, currentPath);
            
            if (isActive) {
                link.classList.add('active', 'bg-primary/10', 'text-primary', 'font-semibold');
                link.style.borderLeft = '4px solid #1e40af';
            }
        });
    }

    // Helper function to check if link is active
    function checkIfActive(linkHref, currentPath) {
        // Remove trailing slashes and .html for comparison
        const normalizePath = (path) => {
            return path.replace(/\/$/, '').replace('.html', '');
        };
        
        const normalizedLink = normalizePath(linkHref);
        const normalizedCurrent = normalizePath(currentPath);
        
        // Home page check
        if ((normalizedLink === '' || normalizedLink === '/index') && 
            (normalizedCurrent === '' || normalizedCurrent === '/index' || normalizedCurrent === '/')) {
            return true;
        }
        
        // Other pages check
        if (normalizedLink !== '' && normalizedCurrent === normalizedLink) {
            return true;
        }
        
        // Check for partial matches (for nested pages)
        if (normalizedLink !== '' && normalizedLink !== '/' && 
            normalizedCurrent.startsWith(normalizedLink)) {
            return true;
        }
        
        return false;
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (mobileMenuBtn && mobileNav) {
            // Toggle mobile menu
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileNav.classList.toggle('hidden');
                
                // Change icon based on state
                const icon = this.querySelector('svg');
                if (mobileNav.classList.contains('hidden')) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                    document.body.style.overflow = 'auto';
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                    document.body.style.overflow = 'hidden';
                    this.setAttribute('aria-expanded', 'true');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (mobileNav && !mobileNav.contains(event.target) && 
                    mobileMenuBtn && !mobileMenuBtn.contains(event.target) && 
                    !mobileNav.classList.contains('hidden')) {
                    mobileNav.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('svg');
                    if (icon) {
                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                    }
                    document.body.style.overflow = 'auto';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu when clicking on a link
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('svg');
                    if (icon) {
                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                    }
                    document.body.style.overflow = 'auto';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Close on Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileNav && !mobileNav.classList.contains('hidden')) {
                    mobileNav.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('svg');
                    if (icon) {
                        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                    }
                    document.body.style.overflow = 'auto';
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Function to update header height for spacing
    function updateHeaderHeight() {
        const headerSpacer = document.querySelector('.header-spacer');
        if (headerSpacer) {
            const header = document.getElementById('main-header');
            if (header) {
                const headerHeight = header.offsetHeight;
                headerSpacer.style.height = `${headerHeight}px`;
            }
        }
    }

    // Execute as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Update on window resize
    window.addEventListener('resize', function() {
        setTimeout(updateHeaderHeight, 100);
    });
    
    // Update after fonts load
    window.addEventListener('load', function() {
        setTimeout(updateHeaderHeight, 500);
    });
})();