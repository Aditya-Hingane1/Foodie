require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function main() {
  try {
    console.log('Adding status column to orders...');
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending';");
    
    console.log('Checking for existing admin...');
    const res = await pool.query("SELECT * FROM users WHERE email = 'admin@foodie.com'");
    if (res.rows.length === 0) {
      console.log('Creating admin user...');
      const hash = await bcrypt.hash('password123', 10);
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ('System Admin', 'admin@foodie.com', $1, 'admin')",
        [hash]
      );
      console.log('Admin user created successfully! Email: admin@foodie.com | Password: password123');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error updating Database:', err.message);
  } finally {
    pool.end();
  }
}

main();
