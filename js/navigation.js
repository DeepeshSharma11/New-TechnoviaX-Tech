/**
 * TechnoviaX - Global Navigation Loader
 * HEAVILY OPTIMIZED for performance and smooth scrolling
 * Reduced CPU/GPU load significantly
 */

(function() {
    'use strict';

    // Cache DOM queries globally (only critical ones)
    let header, mobileMenuBtn, mobileNavContainer;
    let isMobileMenuOpen = false;
    let resizeObserver = null;

    // Optimized header HTML - removed unnecessary animations
    const headerHTML = `
    <header class="fixed w-full top-0 z-50 transition-colors duration-200 nav-glass" id="main-header">
        <div class="container mx-auto px-4">
            <nav class="flex justify-between items-center py-3 md:py-4">
                <!-- Logo - Simplified -->
                <div class="logo flex-shrink-0">
                    <a href="index.html" class="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
                        <span class="hidden xs:inline">Technovia</span><span class="text-emerald-400">X</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation - Reduced gap for mobile -->
                <div class="hidden lg:flex flex-1 justify-end xl:justify-center">
                    <ul class="nav-links flex items-center list-none gap-1 xl:gap-2">
                        <li><a href="index.html" class="nav-item">Home</a></li>
                        <li><a href="services.html" class="nav-item">Services</a></li>
                        <li><a href="about.html" class="nav-item">About</a></li>
                        <li><a href="portfolio.html" class="nav-item">Portfolio</a></li>
                        <li><a href="testimonials.html" class="nav-item">Testimonials</a></li>
                        <li><a href="helpdesk.html" class="nav-item">Helpdesk</a></li>
                        <li><a href="careers.html" class="nav-item">Careers</a></li>
                        <li><a href="contact.html" class="nav-item">Contact</a></li>
                        
                        <!-- Login/Auth Section -->
                        <li id="nav-login-container" class="nav-login-container ml-2 xl:ml-4"></li>
                    </ul>
                </div>
                
                <!-- Mobile Menu Button -->
                <div class="flex items-center gap-2 lg:hidden">
                    <!-- Login Button for Mobile -->
                    <div id="mobile-login-container" class="mobile-login-container"></div>
                    
                    <!-- Simplified Menu Toggle -->
                    <button id="mobile-menu-trigger" class="mobile-menu-btn p-2 rounded-lg text-emerald-100 transition-colors duration-150 flex items-center justify-center focus:outline-none" 
                            aria-label="Toggle navigation menu"
                            aria-expanded="false">
                        <svg class="w-6 h-6 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path class="menu-icon-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            
            <!-- Mobile Navigation Menu - Simplified -->
            <div id="mobile-nav-container" class="mobile-nav-container hidden lg:hidden border-t border-emerald-500/10 shadow-lg overflow-hidden">
                <div class="mobile-nav-content py-3 px-4">
                    <ul class="flex flex-col list-none gap-1">
                        <li><a href="index.html" class="mobile-nav-item">Home</a></li>
                        <li><a href="services.html" class="mobile-nav-item">Services</a></li>
                        <li><a href="about.html" class="mobile-nav-item">About</a></li>
                        <li><a href="portfolio.html" class="mobile-nav-item">Portfolio</a></li>
                        <li><a href="testimonials.html" class="mobile-nav-item">Testimonials</a></li>
                        <li><a href="helpdesk.html" class="mobile-nav-item">Helpdesk</a></li>
                        <li><a href="careers.html" class="mobile-nav-item">Careers</a></li>
                        <li><a href="contact.html" class="mobile-nav-item">Contact</a></li>
                        <li class="pt-3 mt-3 border-t border-emerald-500/10">
                            <!-- Mobile Login/Profile Area -->
                            <div id="mobile-full-login-container" class="mobile-full-login-container"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <div class="header-spacer h-16 md:h-17"></div>
    `;

    // Inline critical styles to prevent FOUC and reduce paint time
    const criticalStyles = `
    .nav-glass {
        background: rgba(2, 6, 23, 0.92);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border-bottom: 1px solid rgba(16, 185, 129, 0.1);
        will-change: transform;
        transform: translateZ(0);
    }
    .nav-item {
        position: relative;
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
        font-weight: 500;
        color: #e2e8f0;
        border-radius: 0.4rem;
        white-space: nowrap;
        transition: background-color 0.15s ease;
    }
    .nav-item:hover {
        color: #34d399;
        background-color: rgba(16, 185, 129, 0.08);
    }
    .nav-item.active {
        color: #34d399;
        font-weight: 600;
        background-color: rgba(16, 185, 129, 0.12);
    }
    .mobile-nav-container {
        background: rgba(2, 6, 23, 0.98);
        backdrop-filter: blur(8px);
        max-height: 0;
        opacity: 0;
        visibility: hidden;
        transition: max-height 0.3s ease, opacity 0.2s ease;
        will-change: max-height, opacity;
    }
    .mobile-nav-container.open {
        max-height: 75vh;
        opacity: 1;
        visibility: visible;
    }
    .mobile-nav-item {
        display: block;
        padding: 0.6rem 0.8rem;
        font-size: 0.95rem;
        color: #cbd5e1;
        border-radius: 0.4rem;
        transition: background-color 0.15s ease;
        border-left: 2px solid transparent;
    }
    .mobile-nav-item:hover,
    .mobile-nav-item:active {
        background-color: rgba(16, 185, 129, 0.08);
        color: #34d399;
    }
    .mobile-nav-item.active {
        color: #34d399;
        font-weight: 600;
        background-color: rgba(16, 185, 129, 0.12);
        border-left-color: #34d399;
    }
    .mobile-menu-btn:active {
        background-color: rgba(16, 185, 129, 0.15);
    }
    @media (prefers-reduced-motion: reduce) {
        .nav-item,
        .mobile-nav-item,
        .mobile-nav-container,
        .mobile-menu-btn {
            transition: none !important;
        }
    }
    `;

    function injectHeader() {
        // Inject critical styles first
        if (!document.getElementById('nav-critical-styles')) {
            const style = document.createElement('style');
            style.id = 'nav-critical-styles';
            style.textContent = criticalStyles;
            document.head.appendChild(style);
        }

        // Inject header HTML
        const placeholder = document.getElementById('nav-placeholder');
        if (placeholder) {
            placeholder.outerHTML = headerHTML;
        } else if (!document.getElementById('main-header')) {
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // Cache DOM elements
        header = document.getElementById('main-header');
        mobileMenuBtn = document.getElementById('mobile-menu-trigger');
        mobileNavContainer = document.getElementById('mobile-nav-container');

        // Initialize with minimal operations
        requestIdleCallback(() => {
            setActiveLink();
            setupMobileMenu();
            updateHeaderHeight();
            setupScrollHandler();
        }, { timeout: 500 });
    }

    function setActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
        
        // Cache nav items
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (!href) return;
            
            const page = href.replace('.html', '').replace('index', '');
            const isActive = page === currentPage || 
                           (currentPage === 'index' && page === '') ||
                           (currentPage === '' && page === '');
            
            item.classList.toggle('active', isActive);
        });
    }

    function setupMobileMenu() {
        if (!mobileMenuBtn || !mobileNavContainer) return;

        const iconPath = mobileMenuBtn.querySelector('path');
        
        function toggleMenu() {
            isMobileMenuOpen = !isMobileMenuOpen;
            const isExpanded = isMobileMenuOpen;
            
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            mobileNavContainer.classList.toggle('open', isExpanded);
            mobileNavContainer.classList.toggle('hidden', !isExpanded);
            
            if (iconPath) {
                iconPath.setAttribute('d', isExpanded ? 
                    'M6 18L18 6M6 6l12 12' : 
                    'M4 6h16M4 12h16M4 18h16');
            }
            
            // Toggle body scroll only when necessary
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
                document.body.style.touchAction = 'none';
            } else {
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }
        }

        // Use passive event listeners for better scroll performance
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        }, { passive: true });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen && 
                !mobileNavContainer.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                toggleMenu();
            }
        }, { passive: true });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (isMobileMenuOpen && e.key === 'Escape') {
                toggleMenu();
            }
        }, { passive: true });

        // Close menu when clicking a link
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && isMobileMenuOpen) {
                // Don't close for login links
                if (!e.target.href.includes('login.html')) {
                    setTimeout(toggleMenu, 100);
                }
            }
        }, { passive: true });

        // Close menu on window resize (for tablet -> desktop)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth >= 1024 && isMobileMenuOpen) {
                    toggleMenu();
                }
            }, 100);
        }, { passive: true });
    }

    function updateHeaderHeight() {
        if (!header) return;
        
        const spacer = document.querySelector('.header-spacer');
        if (spacer) {
            spacer.style.height = `${header.offsetHeight}px`;
        }
    }

    // Optimized scroll handler for header effects
    function setupScrollHandler() {
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateHeader() {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('scrolled');
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.classList.remove('scrolled');
                header.style.backdropFilter = 'blur(6px)';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // Initialize based on document state
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Cleanup function
    function cleanup() {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        
        // Remove event listeners if needed
        const elements = [mobileMenuBtn, mobileNavContainer, document, window];
        elements.forEach(el => {
            if (el) {
                el.replaceWith(el.cloneNode(true));
            }
        });
        
        header = null;
        mobileMenuBtn = null;
        mobileNavContainer = null;
    }

    // Expose minimal API
    window.Navigation = {
        updateHeaderHeight,
        setActiveLink,
        getLoginContainers: () => ({
            desktop: document.getElementById('nav-login-container'),
            mobileTop: document.getElementById('mobile-login-container'),
            mobileFull: document.getElementById('mobile-full-login-container')
        }),
        cleanup
    };

    // Dispatch event when navigation is ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigationReady', { 
                detail: { 
                    timestamp: Date.now(),
                    performance: performance.now() 
                }
            }));
        }, 100);
    });

    // Add performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) {
                        console.warn(`Navigation.js long task: ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Performance monitoring not supported
        }
    }
})();