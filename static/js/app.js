// Initialize everything after DOM is loaded
// Cart State
let cart = [];
let cartTotal = 0;
let currentUser = null;
let cartItemsContainer = null;
let cartTotalElement = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mainContent = document.getElementById('main-content');
    const navCartCount = document.getElementById('nav-cart-count');
    const floatingCart = document.getElementById('floating-cart');
    const floatingCartItemCount = document.getElementById('floating-cart-item-count');
    cartItemsContainer = document.getElementById('cartItems');
    cartTotalElement = document.getElementById('cartTotal');

    // Initialize the app
    bindViewMenuButtons();
    updateCartDisplay();
});

// Bind event listeners to dynamic elements
function bindViewMenuButtons() {
    document.querySelectorAll('.view-menu-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const restaurantId = e.target.dataset.restaurantId;
            if (restaurantId) {
                navigateToRestaurant(restaurantId);
            }
        });
    });
}

function updateCartDisplay() {
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = '';
    cartTotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        totalItems += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${formatItemName(item.id)}</h4>
                    <span class="${item.type}-tag">${item.type === 'veg' ? '🟢' : '🔴'}</span>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    cartTotalElement.textContent = `₹${cartTotal}`;
}

// Navigation Functions
function navigateToRestaurant(restaurantId) {
    window.location.href = `/restaurant/${restaurantId}`;
}

// Restaurant Filtering
function filterRestaurants(type) {
    const restaurants = document.querySelectorAll('.restaurant-card');
    restaurants.forEach(restaurant => {
        if (type === 'all' || restaurant.dataset.type === type) {
            restaurant.style.display = 'block';
        } else {
            restaurant.style.display = 'none';
        }
    });
}

// Cart Functions
function addToCart(itemId, price, type) {
    try {
        if (!itemId || !price || !type) {
            showToast('Invalid item details', 'error');
            return;
        }

        const existingItem = cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showToast(`Added another ${formatItemName(itemId)} to cart`, 'success');
        } else {
            cart.push({
                id: itemId,
                price: parseFloat(price),
                type: type,
                quantity: 1
            });
            showToast(`${formatItemName(itemId)} added to cart`, 'success');
        }
        
        updateCartDisplay();
        
        // Show cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('open');
            setTimeout(() => cartSidebar.classList.remove('open'), 2000); // Auto-hide after 2 seconds
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart', 'error');
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        }
    }
    updateCart();
}

function updateCart() {
    if (!cartItems || !cartTotalElement) return;
    
    cartItems.innerHTML = '';
    cartTotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;
        totalItems += item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${formatItemName(item.id)}</h4>
                    <span class="${item.type}-tag">${item.type === 'veg' ? '🟢' : '🔴'}</span>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    });

    if (navCartCount) navCartCount.textContent = totalItems;
    if (floatingCartItemCount) floatingCartItemCount.textContent = totalItems;
    cartTotalElement.textContent = `₹${cartTotal}`;
}

function formatItemName(itemId) {
    return itemId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function toggleCart() {
    const cart = document.getElementById('cartSidebar');
    if (cart) {
        cart.classList.toggle('open');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Here you would typically redirect to a checkout page
    showNotification('Proceeding to checkout...');
}

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const restaurants = document.querySelectorAll('.restaurant-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter restaurants
            restaurants.forEach(restaurant => {
                if (filter === 'all' || restaurant.getAttribute('data-type') === filter) {
                    restaurant.style.display = 'block';
                } else {
                    restaurant.style.display = 'none';
                }
            });
        });
    });
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        opacity: 0;
        transition: all 0.3s;
        z-index: 1001;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 24px;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transition: all 0.3s;
        z-index: 1001;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .toast.success {
        background-color: #4CAF50;
    }
    
    .toast.error {
        background-color: #F44336;
    }
    
    .toast.info {
        background-color: #2196F3;
    }
    
    .toast.warning {
        background-color: #FFC107;
        color: #333;
    }
`;
document.head.appendChild(notificationStyles);

// Helper function to create HTML elements
function createHTMLElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'onclick') {
            element.onclick = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Add children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

cart = [];

// Helper function to format price
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

let restaurantDataCache = {}; // Cache restaurant data to avoid repeated API calls
let currentRestaurantId = null; // Track currently viewed restaurant for cart updates

// --- Authentication UI Update ---
async function updateAuthUI() {
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navRegisterBtn = document.getElementById('nav-register-btn');
    const navProfileBtn = document.getElementById('nav-profile-btn');
    const navOrdersBtn = document.getElementById('nav-orders-btn');
    const navLogoutBtn = document.getElementById('nav-logout-btn');

    try {
        currentUser = await api.getCurrentUser();
    } catch (error) {
        currentUser = null; // Not authenticated or error
        console.warn("User not authenticated or session expired.");
    }

    if (currentUser) {
        navLoginBtn.style.display = 'none';
        navRegisterBtn.style.display = 'none';
        navProfileBtn.style.display = 'flex'; // Use flex for icon + text alignment
        navOrdersBtn.style.display = 'flex';
        navLogoutBtn.style.display = 'inline-block';
        navProfileBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.username}`;
    } else {
        navLoginBtn.style.display = 'inline-block';
        navRegisterBtn.style.display = 'inline-block';
        navProfileBtn.style.display = 'none';
        navOrdersBtn.style.display = 'none';
        navLogoutBtn.style.display = 'none';
    }
    updateCartUI(); // Update cart count after auth status is known
}

// --- Cart UI Update ---
async function updateCartUI() {
    if (!currentUser) {
        navCartCount.textContent = '0';
        floatingCartItemCount.textContent = '0';
        floatingCart.style.display = 'none'; // Hide if not logged in
        return;
    }
    try {
        cartItems = await api.getCart();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        navCartCount.textContent = totalItems;
        floatingCartItemCount.textContent = totalItems;

        // Show floating cart only on restaurant menu page and if there are items
        // The condition `window.location.hash.startsWith` ensures it appears only when relevant
        if (currentRestaurantId && totalItems > 0 && window.location.hash.startsWith(`#/restaurant/${currentRestaurantId}`)) {
            floatingCart.style.display = 'flex';
        } else {
            floatingCart.style.display = 'none';
        }

    } catch (error) {
        console.error("Failed to fetch cart:", error);
        cartItems = [];
        navCartCount.textContent = '0';
        floatingCartItemCount.textContent = '0';
        floatingCart.style.display = 'none';
    }
}

// --- Page Rendering Functions ---

// Home Page
async function renderHomePage() {
    currentRestaurantId = null; // No specific restaurant selected
    floatingCart.style.display = 'none'; // Hide floating cart on home page

    mainContent.innerHTML = `
        <div class="container hero" id="homepage-hero">
            <div class="hero-content">
                <h1 class="hero-title">Hungry? Order Food Online.</h1>
                <p class="hero-subtitle">Discover the best food & drinks in your city.</p>
                <div class="hero-search">
                    <input type="text" class="hero-search-input" id="hero-location-input" placeholder="Enter your delivery location">
                    <button class="hero-search-btn" id="hero-find-food-btn"><i class="fas fa-search"></i> Find Food</button>
                </div>
            </div>
        </div>
        <section class="categories-section container">
            <h2 class="section-title">Explore by Categories</h2>
            <div class="categories-grid" id="categories-grid">
                <p>Loading categories...</p>
            </div>
        </section>
        <section class="restaurants-section container">
            <div class="section-header">
                <h2 class="section-title">Popular Restaurants</h2>
                <div class="filter-buttons" id="restaurant-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <!-- More filters can be added here dynamically -->
                </div>
            </div>
            <div class="restaurants-grid" id="restaurants-grid">
                <p>Loading restaurants...</p>
            </div>
        </section>
    `;

    // Add event listener for hero search button
    const heroFindFoodBtn = document.getElementById('hero-find-food-btn');
    if (heroFindFoodBtn) {
        heroFindFoodBtn.addEventListener('click', () => {
            const locationInput = document.getElementById('hero-location-input');
            if (locationInput.value.trim() !== '') {
                showToast(`Searching for food near "${locationInput.value.trim()}"...`, 'info');
                // In a real app, this would trigger a search or redirect to a results page
                router.navigate('/restaurants'); // For now, just navigate to restaurants listing
            } else {
                showToast('Please enter a location!', 'warning');
            }
        });
    }


    // Load Categories
    try {
        const categories = await api.getCategories();
        const categoriesGrid = document.getElementById('categories-grid');
        if (categoriesGrid) {
            categoriesGrid.innerHTML = categories.map(cat => `
                <a href="#/restaurants?category=${cat.name}" class="category-card">
                    <i class="${cat.icon_class} category-icon" style="color: var(--primary);"></i>
                    <span class="category-name">${cat.name}</span>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error("Failed to load categories:", error);
        document.getElementById('categories-grid').innerHTML = '<p>Failed to load categories.</p>';
    }

    // Load Restaurants
    try {
        const restaurants = await api.getRestaurants();
        const restaurantsGrid = document.getElementById('restaurants-grid');
        if (restaurantsGrid) {
            restaurantsGrid.innerHTML = restaurants.map(rest => `
                <a href="#/restaurant/${rest.id}" class="restaurant-card">
                    <img src="${rest.image_url}" alt="${rest.name}" class="restaurant-image">
                    <div class="restaurant-info">
                        <h3 class="restaurant-name">${rest.name}</h3>
                        <p class="restaurant-cuisine">${rest.cuisine}</p>
                        <div class="restaurant-meta">
                            <div class="rating">
                                <i class="fas fa-star"></i> ${rest.rating}
                            </div>
                            <div class="delivery-time">${rest.delivery_time}</div>
                        </div>
                    </div>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error("Failed to load restaurants:", error);
        document.getElementById('restaurants-grid').innerHTML = '<p>Failed to load restaurants.</p>';
    }
}

// Restaurant Menu Page
async function renderRestaurantMenuPage(params) {
    const restaurantId = params.id;
    currentRestaurantId = restaurantId; // Set current restaurant ID
    floatingCart.style.display = 'flex'; // Show floating cart on menu page
    await updateCartUI(); // Update cart for potential previous items

    if (!restaurantId) {
        mainContent.innerHTML = `<div class="container"><h2 class="section-title">Restaurant ID is missing.</h2></div>`;
        return;
    }

    try {
        const restaurant = await api.getRestaurantById(restaurantId);
        if (!restaurant) {
            mainContent.innerHTML = `<div class="container"><h2 class="section-title">Restaurant not found.</h2></div>`;
            return;
        }
        restaurantDataCache[restaurantId] = restaurant; // Cache the restaurant info

        const menu = await api.getRestaurantMenu(restaurantId);

        mainContent.innerHTML = `
            <section class="restaurant-header">
                <div class="container restaurant-header-content">
                    <img src="${restaurant.image_url}" alt="${restaurant.name}" class="restaurant-header-image">
                    <div class="restaurant-header-info">
                        <h1>${restaurant.name}</h1>
                        <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                        <div class="restaurant-header-meta">
                            <div class="rating"><i class="fas fa-star"></i> ${restaurant.rating}</div>
                            <div><i class="fas fa-clock"></i> ${restaurant.delivery_time}</div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="menu-section container">
                <div class="menu-layout">
                    <aside class="menu-categories">
                        <h3>Menu Categories</h3>
                        <div id="menu-categories-list">
                            <p>Loading categories...</p>
                        </div>
                    </aside>
                    <div class="menu-content">
                        <div class="menu-search">
                            <input type="text" class="menu-search-input" id="menu-search-input" placeholder="Search in menu...">
                        </div>
                        <div id="menu-items-container">
                            <p>Loading menu items...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        const menuCategoriesList = document.getElementById('menu-categories-list');
        const menuItemsContainer = document.getElementById('menu-items-container');
        const menuSearchInput = document.getElementById('menu-search-input');

        const renderMenu = (filteredMenu) => {
            menuItemsContainer.innerHTML = ''; // Clear previous items
            if (Object.keys(filteredMenu).length === 0) {
                menuItemsContainer.innerHTML = '<p class="text-light" style="padding: 2rem; text-align: center;">No menu items found matching your search.</p>';
                return;
            }
            Object.keys(filteredMenu).forEach(categoryName => {
                const categorySection = createHTMLElement('div', { class: 'menu-category-section', id: `category-${categoryName.replace(/\s/g, '-')}` }, [
                    createHTMLElement('h2', { class: 'section-title' }, [categoryName]),
                    createHTMLElement('div', { class: 'menu-items-grid' },
                        filteredMenu[categoryName].map(item => createMenuItemCard(item))
                    )
                ]);
                menuItemsContainer.appendChild(categorySection);
            });
        };

        renderMenu(menu); // Initial render of all menu items

        // Render menu categories sidebar
        menuCategoriesList.innerHTML = Object.keys(menu).map(catName => `
            <div class="category-item" data-category="${catName}">${catName}</div>
        `).join('');

        // Event listeners for category filtering/scrolling
        menuCategoriesList.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                menuCategoriesList.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                const targetSection = document.getElementById(`category-${category.replace(/\s/g, '-')}`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Search functionality
        menuSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredMenu = {};
            for (const categoryName in menu) {
                const items = menu[categoryName].filter(item =>
                    item.name.toLowerCase().includes(searchTerm) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm))
                );
                if (items.length > 0) {
                    filteredMenu[categoryName] = items;
                }
            }
            renderMenu(filteredMenu);
        });

    } catch (error) {
        mainContent.innerHTML = `<div class="container"><h2 class="section-title">Error loading restaurant menu.</h2><p>${error.message}</p></div>`;
        console.error("Failed to load restaurant menu:", error);
    }
}

function createMenuItemCard(item) {
    const isInCart = cartItems.some(cartItem => cartItem.menu_item_id === item.id);
    return createHTMLElement('div', { class: 'menu-item' }, [
        createHTMLElement('img', { src: item.image_url || 'https://via.placeholder.com/120x120?text=Food', alt: item.name, class: 'menu-item-image' }),
        createHTMLElement('div', { class: 'menu-item-info' }, [
            createHTMLElement('div', { class: 'menu-item-header' }, [
                createHTMLElement('h4', { class: 'menu-item-name' }, [item.name]),
                createHTMLElement('span', { class: `veg-badge ${item.is_veg ? '' : 'non-veg-badge'}` })
            ]),
            createHTMLElement('p', { class: 'menu-item-description' }, [item.description]),
            createHTMLElement('div', { class: 'menu-item-footer' }, [
                createHTMLElement('span', { class: 'menu-item-price' }, [formatPrice(item.price)]),
                createHTMLElement('button', {
                    class: 'add-to-cart-btn',
                    'data-item-id': item.id,
                    onclick: async (e) => {
                        e.stopPropagation(); // Prevent card click from interfering
                        if (!currentUser) {
                            showToast("Please log in to add items to cart.", 'info');
                            router.navigate('/login');
                            return;
                        }
                        try {
                            await api.addToCart({ menu_item_id: item.id, quantity: 1 });
                            showToast(`${item.name} added to cart!`, 'success');
                            updateCartUI(); // Refresh cart count and floating cart visibility
                        } catch (error) {
                            showToast(error.message || `Failed to add ${item.name} to cart.`, 'error');
                        }
                    }
                }, [isInCart ? 'Added' : 'Add']) // Dynamic button text
            ])
        ])
    ]);
}

// Cart Page
async function renderCartPage() {
    currentRestaurantId = null; // Not on a specific restaurant page
    floatingCart.style.display = 'none'; // Hide floating cart on cart page

    if (!currentUser) {
        mainContent.innerHTML = `
            <section class="cart-section container">
                <h2 class="page-title">Your Cart</h2>
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart empty-cart-icon"></i>
                    <h3>Your cart is empty!</h3>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <button class="btn-primary" onclick="router.navigate('/')">Start Shopping</button>
                    <button class="btn-secondary" onclick="router.navigate('/login')">Login to view cart</button>
                </div>
            </section>
        `;
        return;
    }

    await updateCartUI(); // Ensure cartItems is fresh

    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const deliveryFee = total > 0 ? 5.00 : 0; // Example flat delivery fee
    const tax = total > 0 ? total * 0.08 : 0; // Example 8% tax
    const grandTotal = total + deliveryFee + tax;

    mainContent.innerHTML = `
        <section class="cart-section container">
            <h2 class="page-title">Your Cart</h2>
            <div class="cart-layout">
                <div class="cart-items" id="cart-items-list">
                    <!-- Cart items dynamically loaded here -->
                </div>
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row"><span>Item Total</span><span>${formatPrice(total)}</span></div>
                    <div class="summary-row"><span>Delivery Fee</span><span>${formatPrice(deliveryFee)}</span></div>
                    <div class="summary-row"><span>Taxes & Charges</span><span>${formatPrice(tax)}</span></div>
                    <div class="summary-divider"></div>
                    <div class="summary-row total"><span>To Pay</span><span id="grand-total">${formatPrice(grandTotal)}</span></div>

                    <div class="delivery-section">
                        <h4>Delivery Address</h4>
                        <textarea id="deliveryAddress" rows="3" placeholder="Enter your delivery address...">${currentUser.address || ''}</textarea>
                    </div>

                    <div class="payment-section">
                        <h4>Payment Options</h4>
                        <div class="payment-options">
                            <label class="payment-option">
                                <input type="radio" name="paymentMethod" value="cod" checked>
                                Cash on Delivery
                            </label>
                            <label class="payment-option">
                                <input type="radio" name="paymentMethod" value="card" disabled>
                                Credit/Debit Card (Coming Soon)
                            </label>
                        </div>
                    </div>
                    <button class="btn-checkout" id="checkout-btn" ${cartItems.length === 0 ? 'disabled' : ''}>Proceed to Checkout</button>
                </div>
            </div>
        </section>
    `;

    const cartItemsList = document.getElementById('cart-items-list');
    const checkoutBtn = document.getElementById('checkout-btn');
    const deliveryAddressInput = document.getElementById('deliveryAddress');

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart" style="grid-column: 1 / -1;">
                <i class="fas fa-shopping-cart empty-cart-icon"></i>
                <h3>Your cart is empty!</h3>
                <p>Add some delicious food from your favorite restaurants.</p>
                <button class="btn-primary" onclick="router.navigate('/')">Start Shopping</button>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        cartItems.forEach(item => {
            const cartItemElement = createHTMLElement('div', { class: 'cart-item' }, [
                createHTMLElement('img', { src: item.image_url || 'https://via.placeholder.com/100x100?text=Food', alt: item.name, class: 'cart-item-image' }),
                createHTMLElement('div', { class: 'cart-item-info' }, [
                    createHTMLElement('h4', { class: 'cart-item-name' }, [item.name]),
                    createHTMLElement('p', { class: 'cart-item-restaurant' }, [item.restaurant_name]),
                    createHTMLElement('p', { class: 'cart-item-price' }, [formatPrice(item.price)]),
                    createHTMLElement('div', { class: 'quantity-controls' }, [
                        createHTMLElement('button', {
                            class: 'quantity-btn',
                            onclick: () => updateCartItemQuantity(item.cart_item_id, item.quantity - 1)
                        }, ['-']),
                        createHTMLElement('span', { class: 'quantity' }, [item.quantity]),
                        createHTMLElement('button', {
                            class: 'quantity-btn',
                            onclick: () => updateCartItemQuantity(item.cart_item_id, item.quantity + 1)
                        }, ['+']),
                        createHTMLElement('button', {
                            class: 'remove-btn',
                            onclick: () => removeCartItem(item.cart_item_id)
                        }, ['Remove'])
                    ])
                ])
            ]);
            cartItemsList.appendChild(cartItemElement);
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const address = deliveryAddressInput.value.trim();
            if (!address) {
                showToast("Please enter a delivery address.", 'warning');
                return;
            }

            try {
                const response = await api.checkout({
                    delivery_address: address,
                    payment_method: 'cod' // Hardcoded for now
                });
                showToast(response.message, 'success');
                document.getElementById('modal-order-id').textContent = `#ORD${response.order_id}`;
                showModal('order-success-modal');
                updateCartUI(); // Clear cart count (cart should be empty after checkout)
            } catch (error) {
                showToast(error.message || "Failed to place order.", 'error');
            }
        });
    }
}

async function updateCartItemQuantity(cartItemId, newQuantity) {
    if (newQuantity < 0) return; // Prevent negative quantity
    try {
        await api.updateCartItem({ cart_item_id: cartItemId, quantity: newQuantity });
        showToast("Cart updated!", 'info');
        router.navigate('/cart'); // Re-render cart page to reflect changes
    } catch (error) {
        showToast(error.message || "Failed to update cart item.", 'error');
    }
}

async function removeCartItem(cartItemId) {
    try {
        await api.removeCartItem(cartItemId);
        showToast("Item removed from cart.", 'success');
        router.navigate('/cart'); // Re-render cart page
    } catch (error) {
        showToast(error.message || "Failed to remove item from cart.", 'error');
    }
}

// Orders Page
async function renderOrdersPage() {
    currentRestaurantId = null;
    floatingCart.style.display = 'none';

    if (!currentUser) {
        mainContent.innerHTML = `
            <section class="orders-section container">
                <h2 class="page-title">Your Orders</h2>
                <div class="empty-orders">
                    <i class="fas fa-receipt empty-orders-icon"></i>
                    <h3>You have no orders yet!</h3>
                    <p>Looks like you haven't ordered anything yet. Start exploring delicious food!</p>
                    <button class="btn-primary" onclick="router.navigate('/')">Start Shopping</button>
                    <button class="btn-secondary" onclick="router.navigate('/login')">Login to view orders</button>
                </div>
            </section>
        `;
        return;
    }

    mainContent.innerHTML = `
        <section class="orders-section container">
            <h2 class="page-title">Your Orders</h2>
            <div class="orders-container" id="orders-list">
                <p>Loading your orders...</p>
            </div>
        </section>
    `;

    try {
        const orders = await api.getUserOrders();
        const ordersList = document.getElementById('orders-list');
        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-receipt empty-orders-icon"></i>
                    <h3>You have no orders yet!</h3>
                    <p>Looks like you haven't ordered anything yet. Start exploring delicious food!</p>
                    <button class="btn-primary" onclick="router.navigate('/')">Start Shopping</button>
                </div>
            `;
        } else {
            ordersList.innerHTML = orders.map(order => createOrderCard(order)).join('');
        }
    } catch (error) {
        mainContent.innerHTML = `<section class="orders-section container"><h2 class="page-title">Your Orders</h2><p>Error loading orders: ${error.message}</p></section>`;
        console.error("Failed to load user orders:", error);
    }
}

function createOrderCard(order) {
    const orderDate = new Date(order.order_date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const getOrderStatusClass = (status) => {
        switch(status) {
            case 'pending': return 'pending';
            case 'confirmed': return 'confirmed';
            case 'preparing': return 'preparing';
            case 'on_the_way': return 'on_the_way';
            case 'delivered': return 'delivered';
            case 'cancelled': return 'cancelled';
            default: return '';
        }
    };

    const statusClass = getOrderStatusClass(order.status);
    const orderStatusMapping = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'on_the_way': 'On the Way',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };

    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h4>Order ID: #${order.id}</h4>
                    <p class="order-date">${orderDate}</p>
                    <p>${order.restaurant_name}</p>
                </div>
                <span class="order-status ${statusClass}">${orderStatusMapping[order.status]}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.quantity} x ${item.name}</span>
                        <span>${formatPrice(item.quantity * item.price_at_order)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">
                    <span>Total:</span>
                    <span class="price">${formatPrice(order.total_amount)}</span>
                </div>
                <div class="order-actions">
                    <a href="#/order-details/${order.id}" class="btn-track">View Details</a>
                    <!-- Add more actions like Reorder, Help etc. -->
                </div>
            </div>
        </div>
    `;
}

// Order Details Page
async function renderOrderDetailsPage(params) {
    const orderId = params.id;
    currentRestaurantId = null;
    floatingCart.style.display = 'none';

    if (!currentUser) {
        mainContent.innerHTML = `
            <section class="orders-section container">
                <h2 class="page-title">Order Details</h2>
                <p>Please log in to view order details.</p>
                <button class="btn-primary" onclick="router.navigate('/login')">Login</button>
            </section>
        `;
        return;
    }

    mainContent.innerHTML = `
        <section class="orders-section container">
            <h2 class="page-title">Order Details #${orderId}</h2>
            <div id="order-details-content">
                <p>Loading order details...</p>
            </div>
        </section>
    `;

    try {
        const order = await api.getOrderById(orderId);
        if (!order) {
            mainContent.innerHTML = `
                <section class="orders-section container">
                    <h2 class="page-title">Order Details</h2>
                    <p>Order not found or you don't have permission to view it.</p>
                </section>
            `;
            return;
        }

        const orderDate = new Date(order.order_date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const getStatusStep = (status) => {
            const statusMap = {
                'pending': 1,
                'confirmed': 2,
                'preparing': 3,
                'on_the_way': 4,
                'delivered': 5
            };
            return statusMap[status] || 1;
        };
        const currentStep = getStatusStep(order.status);

        document.getElementById('order-details-content').innerHTML = `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h4>Order from: ${order.restaurant_name}</h4>
                        <p class="order-date">${orderDate}</p>
                    </div>
                    <span class="order-status ${order.status}">${order.status.replace(/_/g, ' ').toUpperCase()}</span>
                </div>

                <div class="order-progress">
                    <div class="progress-step ${currentStep >= 1 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-clipboard-list"></i></div>
                        <span class="step-label">Order Placed</span>
                    </div>
                    <div class="progress-line ${currentStep >= 2 ? 'active' : ''}"></div>
                    <div class="progress-step ${currentStep >= 2 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                        <span class="step-label">Confirmed</span>
                    </div>
                    <div class="progress-line ${currentStep >= 3 ? 'active' : ''}"></div>
                    <div class="progress-step ${currentStep >= 3 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-utensils"></i></div>
                        <span class="step-label">Preparing</span>
                    </div>
                    <div class="progress-line ${currentStep >= 4 ? 'active' : ''}"></div>
                    <div class="progress-step ${currentStep >= 4 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-motorcycle"></i></div>
                        <span class="step-label">On the Way</span>
                    </div>
                    <div class="progress-line ${currentStep >= 5 ? 'active' : ''}"></div>
                    <div class="progress-step ${currentStep >= 5 ? 'active' : ''}">
                        <div class="step-icon"><i class="fas fa-home"></i></div>
                        <span class="step-label">Delivered</span>
                    </div>
                </div>

                <h4 style="margin-top: 2rem;">Items in this order:</h4>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div>
                                <span>${item.quantity} x ${item.name}</span>
                                <p class="text-light" style="font-size: 0.85rem;">${item.description}</p>
                            </div>
                            <span>${formatPrice(item.quantity * item.price_at_order)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <span>Total Paid:</span>
                        <span class="price">${formatPrice(order.total_amount)}</span>
                    </div>
                    <div>
                        <h4>Deliver To:</h4>
                        <p>${order.delivery_address}</p>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                 <button class="btn-primary" onclick="router.navigate('/orders')">Back to Orders</button>
            </div>
        `;

    } catch (error) {
        document.getElementById('order-details-content').innerHTML = `<p>Error loading order details: ${error.message}</p>`;
        console.error("Failed to load order details:", error);
    }
}

// Login Page
async function renderLoginPage() {
    currentRestaurantId = null;
    floatingCart.style.display = 'none';

    mainContent.innerHTML = `
        <section class="auth-section container">
            <h2 class="page-title">Login to FlavorFleet</h2>
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-username">Username:</label>
                    <input type="text" id="login-username" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password:</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
                <p>Don't have an account? <a href="#/register">Register here</a></p>
            </form>
        </section>
    `;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await api.login({ username, password });
            showToast(response.message, 'success');
            await updateAuthUI();
            router.navigate('/'); // Redirect to home page
        } catch (error) {
            showToast(error.message || "Login failed!", 'error');
        }
    });
}

// Register Page
async function renderRegisterPage() {
    currentRestaurantId = null;
    floatingCart.style.display = 'none';

    mainContent.innerHTML = `
        <section class="auth-section container">
            <h2 class="page-title">Register for FlavorFleet</h2>
            <form id="register-form" class="auth-form">
                <div class="form-group">
                    <label for="register-username">Username:</label>
                    <input type="text" id="register-username" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email:</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Password:</label>
                    <input type="password" id="register-password" required>
                </div>
                <div class="form-group">
                    <label for="register-confirm-password">Confirm Password:</label>
                    <input type="password" id="register-confirm-password" required>
                </div>
                <div class="form-group">
                    <label for="register-address">Delivery Address:</label>
                    <textarea id="register-address" rows="3" placeholder="Enter your delivery address (optional)"></textarea>
                </div>
                <button type="submit" class="btn-primary">Create Account</button>
                <p>Already have an account? <a href="#/login">Login here</a></p>
            </form>
        </section>
    `;

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const address = document.getElementById('register-address').value.trim();

        if (!username || !email || !password) {
            showToast("All required fields must be filled.", 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match!", 'error');
            return;
        }

        try {
            const response = await api.register({ username, email, password, address });
            showToast(response.message || "Registration successful!", 'success');
            await updateAuthUI();
            router.navigate('/login');
        } catch (error) {
            showToast(error.message || "Registration failed. Please try again.", 'error');
        }
    });
}
