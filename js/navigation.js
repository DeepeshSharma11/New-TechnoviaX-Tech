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
                <div class="logo flex-shrink-0">
                    <a href="/" class="text-xl md:text-2xl font-bold text-primary hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                        <span class="hidden xs:inline">Technovia</span><span class="text-accent">X</span>
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
                
                <!-- Tablet/Mobile Menu Button -->
                <div class="flex items-center gap-2 lg:hidden">
                    <!-- Login Button for Tablet/Mobile -->
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
            
            <!-- Tablet/Mobile Navigation Menu -->
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
    
    <!-- Spacer for fixed header -->
    <div class="header-spacer h-16 md:h-18 lg:h-20"></div>
    `;

    // Function to inject header
    function injectHeader() {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        setActiveLink();
        setupMobileMenu();
        updateHeaderHeight();
        addResponsiveStyles();
        setupResizeObserver();
        
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigationReady'));
        }, 100);
    }

    // Add custom responsive styles
    function addResponsiveStyles() {
        const style = document.createElement('style');
        style.textContent = `.nav-item{position:relative;padding:.375rem .75rem;font-size:.875rem;font-weight:500;color:#4b5563;transition:all .2s ease;border-radius:.375rem;white-space:nowrap;display:inline-block}.nav-item:hover{color:#1e40af;background-color:rgba(30,64,175,.05);transform:translateY(-1px)}.nav-item.active{color:#1e40af;font-weight:600;background-color:rgba(30,64,175,.08)}.nav-item.active::after{content:'';position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:20px;height:2px;background-color:#1e40af;border-radius:1px}.nav-login-container{display:flex;align-items:center;justify-content:center;min-width:fit-content}.mobile-nav-item{display:block;padding:.75rem 1rem;font-size:1rem;color:#374151;border-radius:.5rem;transition:all .2s ease;border-left:3px solid transparent}.mobile-nav-item:hover{background-color:rgba(30,64,175,.05);transform:translateX(4px)}.mobile-nav-item.active{color:#1e40af;font-weight:600;background-color:rgba(30,64,175,.1);border-left-color:#1e40af}.mobile-login-container{display:flex;align-items:center}.mobile-full-login-container{width:100%}@media (max-width:359px){.logo a span.hidden.xs\\:inline{display:none}.nav-links{gap:.25rem!important}.nav-item{padding:.25rem .5rem;font-size:.75rem}.nav-login-container{margin-left:.5rem!important}}@media (min-width:360px) and (max-width:419px){.nav-links{gap:.25rem!important}.nav-item{padding:.375rem .5rem;font-size:.75rem}}@media (min-width:420px) and (max-width:639px){.nav-links{gap:.375rem!important}.nav-item{padding:.375rem .625rem;font-size:.8125rem}}@media (min-width:640px) and (max-width:767px){.nav-links{gap:.5rem!important}.nav-item{padding:.5rem .75rem;font-size:.875rem}.mobile-menu-btn{padding:.5rem}}@media (min-width:768px) and (max-width:1023px){.nav-links{gap:.625rem!important}.nav-item{padding:.5rem .875rem;font-size:.875rem}.mobile-menu-btn{padding:.5rem}.mobile-login-container{margin-right:.5rem}}@media (min-width:1024px) and (max-width:1279px){.nav-links{gap:.75rem!important}.nav-item{padding:.5rem 1rem;font-size:.9375rem}}@media (min-width:1280px){.nav-links{gap:1rem!important}.nav-item{padding:.625rem 1.25rem;font-size:1rem}}.mobile-nav-container.open{max-height:80vh;overflow-y:auto}.mobile-menu-btn.active svg{transform:rotate(180deg)}body.mobile-menu-open{overflow:hidden;position:fixed;width:100%}.mobile-nav-container::-webkit-scrollbar{width:4px}.mobile-nav-container::-webkit-scrollbar-track{background:#f1f5f9}.mobile-nav-container::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px}@media (max-width:1024px){.nav-item,.mobile-nav-item,.mobile-menu-btn,.mobile-login-container a,.nav-login-container a{min-height:44px;min-width:44px;display:flex;align-items:center;justify-content:center}.mobile-menu-btn{width:44px;height:44px}}@media (max-height:500px) and (orientation:landscape){.mobile-nav-container.open{max-height:60vh}}.nav-login-container a,.mobile-login-container a,.mobile-full-login-container a{text-decoration:none!important;font-weight:600}.nav-login-container>*{margin:0 2px}@media (max-width:359px){.mobile-login-container{display:none!important}}.nav-login-container .relative{z-index:60}.nav-login-container>div,.mobile-login-container>div,.mobile-full-login-container>div{transition:opacity .3s ease,transform .3s ease}`;
        document.head.appendChild(style);
    }

    // Setup resize observer
    function setupResizeObserver() {
        if ('ResizeObserver' in window) {
            const header = document.getElementById('main-header');
            const headerSpacer = document.querySelector('.header-spacer');
            if (header && headerSpacer) {
                new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (entry.target === header) {
                            headerSpacer.style.height = `${entry.contentRect.height}px`;
                        }
                    }
                }).observe(header);
            }
        }
    }

    // Function to set active class
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        // Desktop links
        document.querySelectorAll('.nav-item').forEach(link => {
            const linkHref = link.getAttribute('href');
            link.classList.toggle('active', checkIfActive(linkHref, currentPath));
        });

        // Mobile links
        document.querySelectorAll('.mobile-nav-item').forEach(link => {
            const linkHref = link.getAttribute('href');
            link.classList.toggle('active', checkIfActive(linkHref, currentPath));
        });
    }

    // Helper function to check if link is active
    function checkIfActive(linkHref, currentPath) {
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
        
        // Check if current path starts with link path
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
            mobileMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.getAttribute('aria-expanded') === 'true' ? closeMobileMenu() : openMobileMenu();
            });

            document.addEventListener('click', function(event) {
                if (mobileNavContainer.classList.contains('open') && 
                    !mobileNavContainer.contains(event.target) && 
                    !mobileMenuBtn.contains(event.target)) {
                    closeMobileMenu();
                }
            });

            mobileNavContainer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    if (!this.href.includes('login.html')) {
                        closeMobileMenu();
                    }
                });
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) {
                    closeMobileMenu();
                }
            });
            
            window.addEventListener('orientationchange', () => setTimeout(closeMobileMenu, 300));
            
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
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.classList.add('active', 'bg-gray-100');
                
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                
                mobileNavContainer.classList.remove('hidden');
                setTimeout(() => mobileNavContainer.classList.add('open'), 10);
                document.body.classList.add('mobile-menu-open');
                window.dispatchEvent(new CustomEvent('mobileMenuOpened'));
            }
        }
        
        function closeMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            
            if (mobileMenuBtn && mobileNavContainer) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active', 'bg-gray-100');
                
                const icon = mobileMenuBtn.querySelector('svg');
                if (icon) icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                
                mobileNavContainer.classList.remove('open');
                setTimeout(() => mobileNavContainer.classList.add('hidden'), 300);
                document.body.classList.remove('mobile-menu-open');
            }
        }
        
        window.closeMobileMenu = closeMobileMenu;
    }

    // Function to update header height
    function updateHeaderHeight() {
        const headerSpacer = document.querySelector('.header-spacer');
        if (headerSpacer) {
            const header = document.getElementById('main-header');
            if (header) {
                const headerHeight = header.offsetHeight;
                headerSpacer.style.height = `${headerHeight}px`;
                document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
            }
        }
    }

    // Execute as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Event listeners
    window.addEventListener('resize', debounce(updateHeaderHeight, 250));
    window.addEventListener('load', () => {
        setTimeout(updateHeaderHeight, 100);
        setTimeout(updateHeaderHeight, 500);
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
    
    // Export functions
    window.Navigation = {
        updateHeaderHeight: updateHeaderHeight,
        setActiveLink: setActiveLink,
        closeMobileMenu: () => {
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            if (mobileNavContainer && mobileNavContainer.classList.contains('open')) {
                closeMobileMenu();
            }
        },
        getLoginContainers: () => ({
            desktop: document.getElementById('nav-login-container'),
            mobileTop: document.getElementById('mobile-login-container'),
            mobileFull: document.getElementById('mobile-full-login-container')
        }),
        isMobileMenuOpen: () => {
            const mobileNavContainer = document.getElementById('mobile-nav-container');
            return mobileNavContainer && mobileNavContainer.classList.contains('open');
        }
    };
    
    // Dispatch event when navigation is ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.dispatchEvent(new CustomEvent('navigationInjected')), 1000);
    });
})();