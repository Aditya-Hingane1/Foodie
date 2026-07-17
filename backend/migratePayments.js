require('dotenv').config();
const { pool } = require('./db');

async function main() {
  try {
    console.log('Adding payment columns to orders table...');
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
    `);
    console.log('Database updated successfully for Razorpay!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    pool.end();
  }
}
main();
