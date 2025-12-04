// Form handling functionality
class FormHandler {
    constructor() {
        this.forms = new Map();
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupTechSupportForm();
        this.setupPaymentForm();
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        this.forms.set('contact', {
            element: form,
            status: form.querySelector('#form-status'),
            submitBtn: form.querySelector('#submit-btn')
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit('contact');
        });
    }

    setupNewsletterForm() {
        const form = document.getElementById('newsletter-form');
        if (!form) return;

        this.forms.set('newsletter', {
            element: form,
            status: form.querySelector('.newsletter-status'),
            submitBtn: form.querySelector('button[type="submit"]')
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmit('newsletter');
        });
    }

    setupTechSupportForm() {
        const form = document.getElementById('tech-support-form');
        if (!form) return;

        this.forms.set('tech-support', {
            element: form,
            status: form.querySelector('#tech-support-status'),
            submitBtn: form.querySelector('#tech-support-submit')
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit('tech-support');
        });
    }

    setupPaymentForm() {
        const form = document.getElementById('payment-form');
        if (!form) return;

        this.forms.set('payment', {
            element: form,
            status: form.querySelector('#payment-status'),
            submitBtn: form.querySelector('#payment-submit')
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePaymentSubmit('payment');
        });
    }

    async handleFormSubmit(formName) {
        const formData = this.forms.get(formName);
        if (!formData) return;

        const { element, status, submitBtn } = formData;
        const form = element;

        // Validate form
        if (!this.validateForm(form)) {
            this.showStatus(status, 'Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);
        this.showStatus(status, 'Sending your message...', 'loading');

        try {
            const data = new FormData(form);
            
            // Add timestamp
            data.append('timestamp', new Date().toISOString());
            data.append('page_url', window.location.href);

            // Try Web3Forms first
            let response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data
            });

            let result = await response.json();

            if (response.ok && result.success) {
                this.showStatus(status, 'Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                // Track successful submission
                this.trackFormSubmission(formName, 'success');
                
                // Auto-close modal if in modal
                setTimeout(() => {
                    const modal = form.closest('.modal-overlay');
                    if (modal) {
                        modal.classList.remove('active');
                    }
                }, 3000);
            } else {
                throw new Error('Web3Forms submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback to GetForm
            try {
                const data = new FormData(form);
                
                const fallbackResponse = await fetch('https://getform.io/f/aolznnpb', {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (fallbackResponse.ok) {
                    this.showStatus(status, 'Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                    this.trackFormSubmission(formName, 'success_fallback');
                } else {
                    throw new Error('Fallback submission failed');
                }
            } catch (fallbackError) {
                this.showStatus(
                    status,
                    'Sorry, there was an error sending your message. Please try again or contact us directly.',
                    'error'
                );
                this.trackFormSubmission(formName, 'error');
            }
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleNewsletterSubmit(formName) {
        const formData = this.forms.get(formName);
        if (!formData) return;

        const { element, status, submitBtn } = formData;
        const form = element;
        const email = form.querySelector('input[type="email"]').value;

        if (!this.validateEmail(email)) {
            this.showStatus(status, 'Please enter a valid email address.', 'error');
            return;
        }

        this.setLoadingState(submitBtn, true);
        this.showStatus(status, 'Subscribing...', 'loading');

        // Simulate API call
        setTimeout(() => {
            this.showStatus(status, 'Thank you for subscribing!', 'success');
            form.reset();
            this.setLoadingState(submitBtn, false);
            this.trackFormSubmission(formName, 'success');
        }, 1500);
    }

    async handlePaymentSubmit(formName) {
        const formData = this.forms.get(formName);
        if (!formData) return;

        const { element, status, submitBtn } = formData;
        const form = element;

        if (!this.validateForm(form)) {
            this.showStatus(status, 'Please fill in all required fields correctly.', 'error');
            return;
        }

        this.setLoadingState(submitBtn, true);
        this.showStatus(status, 'Processing payment...', 'loading');

        // Simulate payment processing
        setTimeout(() => {
            this.showStatus(status, 'Payment successful! Thank you for your purchase.', 'success');
            form.reset();
            this.setLoadingState(submitBtn, false);
            this.trackFormSubmission(formName, 'payment_success');
            
            // Redirect to thank you page
            setTimeout(() => {
                window.location.href = '/thank-you.html';
            }, 2000);
        }, 3000);
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
            
            if (field.type === 'email' && !this.validateEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
            
            if (field.type === 'tel' && !this.validatePhone(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        });

        return isValid;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    showStatus(element, message, type) {
        if (!element) return;

        element.className = `form-status form-status-${type}`;
        element.innerHTML = message;
        element.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    setLoadingState(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || 'Submit';
        }
    }

    trackFormSubmission(formName, status) {
        console.log(`Form: ${formName}, Status: ${status}`);
        // Implement analytics tracking here
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    window.formHandler = new FormHandler();
});