const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Or your deployed backend URL

async function fetchData(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `API error: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        showToast(error.message || "An unexpected error occurred!", 'error');
        throw error; // Re-throw to be handled by the caller
    }
}

export const api = {
    // Auth & User
    register: (userData) => fetchData('/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => fetchData('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => fetchData('/logout', { method: 'POST' }),
    getCurrentUser: () => fetchData('/user'),

    // Restaurants & Categories
    getRestaurants: () => fetchData('/restaurants'),
    getRestaurantById: (id) => fetchData(`/restaurants/${id}`),
    getRestaurantMenu: (id) => fetchData(`/restaurants/${id}/menu`),
    getCategories: () => fetchData('/categories'),

    // Cart
    getCart: () => fetchData('/cart'),
    addToCart: (item) => fetchData('/cart/add', { method: 'POST', body: JSON.stringify(item) }),
    updateCartItem: (cartItem) => fetchData('/cart/update', { method: 'PUT', body: JSON.stringify(cartItem) }),
    removeCartItem: (cartItemId) => fetchData(`/cart/remove/${cartItemId}`, { method: 'DELETE' }),

    // Orders
    checkout: (orderDetails) => fetchData('/checkout', { method: 'POST', body: JSON.stringify(orderDetails) }),
    getUserOrders: () => fetchData('/orders'),
    getOrderById: (orderId) => fetchData(`/orders/${orderId}`),
};