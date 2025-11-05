// ========================================
// UNIFIED CART SYSTEM FOR BYTEBITES
// Single cart button in navbar with sliding sidebar
// ========================================

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartBadge();
    attachAddToCartListeners();
});

// Toggle cart sidebar visibility
function toggleCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        renderCartSidebar();
    }
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Update cart badge count
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Attach event listeners to all "Add to Cart" buttons
function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const itemName = this.dataset.itemName;
            const itemPrice = parseFloat(this.dataset.itemPrice);
            const itemType = this.dataset.itemType;
            
            addItemToCart(itemId, itemName, itemPrice, itemType);
        });
    });
}

// Add item to cart
function addItemToCart(id, name, price, type) {
    let cart = getCart();
    
    // Check if item already exists
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`${name} quantity updated!`);
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            type: type,
            quantity: 1
        });
        showToast(`${name} added to cart!`);
    }
    
    saveCart(cart);
    
    // If sidebar is open, refresh it
    if (document.getElementById('cartSidebar').classList.contains('active')) {
        renderCartSidebar();
    }
}

// Render cart sidebar content
function renderCartSidebar() {
    const cart = getCart();
    const contentDiv = document.getElementById('cartSidebarContent');
    
    if (cart.length === 0) {
        contentDiv.innerHTML = `
            <div class="empty-cart-sidebar">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add items to get started!</p>
            </div>
        `;
        updateSidebarTotals(0, 0, 0);
        return;
    }
    
    // Render cart items
    contentDiv.innerHTML = cart.map(item => `
        <div class="cart-sidebar-item">
            <div class="item-info">
                <span class="item-type-badge ${item.type}">${item.type === 'veg' ? '🟢' : '🔴'}</span>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">₹${item.price}</p>
                </div>
            </div>
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateItemQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="item-total-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Calculate and update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 40;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    updateSidebarTotals(subtotal, tax, total);
}

// Update sidebar totals
function updateSidebarTotals(subtotal, tax, total) {
    const subtotalEl = document.getElementById('sidebarSubtotal');
    const taxEl = document.getElementById('sidebarTax');
    const totalEl = document.getElementById('sidebarTotal');
    
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
    let cart = getCart();
    
    if (newQuantity <= 0) {
        // Remove item if quantity is 0
        cart = cart.filter(item => item.id !== itemId);
        showToast('Item removed from cart');
    } else {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    saveCart(cart);
    renderCartSidebar();
}

// Remove item from cart
function removeItemFromCart(itemId) {
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);
    
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    renderCartSidebar();
    
    if (item) {
        showToast(`${item.name} removed from cart`);
    }
}

// Load cart from storage (for compatibility)
function loadCartFromStorage() {
    updateCartBadge();
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    // Close sidebar and redirect to checkout page
    toggleCartSidebar();
    window.location.href = '/cart';
}

// Show toast notification
function showToast(message) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close sidebar when clicking outside
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-icon-btn');
    
    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(event.target) && !cartBtn.contains(event.target)) {
            // Don't close if clicking inside sidebar or on cart button
            const overlay = document.getElementById('cartOverlay');
            if (event.target === overlay) {
                toggleCartSidebar();
            }
        }
    }
});
