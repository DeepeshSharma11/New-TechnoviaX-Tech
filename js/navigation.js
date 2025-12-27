/**
 * TechnoviaX - Global Navigation Loader
 * Optimized for performance and smooth animations.
 */

(function() {
    'use strict'; // Enable strict mode for better performance

    // Cache DOM queries where possible
    let header, mobileMenuBtn, mobileNavContainer;

    const headerHTML = `
    <header class="fixed w-full top-0 z-[999] transition-all duration-300 nav-glass" id="main-header">
        <div class="container mx-auto px-4">
            <nav class="flex justify-between items-center py-3 md:py-4">
                <!-- Logo -->
                <div class="logo flex-shrink-0">
                    <a href="index.html" class="text-xl md:text-2xl font-bold text-white hover:scale-105 transition-transform duration-300 whitespace-nowrap" style="text-shadow: 0 0 15px rgba(16, 185, 129, 0.4);">
                        <span class="hidden xs:inline">Technovia</span><span class="text-emerald-400">X</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="hidden lg:flex flex-1 justify-end xl:justify-center">
                    <ul class="nav-links flex items-center list-none gap-1 lg:gap-2 xl:gap-3 2xl:gap-4">
                        <li><a href="index.html" class="nav-item">Home</a></li>
                        <li><a href="services.html" class="nav-item">Services</a></li>
                        <li><a href="about.html" class="nav-item">About</a></li>
                        <li><a href="portfolio.html" class="nav-item">Portfolio</a></li>
                        <li><a href="testimonials.html" class="nav-item">Testimonials</a></li>
                        <li><a href="helpdesk.html" class="nav-item">Helpdesk</a></li>
                        <li><a href="careers.html" class="nav-item">Careers</a></li>
                        <li><a href="contact.html" class="nav-item">Contact</a></li>
                        
                        <!-- Login/Auth Section -->
                        <li id="nav-login-container" class="nav-login-container ml-2 lg:ml-4 xl:ml-6"></li>
                    </ul>
                </div>
                
                <!-- Tablet/Mobile Menu Button -->
                <div class="flex items-center gap-2 lg:hidden">
                    <!-- Login Button for Tablet/Mobile -->
                    <div id="mobile-login-container" class="mobile-login-container"></div>
                    
                    <!-- Menu Toggle Button -->
                    <button id="mobile-menu-trigger" class="mobile-menu-btn p-2 rounded-lg text-emerald-100 hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-all duration-200 flex items-center justify-center focus:outline-none" 
                            aria-label="Toggle navigation menu"
                            aria-expanded="false">
                        <svg class="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path class="menu-icon-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            
            <!-- Tablet/Mobile Navigation Menu -->
            <div id="mobile-nav-container" class="mobile-nav-container hidden lg:hidden border-t border-emerald-500/20 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
                <div class="mobile-nav-content py-4 px-4">
                    <ul class="flex flex-col list-none gap-2">
                        <li><a href="index.html" class="mobile-nav-item">Home</a></li>
                        <li><a href="services.html" class="mobile-nav-item">Services</a></li>
                        <li><a href="about.html" class="mobile-nav-item">About</a></li>
                        <li><a href="portfolio.html" class="mobile-nav-item">Portfolio</a></li>
                        <li><a href="testimonials.html" class="mobile-nav-item">Testimonials</a></li>
                        <li><a href="helpdesk.html" class="mobile-nav-item">Helpdesk</a></li>
                        <li><a href="careers.html" class="mobile-nav-item">Careers</a></li>
                        <li><a href="contact.html" class="mobile-nav-item">Contact</a></li>
                        <li class="pt-4 mt-4 border-t border-emerald-500/20">
                            <!-- Mobile Login/Profile Area -->
                            <div id="mobile-full-login-container" class="mobile-full-login-container"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <div class="header-spacer h-16 md:h-18 lg:h-20"></div>
    `;

    function injectHeader() {
        // Inject Styles first to prevent FOUC
        addResponsiveStyles();

        const placeholder = document.getElementById('nav-placeholder');
        if (placeholder) {
            placeholder.outerHTML = headerHTML;
        } else if (!document.getElementById('main-header')) {
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // Initialize DOM elements
        header = document.getElementById('main-header');
        mobileMenuBtn = document.getElementById('mobile-menu-trigger');
        mobileNavContainer = document.getElementById('mobile-nav-container');

        // Defer non-critical initializations slightly to prioritize main thread
        requestAnimationFrame(() => {
            setActiveLink();
            setupMobileMenu();
            updateHeaderHeight();
            setupResizeObserver();
            window.dispatchEvent(new CustomEvent('navigationReady'));
        });
    }

    function addResponsiveStyles() {
        if (document.getElementById('nav-custom-styles')) return;

        const style = document.createElement('style');
        style.id = 'nav-custom-styles';
        style.textContent = `
            .nav-glass {
                background: rgba(2, 6, 23, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border-bottom: 1px solid rgba(16, 185, 129, 0.15);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                will-change: transform, background-color;
            }
            .nav-item {
                position: relative;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                font-weight: 500;
                color: #e2e8f0;
                transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
                border-radius: 0.5rem;
                white-space: nowrap;
                display: inline-block;
            }
            .nav-item:hover {
                color: #34d399;
                background-color: rgba(16, 185, 129, 0.1);
                transform: translateY(-1px);
            }
            .nav-item.active {
                color: #34d399;
                font-weight: 600;
                background-color: rgba(16, 185, 129, 0.15);
            }
            .mobile-nav-container {
                background: rgba(2, 6, 23, 0.98);
                backdrop-filter: blur(16px);
                max-height: 0;
                opacity: 0;
                visibility: hidden;
                will-change: max-height, opacity;
            }
            .mobile-nav-container.open {
                max-height: 85vh !important;
                opacity: 1 !important;
                visibility: visible !important;
                overflow-y: auto;
            }
            .mobile-nav-item {
                display: block;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                color: #cbd5e1;
                border-radius: 0.5rem;
                transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                border-left: 3px solid transparent;
            }
            .mobile-nav-item:hover {
                background-color: rgba(16, 185, 129, 0.1);
                color: #34d399;
                transform: translateX(4px);
            }
            .mobile-nav-item.active {
                color: #34d399;
                font-weight: 600;
                background-color: rgba(16, 185, 129, 0.15);
                border-left-color: #34d399;
            }
            .nav-login-container, .mobile-login-container { display: flex; align-items: center; justify-content: center; }
            .nav-login-container a, .mobile-login-container a { text-decoration: none !important; font-weight: 600; }
            @media (max-width: 359px) {
                .logo a span.hidden.xs\\:inline { display: none; }
                .nav-links { gap: 0.25rem !important; }
            }
        `;
        document.head.prepend(style); // Prepend to ensure it loads early
    }

    function setupResizeObserver() {
        if ('ResizeObserver' in window && header) {
            const headerSpacer = document.querySelector('.header-spacer');
            if (headerSpacer) {
                new ResizeObserver(entries => {
                    for (let entry of entries) {
                        headerSpacer.style.height = `${entry.contentRect.height}px`;
                    }
                }).observe(header);
            }
        }
    }

    function setActiveLink() {
        // Normalize current path once
        const currentPath = window.location.pathname.replace(/\/$/, '').replace('.html', '').toLowerCase();
        
        // Helper for efficient class toggling
        const toggleActive = (link) => {
            if (!link.getAttribute('href')) return;
            
            const linkHref = link.getAttribute('href').replace(/\/$/, '').replace('.html', '').toLowerCase();
            let isActive = false;

            if ((linkHref === '' || linkHref === 'index') && (currentPath === '' || currentPath === 'index')) {
                isActive = true;
            } else if (linkHref !== '' && linkHref !== 'index' && currentPath.includes(linkHref)) {
                isActive = true;
            }

            if (isActive) link.classList.add('active');
            else link.classList.remove('active');
        };

        document.querySelectorAll('.nav-item').forEach(toggleActive);
        document.querySelectorAll('.mobile-nav-item').forEach(toggleActive);
    }

    function setupMobileMenu() {
        if (!mobileMenuBtn || !mobileNavContainer) return;

        const iconPath = mobileMenuBtn.querySelector('path');
        let isAnimating = false;

        function toggleMenu() {
            if (isAnimating) return; // Prevent spam clicks
            isAnimating = true;

            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Close
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('bg-emerald-500/20', 'text-emerald-300');
                mobileNavContainer.classList.remove('open');
                
                // Wait for transition to finish before hiding
                setTimeout(() => {
                    mobileNavContainer.classList.add('hidden');
                    isAnimating = false;
                }, 300); // Matches CSS transition duration

                if(iconPath) iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                document.body.style.overflow = '';
            } else {
                // Open
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.classList.add('bg-emerald-500/20', 'text-emerald-300');
                mobileNavContainer.classList.remove('hidden');
                
                // Use double RAF for smooth animation entry
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        mobileNavContainer.classList.add('open');
                        isAnimating = false;
                    });
                });
                
                if(iconPath) iconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                document.body.style.overflow = 'hidden';
            }
        }

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Delegate click for mobile links to avoid attaching multiple listeners
        mobileNavContainer.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && !link.href.includes('login.html')) {
                if (mobileMenuBtn.getAttribute('aria-expanded') === 'true') toggleMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (mobileMenuBtn.getAttribute('aria-expanded') === 'true' && 
                !mobileNavContainer.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                toggleMenu();
            }
        });

        window.closeMobileMenu = () => {
            if (mobileMenuBtn.getAttribute('aria-expanded') === 'true') toggleMenu();
        };
    }

    function updateHeaderHeight() {
        if (header) {
            const spacer = document.querySelector('.header-spacer');
            if (spacer) spacer.style.height = `${header.offsetHeight}px`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Debounced Resize Handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateHeaderHeight();
            if (window.innerWidth >= 1024 && window.closeMobileMenu) {
                window.closeMobileMenu();
            }
        }, 100);
    });

    // Expose API
    window.Navigation = {
        updateHeaderHeight,
        setActiveLink,
        getLoginContainers: () => ({
            desktop: document.getElementById('nav-login-container'),
            mobileTop: document.getElementById('mobile-login-container'),
            mobileFull: document.getElementById('mobile-full-login-container')
        })
    };

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.dispatchEvent(new CustomEvent('navigationInjected')), 500);
    });
})();