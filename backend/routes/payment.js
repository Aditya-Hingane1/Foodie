const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');
const { authenticate } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Creates a Razorpay order and returns order_id + key to the frontend
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const options = {
      amount: Math.round(amount * 100), // Razorpay wants paise (1 rupee = 100 paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payment/verify
// Verifies the Razorpay signature, then saves the order to the database
router.post('/verify', authenticate, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      total,
      customerDetails,
    } = req.body;

    // Verify signature cryptographically
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    // Payment is authentic — save order to DB
    const result = await db.query(
      `INSERT INTO orders 
        (total, customer_name, address, user_id, status, payment_id, payment_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [total, customerDetails.name, customerDetails.address, req.user.id, 'Pending', razorpay_payment_id, 'paid']
    );
    const orderId = result.rows[0].id;

    // Insert order items
    for (const item of cart) {
      await db.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.qty, item.price]
      );
    }

    res.json({ success: true, orderId });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ error: 'Order saving failed after payment' });
  }
});

module.exports = router;
