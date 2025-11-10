// Cart management
let cart = JSON.parse(localStorage.getItem('mashtatoCart')) || [];

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', function() {
            nav.classList.toggle('show');
            
            // Animate hamburger icon
            if (nav.classList.contains('show')) {
                this.innerHTML = '✕';
            } else {
                this.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
                nav.classList.remove('show');
                mobileMenu.innerHTML = '☰';
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Update cart count on page load
    updateCartCount();

    // Topping Selection with animation
    const toppingOptions = document.querySelectorAll('.topping-option');
    toppingOptions.forEach(option => {
        option.addEventListener('click', function() {
            toppingOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.style.transform = 'scale(1)';
            });
            this.classList.add('selected');
            this.style.transform = 'scale(1.05)';
            
            // Reset after animation
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Quantity Selector
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityDisplay = document.querySelector('.quantity-display');
    const addToCartBtn = document.querySelector('.add-to-cart');
    
    if (minusBtn && plusBtn && quantityDisplay && addToCartBtn) {
        let quantity = 1;
        
        minusBtn.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updateCartButton();
                animateNumber(quantityDisplay);
            }
        });
        
        plusBtn.addEventListener('click', function() {
            if (quantity < 99) { // Add max limit
                quantity++;
                quantityDisplay.textContent = quantity;
                updateCartButton();
                animateNumber(quantityDisplay);
            }
        });
        
        function updateCartButton() {
            const total = quantity * 6;
            addToCartBtn.innerHTML = `Add to Cart - RM${total}.00`;
        }

        // Add to Cart functionality with better feedback
        addToCartBtn.addEventListener('click', function() {
            const selectedTopping = document.querySelector('.topping-option.selected');
            if (!selectedTopping) {
                showNotification('Please select a topping!', 'warning');
                return;
            }
            
            const toppingType = selectedTopping.getAttribute('data-topping');
            const toppingName = toppingType === 'chicken' ? 'Chicken Popcorn' : 'Meatball';
            
            const item = {
                id: Date.now(),
                name: 'Loaded Potato Bowl',
                topping: toppingName,
                quantity: quantity,
                price: 6,
                total: quantity * 6
            };
            
            cart.push(item);
            localStorage.setItem('mashtatoCart', JSON.stringify(cart));
            
            // Show success notification
            showNotification(`✓ Added ${quantity} × ${toppingName} Bowl to cart!`, 'success');
            
            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Reset quantity
            quantity = 1;
            quantityDisplay.textContent = quantity;
            updateCartButton();
            
            // Update cart count with animation
            updateCartCount();
            
            // Show view cart button
            const viewCartBtn = document.querySelector('.view-cart-btn');
            if (viewCartBtn) {
                viewCartBtn.style.display = 'inline-block';
                viewCartBtn.style.animation = 'fadeInUp 0.5s ease-out';
            }
        });
    }

    // Cart page functionality
    if (document.querySelector('.cart-section')) {
        loadCart();
    }

    // Checkout page functionality
    if (document.querySelector('.checkout-section')) {
        loadCheckout();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .popular-card, .testimonial-card, .step-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Helper function to animate numbers
function animateNumber(element) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ECC71' : type === 'warning' ? '#F7931E' : '#3498db'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-out 2.6s forwards;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Animate cart count
        if (totalItems > 0) {
            cartCount.parentElement.style.animation = 'pulse 0.4s ease-out';
            setTimeout(() => {
                cartCount.parentElement.style.animation = '';
            }, 400);
        }
    }
}

function loadCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const cartSummaryDiv = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartSummaryDiv.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartSummaryDiv.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`;
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Topping: ${item.topping}</p>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div class="cart-item-price">RM${item.total}.00</div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });
    
    // Add event listeners for cart actions
    document.querySelectorAll('.cart-item-actions .minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                cart[index].total = cart[index].quantity * cart[index].price;
                localStorage.setItem('mashtatoCart', JSON.stringify(cart));
                loadCart();
                showNotification('Quantity updated', 'info');
            }
        });
    });
    
    document.querySelectorAll('.cart-item-actions .plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cart[index].quantity < 99) {
                cart[index].quantity++;
                cart[index].total = cart[index].quantity * cart[index].price;
                localStorage.setItem('mashtatoCart', JSON.stringify(cart));
                loadCart();
                showNotification('Quantity updated', 'info');
            }
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const item = cart[index];
            
            // Custom confirmation
            if (confirm(`Remove ${item.name} with ${item.topping} from cart?`)) {
                cart.splice(index, 1);
                localStorage.setItem('mashtatoCart', JSON.stringify(cart));
                loadCart();
                updateCartCount();
                showNotification('Item removed from cart', 'warning');
            }
        });
    });
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal;
    
    document.getElementById('subtotal').textContent = `RM${subtotal}.00`;
    document.getElementById('total').textContent = `RM${total}.00`;
}

function loadCheckout() {
    const orderReview = document.getElementById('order-review-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    orderReview.innerHTML = '';
    cart.forEach((item, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.style.animation = `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`;
        reviewItem.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.topping} × ${item.quantity}</small>
            </div>
            <div>RM${item.total}.00</div>
        `;
        orderReview.appendChild(reviewItem);
    });
    
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    checkoutSubtotal.textContent = `RM${subtotal}.00`;
    checkoutTotal.textContent = `RM${subtotal}.00`;
    
    // Payment method selection
    const paymentCards = document.querySelectorAll('.payment-option-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            paymentCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
    });
    
    // Place order button
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            const name = document.getElementById('customer-name').value.trim();
            const phone = document.getElementById('customer-phone').value.trim();
            const address = document.getElementById('customer-address').value.trim();
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
            
            if (!name) {
                showNotification('Please enter your name', 'warning');
                document.getElementById('customer-name').focus();
                return;
            }
            
            if (!phone) {
                showNotification('Please enter your phone number', 'warning');
                document.getElementById('customer-phone').focus();
                return;
            }
            
            if (!address) {
                showNotification('Please enter your delivery address', 'warning');
                document.getElementById('customer-address').focus();
                return;
            }
            
            if (!paymentMethod) {
                showNotification('Please select a payment method', 'warning');
                return;
            }
            
            // Show loading state
            const originalText = placeOrderBtn.textContent;
            placeOrderBtn.disabled = true;
            placeOrderBtn.innerHTML = '<span class="loading"></span> Processing...';
            
            // Simulate processing
            setTimeout(() => {
                // Store order details
                const orderDetails = {
                    orderNumber: 'ORD-' + Date.now(),
                    items: cart,
                    customerName: name,
                    customerPhone: phone,
                    customerAddress: address,
                    customerNotes: document.getElementById('customer-notes').value.trim(),
                    paymentMethod: paymentMethod.value,
                    subtotal: cart.reduce((sum, item) => sum + item.total, 0),
                    total: cart.reduce((sum, item) => sum + item.total, 0),
                    date: new Date().toLocaleString()
                };
                
                localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
                
                // Clear cart
                cart = [];
                localStorage.setItem('mashtatoCart', JSON.stringify(cart));
                
                // Redirect to confirmation
                window.location.href = 'confirmation.html';
            }, 1500);
        });
    }
    
    // Form validation on input
    const requiredFields = ['customer-name', 'customer-phone', 'customer-address'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#2ECC71';
                } else {
                    this.style.borderColor = '';
                }
            });
        }
    });
}

// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon.`, 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }
    
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Form validation
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Format phone number as user types
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }
            
            this.value = value;
        });
    }
});

// Form validation functions
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.id === 'phone' && value) {
        const phoneRegex = /^(\+?6?01)[0-9]-?[0-9]{7,8}$/;
        const cleanPhone = value.replace(/-/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            errorMessage = 'Please enter a valid Malaysian phone number';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 5px;
        font-weight: 600;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe mission cards
    document.querySelectorAll('.mission-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Observe feature items
    document.querySelectorAll('.feature-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(item);
    });

    // Observe team members
    document.querySelectorAll('.team-member').forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(30px)';
        member.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(member);
    });

    // Add hover effects to mission cards
    const missionCards = document.querySelectorAll('.mission-card');
    missionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Counter animation for stats (if we add stats in the future)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Add click animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.about-hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});


// Add this function to your existing script.js

// Topping Selection with Image Change
function initializeToppingSelection() {
    const toppingOptions = document.querySelectorAll('.topping-option');
    const productImage = document.getElementById('product-image');
    const toppingTag = document.getElementById('topping-tag');
    
    toppingOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            toppingOptions.forEach(opt => {
                opt.classList.remove('selected');
                opt.style.transform = 'scale(1)';
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            this.style.transform = 'scale(1.05)';
            
            // Get the image path and topping name
            const imagePath = this.getAttribute('data-image');
            const toppingName = this.querySelector('h4').textContent;
            
            // Change the product image with fade animation
            changeProductImage(imagePath, toppingName);
            
            // Reset animation after completion
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Function to change product image with smooth transition
    function changeProductImage(imagePath, toppingName) {
        // Add fade-out class
        productImage.classList.add('fade-out');
        
        setTimeout(() => {
            // Change image source
            productImage.style.backgroundImage = `url('${imagePath}')`;
            
            // Update topping tag
            toppingTag.textContent = toppingName;
            
            // Remove fade-out and add fade-in class
            productImage.classList.remove('fade-out');
            productImage.classList.add('fade-in');
            
            setTimeout(() => {
                productImage.classList.remove('fade-in');
            }, 300);
        }, 300);
    }
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing DOMContentLoaded code...
    
    // Initialize topping selection with image change
    initializeToppingSelection();
    
    // Rest of your existing code...
});
