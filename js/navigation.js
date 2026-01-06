/**
 * TechnoviaX - Global Navigation Loader
 * OPTIMIZED with Firebase integration
 */

(function() {
    'use strict';

    let header, mobileMenuBtn, mobileNavContainer;
    let isMobileMenuOpen = false;
    let lastScrollY = window.scrollY;

    const headerHTML = `
    <header class="fixed w-full top-0 z-50 transition-all duration-200 nav-glass" id="main-header">
        <div class="container mx-auto px-4">
            <nav class="flex justify-between items-center py-3 md:py-4">
                <!-- Logo -->
                <div class="logo flex-shrink-0">
                    <a href="index.html" class="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
                        <span class="hidden xs:inline">Technovia</span><span class="text-emerald-400">X</span>
                    </a>
                </div>
                
                <!-- Desktop Navigation -->
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
                        
                        <!-- Login/Logout Section - SIMPLIFIED for Firebase -->
                        <li id="nav-login-container" class="nav-login-container ml-2 xl:ml-4">
                            <!-- Firebase will inject content here -->
                        </li>
                    </ul>
                </div>
                
                <!-- Mobile Menu Button -->
                <div class="flex items-center gap-2 lg:hidden">
                    <!-- Login Button for Mobile -->
                    <div id="mobile-login-container" class="mobile-login-container">
                        <!-- Firebase will inject content here -->
                    </div>
                    
                    <!-- Menu Toggle -->
                    <button id="mobile-menu-trigger" class="mobile-menu-btn p-2 rounded-lg text-emerald-100 hover:bg-emerald-500/20 transition-colors duration-150 flex items-center justify-center focus:outline-none" 
                            aria-label="Toggle navigation menu"
                            aria-expanded="false">
                        <svg class="w-6 h-6 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path class="menu-icon-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </nav>
            
            <!-- Mobile Navigation Menu -->
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
                            <!-- Mobile Login/Logout Area -->
                            <div id="mobile-full-login-container" class="mobile-full-login-container">
                                <!-- Firebase will inject content here -->
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <div class="header-spacer h-16 md:h-17"></div>
    `;

    // Critical styles - Firebase compatible
    const criticalStyles = `
    .nav-glass {
        background: rgba(2, 6, 23, 0.92);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border-bottom: 1px solid rgba(16, 185, 129, 0.1);
        will-change: transform;
        transform: translateZ(0);
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    .nav-glass.hidden-nav {
        transform: translateY(-100%);
    }
    .nav-glass.scrolled {
        background: rgba(2, 6, 23, 0.97);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .nav-item {
        position: relative;
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
        font-weight: 500;
        color: #e2e8f0;
        border-radius: 0.4rem;
        white-space: nowrap;
        transition: background-color 0.15s ease, color 0.15s ease;
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
    /* Firebase UI Styles */
    .firebase-login-btn {
        font-size: 0.9rem;
        white-space: nowrap;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    .firebase-login-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
    .firebase-profile-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .firebase-logout-btn {
        background: linear-gradient(135deg, #f56565 0%, #ed64a6 100%);
        color: white;
        border-radius: 6px;
        padding: 0.4rem 0.8rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .firebase-logout-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(245, 101, 101, 0.3);
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
        transition: background-color 0.15s ease, color 0.15s ease;
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
    @media (prefers-reduced-motion: reduce) {
        .nav-glass,
        .nav-item,
        .mobile-nav-item,
        .mobile-nav-container {
            transition: none !important;
        }
    }
    `;

    function injectHeader() {
        // Inject critical styles
        if (!document.getElementById('nav-critical-styles')) {
            const style = document.createElement('style');
            style.id = 'nav-critical-styles';
            style.textContent = criticalStyles;
            document.head.appendChild(style);
        }

        // Inject header
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
        setTimeout(() => {
            setActiveLink();
            setupMobileMenu();
            updateHeaderHeight();
            setupScrollHandler();
            // Don't call checkAuthStatus() - Firebase will handle it
        }, 50);
    }

    function setActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
        
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (!href) return;
            
            const page = href.replace('.html', '').replace('index', '');
            const isActive = page === currentPage || 
                           (currentPage === 'index' && page === '') ||
                           (currentPage === '' && page === '');
            
            item.classList.toggle('active', isActive);
        });
    }

    // Helper function for Firebase to update UI
    window.updateFirebaseAuthUI = function(isLoggedIn, userData = null) {
        const desktopContainer = document.getElementById('nav-login-container');
        const mobileContainer = document.getElementById('mobile-login-container');
        const mobileFullContainer = document.getElementById('mobile-full-login-container');
        
        if (isLoggedIn && userData) {
            // User is logged in
            const userName = userData.displayName || userData.email.split('@')[0];
            const userAvatar = userData.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff`;
            
            // Desktop
            if (desktopContainer) {
                desktopContainer.innerHTML = `
                    <div class="flex items-center gap-2">
                        <div class="firebase-profile-btn">
                            <img src="${userAvatar}" alt="${userName}" class="w-6 h-6 rounded-full">
                            <span class="hidden xl:inline text-sm">${userName}</span>
                        </div>
                        <button onclick="window.firebaseLogout()" class="firebase-logout-btn text-sm">
                            <i class="fas fa-sign-out-alt mr-1"></i>
                            <span class="hidden xl:inline">Logout</span>
                        </button>
                    </div>
                `;
            }
            
            // Mobile top
            if (mobileContainer) {
                mobileContainer.innerHTML = `
                    <div class="flex items-center gap-1">
                        <img src="${userAvatar}" alt="${userName}" class="w-6 h-6 rounded-full">
                        <button onclick="window.firebaseLogout()" class="firebase-logout-btn text-xs px-2 py-1">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                `;
            }
            
            // Mobile full
            if (mobileFullContainer) {
                mobileFullContainer.innerHTML = `
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-3 rounded-xl">
                            <img src="${userAvatar}" alt="${userName}" class="w-10 h-10 rounded-full border-2 border-white">
                            <div>
                                <p class="font-semibold text-white">${userName}</p>
                                <p class="text-xs text-gray-300">${userData.email}</p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <a href="/dashboard.html" class="flex items-center gap-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                <i class="fas fa-tachometer-alt w-5"></i>
                                <span>Dashboard</span>
                            </a>
                            <a href="/profile.html" class="flex items-center gap-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                <i class="fas fa-user-cog w-5"></i>
                                <span>Profile</span>
                            </a>
                            <button onclick="window.firebaseLogout()" class="w-full flex items-center justify-center gap-2 firebase-logout-btn p-2 mt-2">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                `;
            }
        } else {
            // User is not logged in
            if (desktopContainer) {
                desktopContainer.innerHTML = `
                    <a href="login.html" class="firebase-login-btn">
                        <i class="fas fa-user mr-1"></i>
                        <span>Login</span>
                    </a>
                `;
            }
            
            if (mobileContainer) {
                mobileContainer.innerHTML = `
                    <a href="login.html" class="firebase-login-btn text-sm px-3 py-1.5">
                        <i class="fas fa-user"></i>
                    </a>
                `;
            }
            
            if (mobileFullContainer) {
                mobileFullContainer.innerHTML = `
                    <a href="login.html" class="firebase-login-btn w-full flex items-center justify-center py-2.5">
                        <i class="fas fa-user mr-2"></i>
                        <span>Login / Register</span>
                    </a>
                `;
            }
        }
    };

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
            
            // Toggle body scroll
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }

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
                setTimeout(toggleMenu, 100);
            }
        }, { passive: true });

        // Close menu on window resize
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

    // Smart scroll handler
    function setupScrollHandler() {
        if (!header) return;
        
        let ticking = false;
        let lastScrollTop = 0;
        const scrollThreshold = 10;
        const hideThreshold = 100;
        
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) return;
            
            if (scrollTop > lastScrollTop && scrollTop > hideThreshold) {
                header.classList.add('hidden-nav');
            } else {
                header.classList.remove('hidden-nav');
            }
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Show header on mouse move near top
        let mouseMoveTimeout;
        document.addEventListener('mousemove', (e) => {
            if (e.clientY < 100 && header.classList.contains('hidden-nav')) {
                header.classList.remove('hidden-nav');
                
                clearTimeout(mouseMoveTimeout);
                mouseMoveTimeout = setTimeout(() => {
                    if (window.pageYOffset > hideThreshold) {
                        header.classList.add('hidden-nav');
                    }
                }, 2000);
            }
        }, { passive: true });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }

    // Expose API for Firebase
    window.Navigation = {
        updateHeaderHeight,
        setActiveLink,
        getLoginContainers: () => ({
            desktop: document.getElementById('nav-login-container'),
            mobileTop: document.getElementById('mobile-login-container'),
            mobileFull: document.getElementById('mobile-full-login-container')
        }),
        // Firebase helper
        updateAuthUI: window.updateFirebaseAuthUI
    };

    // Dispatch event when navigation is ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigationReady'));
        }, 100);
    });
})();