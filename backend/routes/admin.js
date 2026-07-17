const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

router.use(authenticate, isAdmin);

// GET analytics
router.get('/analytics', async (req, res) => {
  try {
    const ordersResult = await db.query("SELECT COUNT(*) as total_orders, SUM(total) as revenue FROM orders WHERE payment_status = 'paid'");
    const usersResult = await db.query("SELECT COUNT(*) as total_users FROM users WHERE role = 'customer'");
    
    res.json({
      totalOrders: parseInt(ordersResult.rows[0].total_orders || 0),
      revenue: parseFloat(ordersResult.rows[0].revenue || 0),
      activeUsers: parseInt(usersResult.rows[0].total_users || 0)
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all orders
router.get('/orders', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT o.id, o.customer_name, o.address, o.total, o.created_at, o.status, 
             o.payment_status, o.payment_id, u.email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if(!status) return res.status(400).json({ error: 'Status is required' });
    
    // Get user email to send notification
    const orderData = await db.query('SELECT o.*, u.email, u.name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1', [id]);
    
    const { rowCount } = await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Order not found' });
    
    // If setting to 'Out for Delivery', trigger a mock Ethereal email
    if (status === 'Out for Delivery' && orderData.rows.length > 0) {
      const user = orderData.rows[0];
      try {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, 
          auth: {
            user: testAccount.user, 
            pass: testAccount.pass, 
          },
        });
        
        let info = await transporter.sendMail({
          from: '"Foodie Deliveries" <delivery@foodie.app>',
          to: user.email,
          subject: `Your amazing food is Out for Delivery! 🚀`,
          html: `<h3>Hey ${user.name},</h3><p>Your order #${id} for $${user.total} is currently out for delivery and arriving soon!</p>`
        });
        
        console.log("Mock Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
      } catch(emailErr) {
        console.error("Failed to send mock email", emailErr);
      }
    }
    
    res.json({ message: 'Order status updated' });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
