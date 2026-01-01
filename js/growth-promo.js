/**
 * TechnoviaX - Growth Promotion Popup
 * Displays a high-converting overlay enticing users to check businessgrowth.html
 */

(function() {
    // Check if user has already dismissed it recently (optional, currently showing every session)
    if (sessionStorage.getItem('technoviax_growth_seen')) {
        // Uncomment below to show only once per session
        // return;
    }

    // Styles for the popup
    const styles = `
        .growth-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(10px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .growth-card {
            background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 1.5rem;
            max-width: 90%;
            width: 500px;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .growth-close {
            position: absolute;
            top: 1rem; right: 1rem;
            color: #94a3b8;
            cursor: pointer;
            font-size: 1.5rem;
            background: transparent;
            border: none;
        }
        .growth-badge {
            background: #ef4444;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
        }
        .growth-title {
            font-size: 1.875rem;
            font-weight: 800;
            color: white;
            margin-bottom: 0.5rem;
            line-height: 1.2;
        }
        .growth-text {
            color: #cbd5e1;
            margin-bottom: 2rem;
            font-size: 1rem;
        }
        .growth-btn {
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            font-weight: bold;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            text-decoration: none;
            display: block;
            width: 100%;
            transition: transform 0.2s;
        }
        .growth-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }
        .growth-link {
            display: block;
            margin-top: 1rem;
            color: #64748b;
            font-size: 0.875rem;
            text-decoration: underline;
            cursor: pointer;
        }
    `;

    // Inject Styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create Elements
    const overlay = document.createElement('div');
    overlay.className = 'growth-overlay';
    
    overlay.innerHTML = `
        <div class="growth-card">
            <button class="growth-close">&times;</button>
            <span class="growth-badge">⚠️ IMPORTANT ALERT</span>
            <h2 class="growth-title">Is Your Shop <span style="color: #ef4444">Invisible?</span></h2>
            <p class="growth-text">Your local competitors are going online and stealing your customers. Don't let your business die offline.</p>
            <a href="buinessgrowth.html" class="growth-btn">
                Show Me How to Grow 🚀
            </a>
            <a href="#" class="growth-link growth-dismiss">No thanks, I don't want more sales</a>
        </div>
    `;

    // Show Popup Function
    function showPopup() {
        document.body.appendChild(overlay);
        // Trigger animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('.growth-card').style.transform = 'scale(1)';
        });
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        sessionStorage.setItem('technovia_growth_seen', 'true');
    }

    // Close Popup Function
    function closePopup(e) {
        if(e) e.preventDefault();
        overlay.style.opacity = '0';
        overlay.querySelector('.growth-card').style.transform = 'scale(0.9)';
        setTimeout(() => {
            if(document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            document.body.style.overflow = '';
        }, 500);
    }

    // Event Listeners
    overlay.querySelector('.growth-close').addEventListener('click', closePopup);
    overlay.querySelector('.growth-dismiss').addEventListener('click', closePopup);
    overlay.querySelector('.growth-btn').addEventListener('click', () => {
        // Allow navigation to happen
        document.body.style.overflow = '';
    });

    // Trigger after delay (e.g., 3 seconds)
    setTimeout(showPopup, 3000);

})();