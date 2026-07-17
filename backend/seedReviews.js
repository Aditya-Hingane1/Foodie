require('dotenv').config();
const { pool } = require('./db');

async function main() {
  try {
    console.log('Seeding mock reviews...');
    
    // Ensure we have a valid user to attribute reviews to
    let userResult = await pool.query("SELECT id FROM users WHERE email = 'admin@foodie.com'");
    let userId;
    
    if (userResult.rows.length === 0) {
       console.log('No users found. Run seedAdmin.js first.');
       return;
    }
    userId = userResult.rows[0].id;
    
    // Clear existing reviews to prevent bloat if run multiple times
    await pool.query('DELETE FROM reviews');

    // Insert mock reviews
    await pool.query(`
      INSERT INTO reviews (user_id, restaurant_id, rating, comment) VALUES 
      ($1, 1, 5, 'Absolutely fantastic! The classic burger was cooked to perfection and the sauce is to die for.'),
      ($1, 1, 4, 'Great burger, but the fries were a bit too salty for my taste. Will order again though!'),
      ($1, 2, 5, 'Best pizza in town. The crust is perfectly crispy and they are super generous with the pepperoni.'),
      ($1, 3, 4, 'Really fresh ingredients. The quinoa bowl was very filling and healthy.'),
      ($1, 4, 5, 'Premium quality sushi. The salmon nigiri melted in my mouth. 10/10 recommend!'),
      ($1, 4, 3, 'The sushi was good but the delivery took a bit longer than expected.')
    `, [userId]);
    
    // Update the average rating for all restaurants based on these new reviews
    await pool.query(`
      UPDATE restaurants r 
      SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews v WHERE v.restaurant_id = r.id)
      WHERE EXISTS (SELECT 1 FROM reviews v WHERE v.restaurant_id = r.id)
    `);

    console.log('Successfully added mock reviews and updated restaurant ratings!');
  } catch (err) {
    console.error('Failed to seed reviews:', err);
  } finally {
    pool.end();
  }
}

main();
