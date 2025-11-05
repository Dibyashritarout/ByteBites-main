document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const itemName = this.dataset.itemName;
            const itemPrice = parseFloat(this.dataset.itemPrice);
            const itemType = this.dataset.itemType;
            addToCart(itemId, itemName, itemPrice, itemType);
        });
    });

    // Initialize cart UI
    updateCartUI();
});

function addToCart(itemId, itemName, price, type) {
    // Get existing cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        // If item exists, increment quantity
        existingItem.quantity += 1;
    } else {
        // If item doesn't exist, add new item
        cart.push({
            id: itemId,
            name: itemName,
            price: price,
            type: type,
            quantity: 1
        });
    }
    
    // Save updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    updateCartUI();
    
    // Show success message
    showToast('Item added to cart!');
}

function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart count
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Update cart total
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = `₹${cartTotal}`;
    }
    
    // Update cart items list
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function updateQuantity(itemId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        cart = cart.filter(item => item.id !== itemId);
    } else {
        // Update quantity
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Reload cart page if we're on it
    if (typeof loadCart === 'function') {
        loadCart();
    }
}

function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.toggle('show');
        // Update cart UI when showing the modal
        if (cartModal.classList.contains('show')) {
            updateCartUI();
        }
    }
}