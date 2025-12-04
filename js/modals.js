// Modal management system
class ModalSystem {
    constructor() {
        this.modals = new Map();
        this.currentModal = null;
        this.init();
    }

    init() {
        this.setupModals();
        this.setupKeyboardEvents();
        this.setupFocusTrap();
    }

    setupModals() {
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                this.registerModal(modalId, modal);
                
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal(modalId);
                });
            }
        });

        // Close buttons
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeCurrentModal();
            });
        });
    }

    registerModal(id, element) {
        const modal = {
            element,
            closeBtn: element.querySelector('.modal-close'),
            content: element.querySelector('.modal-content')
        };

        this.modals.set(id, modal);

        // Close on overlay click
        element.addEventListener('click', (e) => {
            if (e.target === element) {
                this.closeModal(id);
            }
        });

        // Close button
        if (modal.closeBtn) {
            modal.closeBtn.addEventListener('click', () => {
                this.closeModal(id);
            });
        }
    }

    openModal(id) {
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }

        const modal = this.modals.get(id);
        if (!modal) return;

        modal.element.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.currentModal = id;

        // Focus first focusable element
        setTimeout(() => {
            const focusable = modal.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }, 100);

        // Track modal open
        this.trackEvent('modal_open', { modal_id: id });
    }

    closeModal(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        modal.element.classList.remove('active');
        
        if (this.currentModal === id) {
            document.body.style.overflow = '';
            this.currentModal = null;
        }

        // Track modal close
        this.trackEvent('modal_close', { modal_id: id });
    }

    closeCurrentModal() {
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeCurrentModal();
            }
            
            if (e.key === 'Tab' && this.currentModal) {
                this.handleTabKey(e);
            }
        });
    }

    setupFocusTrap() {
        // Focus trap implementation for accessibility
        document.addEventListener('focusin', (e) => {
            if (this.currentModal && !this.modals.get(this.currentModal).element.contains(e.target)) {
                e.preventDefault();
                const modal = this.modals.get(this.currentModal);
                const focusable = modal.element.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusable) focusable.focus();
            }
        });
    }

    handleTabKey(e) {
        if (!this.currentModal) return;

        const modal = this.modals.get(this.currentModal);
        const focusableElements = modal.element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    trackEvent(event, data) {
        // Implement analytics tracking
        console.log(`Modal Event: ${event}`, data);
    }
}

// Initialize modal system
document.addEventListener('DOMContentLoaded', () => {
    window.modalSystem = new ModalSystem();
});