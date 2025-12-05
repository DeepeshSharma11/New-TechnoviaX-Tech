(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Check karein ki kya pehle se koi favicon maujood hai
        let link = document.querySelector("link[rel~='icon']");
        
        // Agar nahi hai, toh naya create karein
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        
        // Favicon ki settings (Yahan apna image path dalein)
        link.type = 'image/png';
        link.href = 'images/CompanySiteFav.png'; // Apne favicon ka sahi path yahan likhein
        
        console.log('Favicon set successfully via JS');
    });
})();