// Main JavaScript File - TechnoviaX Tech
document.addEventListener('DOMContentLoaded', function() {
    console.log('TechnoviaX Tech Website - JavaScript Loaded');
    
    // Loading screen
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('opacity-0');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }, 800); // Reduced from 1500ms for better UX
    } else {
        document.body.style.overflow = 'auto';
    }
    
    // Fix for smooth scrolling with fixed header
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 80;
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#' || href === '#!') return;
            
            // Only handle internal anchors
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Calculate position
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const finalPosition = targetPosition - headerHeight - 10;
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: finalPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Animation on scroll - Improved version
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .helpdesk-option, .job-card, .testimonial-card, .faq-item');
        
        animatedElements.forEach(element => {
            if (element.classList.contains('animated')) return;
            
            const elementPosition = element.getBoundingClientRect().top;
            const elementHeight = element.offsetHeight;
            const screenPosition = window.innerHeight - elementHeight / 3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize animated elements
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .helpdesk-option, .job-card');
        
        animatedElements.forEach(element => {
            // Only set initial state if not already animated
            if (!element.classList.contains('animated')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }
    
    // Initialize animations
    initAnimations();
    
    // Run animations on load and scroll
    window.addEventListener('load', () => {
        animateOnScroll();
    });
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            animateOnScroll();
        }, 100);
    });
    
    // Form handling for all pages with improved error handling
    const forms = document.querySelectorAll('form[data-web3forms]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Form submission started');
            
            const submitBtn = form.querySelector('[type="submit"]');
            const formStatus = form.querySelector('.form-status');
            
            // Show loading state
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
                submitBtn.dataset.originalText = originalText;
            }
            
            // Show status
            if (formStatus) {
                formStatus.className = 'form-status loading';
                formStatus.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending your message...';
                formStatus.style.display = 'block';
                
                // Scroll to status if it's not visible
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            try {
                // Get form data
                const formData = new FormData(form);
                
                // Log form data for debugging
                console.log('Form data:', Object.fromEntries(formData));
                
                // Submit to Web3Forms with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('Form submission result:', result);
                
                if (result.success) {
                    // Success
                    if (formStatus) {
                        formStatus.className = 'form-status success';
                        formStatus.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
                    }
                    
                    // Reset form
                    form.reset();
                    
                    // Hide success message after 5 seconds
                    if (formStatus) {
                        setTimeout(() => {
                            formStatus.style.display = 'none';
                        }, 5000);
                    }
                } else {
                    throw new Error('Form submission failed: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Error handling
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    
                    if (error.name === 'AbortError') {
                        formStatus.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Request timeout. Please check your internet connection and try again.';
                    } else {
                        formStatus.innerHTML = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Sorry, there was an error. Please try again or contact us directly at info.technoviax@gmail.com';
                    }
                    
                    // Keep error message visible
                }
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.originalText || 'Send Message';
                }
            }
        });
    });
    
    // FAQ functionality - Improved
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question ? question.querySelector('i') : null;
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = !answer.classList.contains('hidden');
                
                // Close all other FAQ items
                if (!isOpen) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.faq-question i');
                            if (otherAnswer) otherAnswer.classList.add('hidden');
                            if (otherIcon) {
                                otherIcon.classList.remove('fa-chevron-up');
                                otherIcon.classList.add('fa-chevron-down');
                            }
                        }
                    });
                }
                
                // Toggle current item
                answer.classList.toggle('hidden');
                
                // Rotate icon
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
                
                // Scroll to question if opening
                if (!isOpen) {
                    setTimeout(() => {
                        question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                }
            });
            
            // Add ARIA attributes for accessibility
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', `faq-answer-${Array.from(faqItems).indexOf(item)}`);
            answer.id = `faq-answer-${Array.from(faqItems).indexOf(item)}`;
            
            question.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
            });
        }
    });
    
    // Testimonial slider - Improved with auto-rotation
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialCards.length > 0) {
        let currentTestimonial = 0;
        let testimonialInterval;
        
        function showTestimonial(index) {
            // Remove active class from all
            testimonialCards.forEach(card => card.classList.remove('active'));
            testimonialDots.forEach(dot => {
                dot.classList.remove('bg-primary', 'opacity-100');
                dot.classList.add('opacity-50');
            });
            
            // Add active class to selected
            testimonialCards[index].classList.add('active');
            testimonialDots[index].classList.add('bg-primary', 'opacity-100');
            testimonialDots[index].classList.remove('opacity-50');
            
            currentTestimonial = index;
        }
        
        // Initialize first testimonial
        if (testimonialCards.length > 0) {
            showTestimonial(0);
        }
        
        // Add click events to dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                resetTestimonialInterval();
            });
        });
        
        // Auto-rotate testimonials
        function startTestimonialRotation() {
            testimonialInterval = setInterval(() => {
                let nextIndex = currentTestimonial + 1;
                if (nextIndex >= testimonialCards.length) {
                    nextIndex = 0;
                }
                showTestimonial(nextIndex);
            }, 5000); // Rotate every 5 seconds
        }
        
        function resetTestimonialInterval() {
            clearInterval(testimonialInterval);
            startTestimonialRotation();
        }
        
        // Start auto-rotation
        startTestimonialRotation();
        
        // Pause on hover
        const testimonialContainer = document.querySelector('.testimonial-slider');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            testimonialContainer.addEventListener('mouseleave', () => {
                startTestimonialRotation();
            });
        }
    }
    
    // Mobile navigation improvements
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close mobile menu if open
            if (window.innerWidth < 768) {
                const navbar = document.querySelector('.nav-links');
                if (navbar) {
                    // You might want to add mobile menu functionality here
                }
            }
        });
    });
    
    // Add CSS for animations if not already present
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animated {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .form-status {
                padding: 12px 16px;
                border-radius: 8px;
                margin-bottom: 20px;
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .form-status.success {
                background-color: #d1fae5;
                color: #065f46;
                border: 1px solid #a7f3d0;
            }
            
            .form-status.error {
                background-color: #fee2e2;
                color: #991b1b;
                border: 1px solid #fecaca;
            }
            
            .form-status.loading {
                background-color: #dbeafe;
                color: #1e40af;
                border: 1px solid #93c5fd;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle contact form service pre-filling from URL parameters
    function prefillFormFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam) {
            const serviceSelect = document.getElementById('contact-service') || 
                                 document.getElementById('service');
            
            if (serviceSelect) {
                // Try to find exact match
                for (let option of serviceSelect.options) {
                    if (option.value.toLowerCase() === serviceParam.toLowerCase()) {
                        serviceSelect.value = option.value;
                        break;
                    }
                }
                
                // If no exact match, try partial match
                if (!serviceSelect.value) {
                    for (let option of serviceSelect.options) {
                        if (option.text.toLowerCase().includes(serviceParam.toLowerCase())) {
                            serviceSelect.value = option.value;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // Call pre-fill function
    prefillFormFromURL();
    
    // Add loading state management for better UX
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-transition');
    });
    
    // Handle page transitions
    if (sessionStorage.getItem('pageLoaded')) {
        document.body.classList.add('page-loaded');
    } else {
        sessionStorage.setItem('pageLoaded', 'true');
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.body.classList.add('page-loaded');
            }, 100);
        });
    }
    
    // Debug logging (remove in production)
    console.log('JavaScript initialization complete');
    console.log('Forms found:', forms.length);
    console.log('FAQ items found:', faqItems.length);
    console.log('Testimonials found:', testimonialCards.length);
});

// Helper function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Helper function for debouncing
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