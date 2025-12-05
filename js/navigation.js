/**
 * TechnoviaX - Global Navigation Loader
 * This script injects the header navigation into the page and sets the active link.
 */

(function() {
    const headerHTML = `
    <header class="bg-white shadow-md fixed w-full top-0 z-40 transition-all duration-300">
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
                        <!-- Login Button will be injected here by loginfirebase.js -->
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    `;

    // Function to inject header
    function injectHeader() {
        // Insert at the start of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
        setActiveLink();
    }

    // Function to set active class based on current URL
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item');
        
        // Default classes for all links
        const defaultClasses = "text-secondary font-medium hover:text-primary transition-colors";
        // Active classes
        const activeClasses = "text-primary font-bold active";

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Reset to default
            link.className = defaultClasses;

            // Check for match
            let isActive = false;

            // Home page check
            if ((linkHref === '/' || linkHref === '/index.html') && (currentPath === '/' || currentPath.endsWith('index.html'))) {
                isActive = true;
            }
            // Other pages check (exact match or substring)
            else if (linkHref !== '/' && currentPath.includes(linkHref)) {
                isActive = true;
            }

            if (isActive) {
                link.className = activeClasses;
            }
        });
    }

    // Execute as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        injectHeader();
    }
})();