/**
 * TechnoviaX - Global Navigation Loader
 * This script injects the header HTML AND the necessary CSS styles into the page.
 * Ensures consistent look (size, scroll, colors) across all pages.
 */

(function() {
    // 1. Define the Styles (CSS)
    // We inject this directly so you don't have to copy-paste CSS to every HTML file
    const navStyles = `
    <style>
        /* Navigation Container */
        header {
            transition: all 0.3s ease;
        }

        /* Navigation Links */
        .nav-links li a {
            position: relative;
            padding: 8px 0;
            white-space: nowrap;
            transition: color 0.3s ease;
        }
        
        .nav-links li a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #2563eb; /* primary color */
            transition: width 0.3s ease;
        }
        
        /* Hover & Active State Animation */
        .nav-links li a:hover::after,
        .nav-links li a.active::after {
            width: 100%;
        }

        /* Active State Text Style */
        .nav-links li a.active {
            color: #2563eb; /* primary */
            font-weight: 700;
        }

        /* Default Text Style */
        .nav-links li a:not(.active) {
            color: #0f172a; /* secondary */
            font-weight: 500;
        }
        .nav-links li a:not(.active):hover {
            color: #2563eb; /* primary */
        }

        /* --- MOBILE SPECIFIC STYLES (The "Size" Fix) --- */
        @media (max-width: 768px) {
            .nav-links {
                overflow-x: auto;
                padding-bottom: 4px; /* Compact padding */
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none; /* Firefox */
            }
            
            /* Make scrollbar tiny/invisible for cleaner look */
            .nav-links::-webkit-scrollbar { 
                height: 2px; 
            }
            .nav-links::-webkit-scrollbar-thumb { 
                background: #2563eb; 
                border-radius: 10px; 
            }
            
            /* Smaller Font Size for Mobile */
            .nav-links li a {
                font-size: 14px; /* Matches privacy.html */
                padding: 6px 0;
            }
            
            /* Reduce gap slightly on mobile */
            .nav-links {
                gap: 1rem !important; /* 16px gap */
            }
        }
    </style>
    `;

    // 2. Define the Header HTML
    const headerHTML = `
    <header class="bg-white shadow-md fixed w-full top-0 z-50 transition-all duration-300">
        <div class="container mx-auto px-4">
            <nav class="flex flex-col md:flex-row justify-between items-center py-4">
                <div class="logo flex items-center gap-2 mb-3 md:mb-0">
                    <a href="/" class="text-2xl font-bold text-primary hover:scale-105 transition-transform">
                        Technovia<span class="text-accent">X</span>
                    </a>
                </div>
                
                <div class="w-full md:w-auto">
                    <ul class="nav-links flex flex-nowrap justify-start md:justify-center list-none gap-4 md:gap-8">
                        <li><a href="/" class="nav-item">Home</a></li>
                        <li><a href="/services.html" class="nav-item">Services</a></li>
                        <li><a href="/about.html" class="nav-item">About</a></li>
                        <li><a href="/portfolio.html" class="nav-item">Portfolio</a></li>
                        <li><a href="/testimonials.html" class="nav-item">Testimonials</a></li>
                        <li><a href="/helpdesk.html" class="nav-item">Helpdesk</a></li>
                        <li><a href="/careers.html" class="nav-item">Careers</a></li>
                        <li><a href="/contact.html" class="nav-item">Contact</a></li>
                        <!-- Login Button injected here by loginfirebase.js -->
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    `;

    // 3. Function to inject everything
    function initNavigation() {
        // Don't inject if header already exists (prevents duplicates)
        if (document.querySelector('header')) return;

        // Inject Styles
        document.head.insertAdjacentHTML('beforeend', navStyles);

        // Inject Header HTML at the start of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Set Active State
        setActiveLink();
    }

    // 4. Function to set active link logic
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Clean previous classes
            link.classList.remove('active');

            let isActive = false;

            // Exact match or sub-path match logic
            if (linkHref === '/' || linkHref === '/index.html') {
                if (currentPath === '/' || currentPath.includes('index.html')) isActive = true;
            } else {
                if (currentPath.includes(linkHref)) isActive = true;
            }

            if (isActive) {
                link.classList.add('active');
            }
        });
    }

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();