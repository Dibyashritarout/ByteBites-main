import sqlite3
import json

DATABASE = 'database.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Drop existing tables to start fresh for development
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS restaurants")
    cursor.execute("DROP TABLE IF EXISTS categories")
    cursor.execute("DROP TABLE IF EXISTS menu_items")
    cursor.execute("DROP TABLE IF EXISTS carts")
    cursor.execute("DROP TABLE IF EXISTS cart_items")
    cursor.execute("DROP TABLE IF EXISTS orders")
    cursor.execute("DROP TABLE IF EXISTS order_items")

    # Create tables
    cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            address TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE restaurants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cuisine TEXT NOT NULL,
            rating REAL NOT NULL,
            delivery_time TEXT NOT NULL,
            image_url TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            icon_class TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            restaurant_id INTEGER NOT NULL,
            category_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            is_veg BOOLEAN NOT NULL,
            image_url TEXT,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE carts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cart_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            FOREIGN KEY (cart_id) REFERENCES carts(id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
            UNIQUE(cart_id, menu_item_id)
        )
    """)
    cursor.execute("""
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            restaurant_id INTEGER NOT NULL,
            delivery_address TEXT NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT NOT NULL, -- e.g., 'pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        )
    """)
    cursor.execute("""
        CREATE TABLE order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price_at_order REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        )
    """)
    conn.commit()
    conn.close()

def seed_db():
    conn = get_db()
    cursor = conn.cursor()

    # Load data from JSON
    with open('data.json', 'r') as f:
        data = json.load(f)

    # Seed Categories
    category_map = {}
    for cat_data in data['categories']:
        cursor.execute("INSERT INTO categories (name, icon_class) VALUES (?, ?)",
                       (cat_data['name'], cat_data['icon_class']))
        category_map[cat_data['name']] = cursor.lastrowid

    # Seed Restaurants
    restaurant_map = {}
    for rest_data in data['restaurants']:
        cursor.execute("INSERT INTO restaurants (name, cuisine, rating, delivery_time, image_url) VALUES (?, ?, ?, ?, ?)",
                       (rest_data['name'], rest_data['cuisine'], rest_data['rating'], rest_data['delivery_time'], rest_data['image_url']))
        restaurant_map[rest_data['name']] = cursor.lastrowid

    # Seed Menu Items
    for menu_data in data['menu_items']:
        restaurant_id = restaurant_map[menu_data['restaurant_name']]
        category_id = category_map[menu_data['category_name']] if menu_data['category_name'] in category_map else None
        cursor.execute("INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (restaurant_id, category_id, menu_data['name'], menu_data['description'], menu_data['price'], menu_data['is_veg'], menu_data['image_url']))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    seed_db()
    print("Database initialized and seeded.")