from flask import Flask, render_template, redirect, url_for, request, session
import os
import json
from flask import jsonify
from flask_cors import CORS

template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'templates'))
static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static'))
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.secret_key = 'dev-secret-key-change-in-production'
CORS(app)

# Load restaurant data
def load_data():
    data_file = os.path.join(os.path.dirname(__file__), 'data.json')
    if os.path.exists(data_file):
        with open(data_file, 'r') as f:
            return json.load(f)
    return {"restaurants": [], "menu_items": []}

data = load_data()

@app.route('/')
def home():
    restaurants = data.get('restaurants', [])
    return render_template('index.html', restaurants=restaurants)

@app.route('/restaurant/<id>')
def restaurant(id):
    restaurant = next((r for r in data['restaurants'] if r['id'] == id), None)
    if restaurant:
        menu_items = [item for item in data['menu_items'] if item['restaurant_id'] == id]
        return render_template('restaurant.html', restaurant=restaurant, menu_items=menu_items)
    return redirect(url_for('home'))

@app.route('/api/restaurants')
def get_restaurants():
    return jsonify(data['restaurants'])

@app.route('/api/menu-items')
def get_menu_items():
    restaurant_id = request.args.get('restaurant_id')
    if restaurant_id:
        items = [item for item in data['menu_items'] if item['restaurant_id'] == restaurant_id]
    else:
        items = data['menu_items']
    return jsonify(items)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # In a real app, verify credentials against database
        if email and password:
            session['user'] = email
            session['user_name'] = email.split('@')[0]  # Use part before @ as display name
            return redirect(url_for('home'))
        else:
            return render_template('login.html', error='Invalid credentials')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        fullName = request.form.get('fullName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        
        # In a real app, save user to database with hashed password
        if fullName and email and phone and password:
            session['user'] = email
            session['user_name'] = fullName  # Store the full name
            return redirect(url_for('home'))
        else:
            return render_template('signup.html', error='All fields are required')
    
    return render_template('signup.html')

@app.route('/logout')
def logout_page():
    session.pop('user', None)
    session.pop('user_name', None)
    return redirect(url_for('home'))

@app.route('/cart')
def cart():
    return render_template('cart.html')

# API endpoints for authentication
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.json
    # Basic validation
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # In a real app, you'd save to database and hash password
    return jsonify({
        'message': 'Registration successful',
        'user': {
            'username': data['username'],
            'email': data['email']
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing credentials'}), 400
    
    # In a real app, verify credentials against database
    session['user'] = data['email']
    return jsonify({
        'message': 'Login successful',
        'user': {
            'email': data['email']
        }
    }), 200

@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/user')
def api_get_user():
    if 'user' in session:
        return jsonify({'email': session['user']}), 200
    return jsonify({'message': 'Not authenticated'}), 401

# API endpoints for categories
@app.route('/api/categories')
def api_get_categories():
    categories = [
        {'id': 1, 'name': 'North Indian', 'icon_class': 'fas fa-pepper-hot'},
        {'id': 2, 'name': 'Chinese', 'icon_class': 'fas fa-dragon'},
        {'id': 3, 'name': 'Pizza', 'icon_class': 'fas fa-pizza-slice'},
        {'id': 4, 'name': 'Biryani', 'icon_class': 'fas fa-bowl-rice'},
        {'id': 5, 'name': 'Italian', 'icon_class': 'fas fa-pasta'}
    ]
    return jsonify(categories)

@app.route('/api/restaurants/<id>')
def api_get_restaurant(id):
    restaurant = next((r for r in data['restaurants'] if r['id'] == id), None)
    if restaurant:
        return jsonify(restaurant)
    return jsonify({'message': 'Restaurant not found'}), 404

@app.route('/api/restaurants/<id>/menu')
def api_get_restaurant_menu(id):
    menu_items = [item for item in data['menu_items'] if item['restaurant_id'] == id]
    return jsonify(menu_items)

# API endpoints for cart
@app.route('/api/cart')
def api_get_cart():
    # In a real app, get cart from database based on user session
    cart = session.get('cart', {'items': [], 'total': 0})
    return jsonify(cart)

@app.route('/api/cart/add', methods=['POST'])
def api_add_to_cart():
    data = request.json
    if not data or not data.get('id'):
        return jsonify({'message': 'Invalid item data'}), 400
    
    cart = session.get('cart', {'items': [], 'total': 0})
    
    # Check if item already exists in cart
    existing_item = next((item for item in cart['items'] if item['id'] == data['id']), None)
    if existing_item:
        existing_item['quantity'] = existing_item.get('quantity', 1) + 1
    else:
        cart['items'].append({
            'id': data['id'],
            'name': data.get('name', ''),
            'price': data.get('price', 0),
            'quantity': 1,
            'restaurant_id': data.get('restaurant_id', '')
        })
    
    # Recalculate total
    cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
    session['cart'] = cart
    
    return jsonify({'message': 'Item added to cart', 'cart': cart}), 200

@app.route('/api/cart/update', methods=['PUT'])
def api_update_cart_item():
    data = request.json
    if not data or not data.get('id'):
        return jsonify({'message': 'Invalid item data'}), 400
    
    cart = session.get('cart', {'items': [], 'total': 0})
    item = next((item for item in cart['items'] if item['id'] == data['id']), None)
    
    if item:
        item['quantity'] = data.get('quantity', item['quantity'])
        cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
        session['cart'] = cart
        return jsonify({'message': 'Cart updated', 'cart': cart}), 200
    
    return jsonify({'message': 'Item not found in cart'}), 404

@app.route('/api/cart/remove/<item_id>', methods=['DELETE'])
def api_remove_cart_item(item_id):
    cart = session.get('cart', {'items': [], 'total': 0})
    cart['items'] = [item for item in cart['items'] if item['id'] != item_id]
    cart['total'] = sum(item['price'] * item['quantity'] for item in cart['items'])
    session['cart'] = cart
    
    return jsonify({'message': 'Item removed', 'cart': cart}), 200

# API endpoints for orders
@app.route('/api/checkout', methods=['POST'])
def api_checkout():
    data = request.json
    
    # Get items from request (sent from frontend cart)
    items = data.get('items', [])
    
    if not items:
        return jsonify({'message': 'Cart is empty'}), 400
    
    # In a real app, create order in database
    import time
    order = {
        'id': 'ORD' + str(int(time.time())),
        'items': items,
        'total': data.get('total', 0),
        'delivery_address': data.get('delivery_address', ''),
        'status': 'pending'
    }
    
    # Clear session cart if it exists
    session['cart'] = {'items': [], 'total': 0}
    
    return jsonify({'message': 'Order placed successfully', 'order': order}), 201

@app.route('/api/orders')
def api_get_orders():
    # In a real app, get orders from database
    orders = []
    return jsonify(orders)

@app.route('/api/orders/<order_id>')
def api_get_order(order_id):
    # In a real app, get order from database
    return jsonify({'message': 'Order not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)