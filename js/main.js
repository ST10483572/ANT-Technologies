// Main JavaScript file for Empowering the Nation website
// Enhanced with modern features and better user experience

// Global configuration
const CONFIG = {
    emailjs: {
        userID: 'YOUR_EMAILJS_USER_ID', // Replace with actual EmailJS user ID
        serviceID: 'YOUR_SERVICE_ID',    // Replace with actual service ID
        templateID: 'YOUR_TEMPLATE_ID'   // Replace with actual template ID
    },
    company: {
        name: 'Empowering the Nation',
        email: 'info@empoweringthenation.co.za',
        phone: '012 345 6789'
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize EmailJS if available
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.emailjs.userID);
    }

    // Add smooth scrolling to all anchor links
    addSmoothScrolling();
    
    // Add active class to current page navigation
    highlightCurrentPage();
    
    // Initialize form enhancements
    enhanceForms();
    
    // Add loading states to buttons
    enhanceButtons();
    
    // Initialize tooltips and interactive elements
    initializeInteractiveElements();
}

function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Update select dropdown
    const select = document.querySelector('select');
    if (select) {
        select.value = currentPage;
    }
}

function enhanceForms() {
    // Add real-time validation to all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add focus/blur animations
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim() === '') {
                    this.parentElement.classList.remove('filled');
                } else {
                    this.parentElement.classList.add('filled');
                }
            });
            
            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    if (required && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    } else if (value) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'text':
                if (field.id === 'qName' && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
        }
    }
    
    // Update field styling
    const errorElement = field.parentElement.querySelector('.error');
    if (errorElement) {
        if (isValid) {
            field.classList.remove('error-field');
            errorElement.style.display = 'none';
        } else {
            field.classList.add('error-field');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }
    
    return isValid;
}

function getFieldLabel(field) {
    const label = field.parentElement.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.placeholder;
}

function enhanceButtons() {
    const buttons = document.querySelectorAll('button, .primary-btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

function initializeInteractiveElements() {
    // Add hover effects to course cards
    const courseCards = document.querySelectorAll('.course');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
}

// Enhanced quote calculation with better error handling
function calculateQuoteEnhanced() {
    const form = document.getElementById('quoteForm');
    if (!form) return false;
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
    }
    
    try {
        // Perform calculation
        const result = calculateQuote();
        
        // Animate result display
        const resultDiv = document.getElementById('quoteResult');
        if (resultDiv && resultDiv.style.display === 'block') {
            resultDiv.style.opacity = '0';
            resultDiv.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                resultDiv.style.transition = 'all 0.3s ease';
                resultDiv.style.opacity = '1';
                resultDiv.style.transform = 'translateY(0)';
            }, 100);
        }
        
        return result;
    } finally {
        // Remove loading state
        if (submitButton) {
            setTimeout(() => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }, 500);
        }
    }
}

// Enhanced contact form submission
function submitContactForm() {
    const form = document.querySelector('form');
    if (!form) return false;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Validate all fields
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return false;
    }
    
    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    form.reset();
    
    return false;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0
    }).format(amount);
}

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

// Export functions for global use
window.calculateQuoteEnhanced = calculateQuoteEnhanced;
window.submitContactForm = submitContactForm;
window.showNotification = showNotification;