require('dotenv').config();
const { pool } = require('./db');

async function main() {
  try {
    console.log('Creating reviews table for Phase 3...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('Database successfully prepared for Phase 3!');
  } catch (err) {
    console.error('Error updating Database:', err.message);
  } finally {
    pool.end();
  }
}

main();
