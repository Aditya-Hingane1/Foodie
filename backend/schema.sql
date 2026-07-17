-- 0. Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Create the restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating NUMERIC(3,1),
    image TEXT,
    description TEXT
);

-- 2. Create the menu items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    image TEXT
);

-- 3. Create the orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255),
    address TEXT NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the order_items table (to store which items belong to which order)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC(10,2) NOT NULL
);

-- ==========================================
-- SEED DATA (Optional: Run this to populate the tables with sample data)
-- ==========================================

INSERT INTO restaurants (id, name, rating, image, description) VALUES
(1, 'Burger Joint', 4.5, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60', 'Best burgers in town'),
(2, 'Pizza Paradise', 4.8, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60', 'Authentic Italian pizza'),
(3, 'Healthy Greens', 4.2, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60', 'Fresh salads and bowls'),
(4, 'Sushi Bliss', 4.9, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60', 'Premium sushi and rolls');

-- Fix sequence so new inserts don't collide with our manual IDs
SELECT setval('restaurants_id_seq', 4);

INSERT INTO menu_items (id, restaurant_id, name, price, description, image) VALUES
(101, 1, 'Classic Burger', 9.99, 'Beef patty with lettuce, tomato, and our secret sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60'),
(102, 1, 'Cheeseburger', 10.99, 'Classic with melted cheddar', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=60'),
(103, 1, 'Fries', 3.99, 'Crispy golden fries', 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=60'),

(201, 2, 'Margherita', 12.99, 'Tomato, mozzarella, and basil', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=60'),
(202, 2, 'Pepperoni Pizza', 14.99, 'Classic pepperoni with extra cheese', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=200&q=60'),

(301, 3, 'Caesar Salad', 8.99, 'Crisp romaine with caesar dressing', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=200&q=60'),
(302, 3, 'Quinoa Bowl', 11.99, 'Quinoa, roasted veggies, and tahini', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=60'),

(401, 4, 'Spicy Tuna Roll', 8.99, 'Fresh tuna with spicy mayo', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=60'),
(402, 4, 'Salmon Nigiri', 6.99, 'Two pieces of fresh salmon on rice', 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=200&q=60');

-- Fix sequence
SELECT setval('menu_items_id_seq', 402);

-- 5. Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

