(function() {
    'use strict';
    
    function setFavicon() {
        try {
            // Multiple favicon paths try karein (priority order)
            const faviconPaths = [
                '/images/CompanySiteFav.png',    // Root se
                './images/CompanySiteFav.png',   // Current folder se
                'images/CompanySiteFav.png',     // Relative path
                '/favicon.ico',                  // Default favicon
                './favicon.ico'                  // Current folder se default
            ];
            
            // Pehle existing favicons ko check karein
            const existingFavicons = document.querySelectorAll('link[rel*="icon"], link[rel*="shortcut"]');
            
            // Remove existing favicons (optional)
            existingFavicons.forEach(fav => {
                if (!fav.hasAttribute('data-keep')) {
                    fav.remove();
                }
            });
            
            // Create favicon element with test
            const createFavicon = (path, rel, type, sizes) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = function() {
                        // Image load successful
                        console.log(`✅ Favicon found at: ${path}`);
                        resolve({ success: true, path: path });
                    };
                    img.onerror = function() {
                        // Image not found
                        console.log(`❌ Favicon not found at: ${path}`);
                        resolve({ success: false, path: path });
                    };
                    img.src = path;
                });
            };
            
            // Try each path
            const tryPaths = async () => {
                for (const path of faviconPaths) {
                    const result = await createFavicon(path);
                    if (result.success) {
                        // Create favicon link
                        const link = document.createElement('link');
                        link.rel = 'icon';
                        link.href = result.path;
                        link.type = 'image/png';
                        
                        // Additional favicon for different sizes
                        const link2 = document.createElement('link');
                        link2.rel = 'apple-touch-icon';
                        link2.href = result.path;
                        
                        const link3 = document.createElement('link');
                        link3.rel = 'shortcut icon';
                        link3.href = result.path;
                        
                        // Add to document head
                        document.head.appendChild(link);
                        document.head.appendChild(link2);
                        document.head.appendChild(link3);
                        
                        console.log('✅ Favicon loaded successfully');
                        return true;
                    }
                }
                
                // Agar koi bhi path work nahi karta
                console.warn('⚠️  No favicon found, using default');
                const defaultLink = document.createElement('link');
                defaultLink.rel = 'icon';
                defaultLink.href = '/favicon.ico';
                document.head.appendChild(defaultLink);
                return false;
            };
            
            // Execute
            tryPaths();
            
        } catch (error) {
            console.error('❌ Error loading favicon:', error);
            
            // Emergency fallback
            try {
                const fallbackLink = document.createElement('link');
                fallbackLink.rel = 'icon';
                fallbackLink.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>';
                document.head.appendChild(fallbackLink);
                console.log('⚠️  Using emoji fallback favicon');
            } catch (fallbackError) {
                console.error('❌ Even fallback failed:', fallbackError);
            }
        }
    }
    
    // DOM ready hone par execute karein
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setFavicon);
    } else {
        setFavicon();
    }
    
    // Window load par bhi try karein (for async images)
    window.addEventListener('load', function() {
        // Double-check ki favicon properly set hua hai
        setTimeout(() => {
            const hasFavicon = document.querySelector('link[rel*="icon"]');
            if (!hasFavicon) {
                console.warn('⚠️  Favicon not found after load, retrying...');
                setFavicon();
            }
        }, 1000);
    });
})();