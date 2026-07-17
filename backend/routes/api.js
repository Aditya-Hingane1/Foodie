const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

// Add some mock data in case the database isn't hooked up yet
const MOCK_RESTAURANTS = [
  { id: 1, name: 'Burger Joint', rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60', description: 'Best burgers in town' },
  { id: 2, name: 'Pizza Paradise', rating: 4.8, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60', description: 'Authentic Italian pizza' },
  { id: 3, name: 'Healthy Greens', rating: 4.2, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60', description: 'Fresh salads and bowls' },
  { id: 4, name: 'Sushi Bliss', rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60', description: 'Premium sushi and rolls' }
];

const MOCK_MENUS = {
  1: [
    { id: 101, name: 'Classic Burger', price: 9.99, description: 'Beef patty with lettuce, tomato, and our secret sauce', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },
    { id: 102, name: 'Cheeseburger', price: 10.99, description: 'Classic with melted cheddar', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=60' },
    { id: 103, name: 'Fries', price: 3.99, description: 'Crispy golden fries', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=60' },
  ],
  2: [
    { id: 201, name: 'Margherita', price: 12.99, description: 'Tomato, mozzarella, and basil', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=200&q=60' },
    { id: 202, name: 'Pepperoni Pizza', price: 14.99, description: 'Classic pepperoni with extra cheese', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=200&q=60' },
  ],
  3: [
    { id: 301, name: 'Caesar Salad', price: 8.99, description: 'Crisp romaine with caesar dressing', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=200&q=60' },
    { id: 302, name: 'Quinoa Bowl', price: 11.99, description: 'Quinoa, roasted veggies, and tahini', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=60' },
  ],
  4: [
    { id: 401, name: 'Spicy Tuna Roll', price: 8.99, description: 'Fresh tuna with spicy mayo', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=60' },
    { id: 402, name: 'Salmon Nigiri', price: 6.99, description: 'Two pieces of fresh salmon on rice', image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=200&q=60' },
  ]
};

// GET all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM restaurants ORDER BY id ASC');
    return res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET menu for a restaurant
router.get('/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY id ASC', [id]);
    return res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders are now created only after Razorpay payment verification
// See: POST /api/payment/verify in routes/payment.js

// GET user orders
router.get('/user/orders', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT o.*, 
             COALESCE(json_agg(json_build_object(
               'item_name', m.name, 
               'qty', oi.quantity, 
               'restaurant_id', m.restaurant_id,
               'restaurant_name', r.name
             )) FILTER (WHERE m.id IS NOT NULL), '[]') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items m ON oi.menu_item_id = m.id
      LEFT JOIN restaurants r ON m.restaurant_id = r.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a review
router.post('/reviews', authenticate, async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;
    await db.query(
      'INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [req.user.id, restaurant_id, rating, comment]
    );
    // Dynamic Score Recalculation
    await db.query(
      'UPDATE restaurants SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews WHERE restaurant_id = $1) WHERE id = $1',
      [restaurant_id]
    );
    res.json({ message: 'Review submitted' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// GET latest global reviews
router.get('/reviews/latest', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name, rest.name as restaurant_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN restaurants rest ON r.restaurant_id = rest.id
      ORDER BY r.created_at DESC
      LIMIT 6
    `);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// GET reviews for a restaurant
router.get('/restaurants/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name as user_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = $1
      ORDER BY r.created_at DESC
    `, [id]);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
