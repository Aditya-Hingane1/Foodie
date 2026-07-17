require('dotenv').config();
const { pool } = require('./db');
const bcrypt = require('bcryptjs');

const restaurants = [
  { id: 5,  name: 'Tandoor House',     rating: 4.7, description: 'Authentic North Indian curries and tikkas from a clay oven', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=60' },
  { id: 6,  name: 'Dragon Palace',     rating: 4.6, description: 'Classic Chinese dim sum, noodles, and wok-tossed delights', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=60' },
  { id: 7,  name: 'Taco Fiesta',       rating: 4.4, description: 'Street-style Mexican tacos, burritos, and nachos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=60' },
  { id: 8,  name: 'The Cake Studio',   rating: 4.9, description: 'Artisan cakes, pastries, waffles and dessert boxes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60' },
  { id: 9,  name: 'Smoky BBQ Co.',     rating: 4.5, description: 'No-fuss slow-cooked ribs, wings, and pulled pork', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=500&q=60' },
  { id: 10, name: 'Pho & Noodle Bar',  rating: 4.3, description: 'Vietnamese pho, ramen, and Asian noodle soups', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60' },
  { id: 11, name: 'Café Brew',         rating: 4.8, description: 'Specialty coffee, all-day breakfast and fresh sandwiches', image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=500&q=60' },
  { id: 12, name: 'Shawarma Republic', rating: 4.6, description: 'Lebanese shawarma wraps, hummus platters and falafel bowls', image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=500&q=60' },
];

const menuItems = [
  // Tandoor House (5)
  { id: 501, restaurant_id: 5, name: 'Butter Chicken',    price: 299, description: 'Creamy tomato-based curry with tender chicken pieces', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=200&q=60' },
  { id: 502, restaurant_id: 5, name: 'Paneer Tikka',      price: 249, description: 'Spiced cottage cheese grilled in tandoor', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?auto=format&fit=crop&w=200&q=60' },
  { id: 503, restaurant_id: 5, name: 'Dal Makhani',       price: 199, description: 'Slow-cooked black lentils in rich buttery sauce', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=60' },
  { id: 504, restaurant_id: 5, name: 'Garlic Naan',       price: 59,  description: 'Fluffy bread brushed with garlic butter, baked in tandoor', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=200&q=60' },
  { id: 505, restaurant_id: 5, name: 'Lamb Biryani',      price: 349, description: 'Fragrant basmati rice with slow-cooked tender lamb', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=60' },

  // Dragon Palace (6)
  { id: 601, restaurant_id: 6, name: 'Dim Sum Basket',    price: 199, description: 'Steamed pork & prawn dumplings (8 pieces)', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=60' },
  { id: 602, restaurant_id: 6, name: 'Kung Pao Chicken',  price: 279, description: 'Stir-fried chicken with peanuts in spicy sauce', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=200&q=60' },
  { id: 603, restaurant_id: 6, name: 'Hakka Noodles',     price: 169, description: 'Classic wok-tossed noodles with vegetables', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=200&q=60' },
  { id: 604, restaurant_id: 6, name: 'Fried Rice',        price: 159, description: 'Egg fried rice with spring onion and soy sauce', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=200&q=60' },
  { id: 605, restaurant_id: 6, name: 'Peking Duck Roll',  price: 329, description: 'Crispy duck with hoisin sauce in a soft pancake', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60' },

  // Taco Fiesta (7)
  { id: 701, restaurant_id: 7, name: 'Chicken Taco',      price: 149, description: 'Soft corn tortilla with spiced chicken and salsa', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=60' },
  { id: 702, restaurant_id: 7, name: 'Beef Burrito',      price: 249, description: 'Loaded burrito with seasoned beef, beans and cheese', image: 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?auto=format&fit=crop&w=200&q=60' },
  { id: 703, restaurant_id: 7, name: 'Loaded Nachos',     price: 199, description: 'Crispy tortilla chips with cheese, jalapeños, and guac', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=200&q=60' },
  { id: 704, restaurant_id: 7, name: 'Veggie Quesadilla', price: 179, description: 'Grilled flour tortilla with cheese, peppers and corn', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=200&q=60' },

  // The Cake Studio (8)
  { id: 801, restaurant_id: 8, name: 'Chocolate Truffle',  price: 249, description: 'Rich dark chocolate layered cake with truffle frosting', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=60' },
  { id: 802, restaurant_id: 8, name: 'Belgian Waffle',     price: 179, description: 'Fluffy waffles with strawberry compote and cream', image: 'https://images.unsplash.com/photo-1504387432042-8aca549e4729?auto=format&fit=crop&w=200&q=60' },
  { id: 803, restaurant_id: 8, name: 'Tiramisu',           price: 199, description: 'Classic Italian dessert with espresso-soaked ladyfingers', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=200&q=60' },
  { id: 804, restaurant_id: 8, name: 'Macarons Box (6)',   price: 299, description: 'Assorted French macarons in seasonal flavours', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=200&q=60' },

  // Smoky BBQ Co. (9)
  { id: 901, restaurant_id: 9, name: 'BBQ Ribs (Half Rack)', price: 549, description: 'Slow-smoked pork ribs glazed with house BBQ sauce', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=200&q=60' },
  { id: 902, restaurant_id: 9, name: 'Pulled Pork Burger',   price: 299, description: 'Smoky pulled pork on a brioche bun with coleslaw', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=200&q=60' },
  { id: 903, restaurant_id: 9, name: 'Buffalo Wings (8pc)',  price: 279, description: 'Crispy chicken wings tossed in spicy buffalo sauce', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=200&q=60' },
  { id: 904, restaurant_id: 9, name: 'Loaded Fries',         price: 149, description: 'Skin-on fries topped with cheese sauce and jalapeños', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=200&q=60' },

  // Pho & Noodle Bar (10)
  { id: 1001, restaurant_id: 10, name: 'Beef Pho',          price: 229, description: 'Rich beef bone broth with rice noodles and fresh herbs', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=60' },
  { id: 1002, restaurant_id: 10, name: 'Chicken Ramen',     price: 249, description: 'Miso ramen with soft-boiled egg and bamboo shoots', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=60' },
  { id: 1003, restaurant_id: 10, name: 'Pad Thai',          price: 199, description: 'Classic Thai stir-fried noodles with prawn, peanut and lime', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=200&q=60' },
  { id: 1004, restaurant_id: 10, name: 'Spring Rolls (4pc)', price: 129, description: 'Crispy golden spring rolls with sweet chilli dipping sauce', image: 'https://images.unsplash.com/photo-1548869206-93b036288d7d?auto=format&fit=crop&w=200&q=60' },

  // Café Brew (11)
  { id: 1101, restaurant_id: 11, name: 'Avocado Toast',      price: 199, description: 'Sourdough toast with smashed avocado, poached egg and chilli', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?auto=format&fit=crop&w=200&q=60' },
  { id: 1102, restaurant_id: 11, name: 'Cold Brew Coffee',   price: 149, description: '18-hour cold brew concentrate served over ice', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=200&q=60' },
  { id: 1103, restaurant_id: 11, name: 'Club Sandwich',      price: 229, description: 'Triple-decker with chicken, bacon, lettuce and tomato', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=200&q=60' },
  { id: 1104, restaurant_id: 11, name: 'Acai Bowl',          price: 249, description: 'Frozen acai with granola, banana and fresh berries', image: 'https://images.unsplash.com/photo-1490323914169-4b57de8a9ec3?auto=format&fit=crop&w=200&q=60' },

  // Shawarma Republic (12)
  { id: 1201, restaurant_id: 12, name: 'Chicken Shawarma',   price: 179, description: 'Marinated chicken in pita with garlic sauce and pickles', image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=200&q=60' },
  { id: 1202, restaurant_id: 12, name: 'Falafel Wrap',       price: 149, description: 'Crispy falafel, hummus, and tabbouleh in flatbread', image: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=200&q=60' },
  { id: 1203, restaurant_id: 12, name: 'Hummus Platter',     price: 199, description: 'Creamy hummus with olive oil, served with pita chips', image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?auto=format&fit=crop&w=200&q=60' },
  { id: 1204, restaurant_id: 12, name: 'Lamb Shawarma',      price: 219, description: 'Slow-roasted spiced lamb in warm Arabic bread', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=200&q=60' },
];

const reviewTexts = [
  // Tandoor House (5)
  { restaurant_id: 5, rating: 5, comment: 'Best butter chicken I have ever had! The naan was perfectly fluffy and the curry was rich and creamy.' },
  { restaurant_id: 5, rating: 4, comment: 'The lamb biryani was absolutely fragrant and filling. Slightly spicy but in the best way.' },
  { restaurant_id: 5, rating: 5, comment: 'That dal makhani tasted like it simmered all night. Genuinely restaurant quality, delivered hot.' },

  // Dragon Palace (6)
  { restaurant_id: 6, rating: 5, comment: 'The dim sum basket was incredibly fresh. The pork dumplings just melted in the mouth!' },
  { restaurant_id: 6, rating: 4, comment: 'Hakka noodles were spot on - not too salty and well seasoned. Would order again for sure.' },
  { restaurant_id: 6, rating: 5, comment: 'Authentic Peking duck. The pancakes arrived intact and not soggy - impressive delivery packaging.' },

  // Taco Fiesta (7)
  { restaurant_id: 7, rating: 4, comment: 'Love the beef burrito - it is massive and absolutely packed with flavour. Great value too.' },
  { restaurant_id: 7, rating: 5, comment: 'Those nachos are legendary. Cheese sauce, jalapeños, guac - everything was chef\'s kiss.' },
  { restaurant_id: 7, rating: 3, comment: 'Tacos were good but a bit small for the price. Still tasty though, will order again.' },

  // The Cake Studio (8)
  { restaurant_id: 8, rating: 5, comment: 'The chocolate truffle was so decadent. Ordered for a birthday and everyone was blown away.' },
  { restaurant_id: 8, rating: 5, comment: 'Best tiramisu in the city, no competition. The espresso soak was perfect - not too soggy.' },
  { restaurant_id: 8, rating: 4, comment: 'Belgian waffle was fluffy and gorgeous. The strawberry compote made it feel really premium.' },

  // Smoky BBQ Co (9)
  { restaurant_id: 9, rating: 5, comment: 'Those ribs fell right off the bone. The smoke ring was real and the BBQ glaze was incredible.' },
  { restaurant_id: 9, rating: 4, comment: 'Buffalo wings were perfectly crispy and the sauce had a great kick without being overwhelming.' },
  { restaurant_id: 9, rating: 5, comment: 'Pulled pork burger is the best I have had. Brioche bun held up perfectly, zero sogginess.' },

  // Pho Noodle Bar (10)
  { restaurant_id: 10, rating: 5, comment: 'The beef pho broth was so deep and rich, clearly a good stock. The herbs were very fresh.' },
  { restaurant_id: 10, rating: 4, comment: 'Chicken ramen was comforting and the soft egg was cooked perfectly. Great portion size.' },
  { restaurant_id: 10, rating: 5, comment: 'Pad Thai was authentic - the right balance of fish sauce and tamarind. Will order every week.' },

  // Café Brew (11)
  { restaurant_id: 11, rating: 5, comment: 'The avocado toast is genuinely the best I have had. Poached egg was perfectly runny.' },
  { restaurant_id: 11, rating: 5, comment: 'Cold brew is properly strong and smooth, not watery. Really hit the spot this morning.' },
  { restaurant_id: 11, rating: 4, comment: 'Acai bowl was fresh and beautiful, really good quality granola. A bit pricey but worth it.' },

  // Shawarma Republic (12)
  { restaurant_id: 12, rating: 5, comment: 'Best shawarma wrap in town. The garlic sauce is addictive. I order this twice a week.' },
  { restaurant_id: 12, rating: 5, comment: 'The falafel wrap was crispy on the outside and perfectly spiced. Hummus was incredible.' },
  { restaurant_id: 12, rating: 4, comment: 'Lamb shawarma was tender and well marinated. The Arabic bread was warm and fresh too.' },

  // Existing restaurants - extra reviews
  { restaurant_id: 1, rating: 5, comment: 'That secret sauce on the classic burger is genuinely addictive. Ordered three times already.' },
  { restaurant_id: 2, rating: 4, comment: 'Margherita was thin, crispy and perfectly balanced. Exactly what a pizza should taste like.' },
  { restaurant_id: 3, rating: 5, comment: 'The quinoa bowl is such good quality. Really nutritious and filling without being heavy.' },
  { restaurant_id: 4, rating: 5, comment: 'Premium sushi indeed! The salmon nigiri was buttery and fresh. Worth every single rupee.' },
];

async function main() {
  try {
    console.log('\n🌱 Starting full database seed...\n');

    // Get admin user id for reviews
    const adminRes = await pool.query("SELECT id FROM users WHERE email = 'admin@foodie.com'");
    if (adminRes.rows.length === 0) {
      console.error('❌ No admin user found. Run seedAdmin.js first.');
      return;
    }
    const adminId = adminRes.rows[0].id;

    // --- RESTAURANTS ---
    console.log('🍽️  Inserting restaurants...');
    for (const r of restaurants) {
      await pool.query(`
        INSERT INTO restaurants (id, name, rating, image, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET name=$2, rating=$3, image=$4, description=$5
      `, [r.id, r.name, r.rating, r.image, r.description]);
    }
    await pool.query("SELECT setval('restaurants_id_seq', 12)");
    console.log(`  ✅ ${restaurants.length} restaurants seeded`);

    // --- MENU ITEMS ---
    console.log('🍔  Inserting menu items...');
    for (const m of menuItems) {
      await pool.query(`
        INSERT INTO menu_items (id, restaurant_id, name, price, description, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET name=$3, price=$4, description=$5, image=$6
      `, [m.id, m.restaurant_id, m.name, m.price, m.description, m.image]);
    }
    await pool.query("SELECT setval('menu_items_id_seq', 1204)");
    console.log(`  ✅ ${menuItems.length} menu items seeded`);

    // --- REVIEWS ---
    console.log('⭐  Inserting reviews...');
    // Clear existing reviews first for a clean seed
    await pool.query('DELETE FROM reviews');
    for (const rv of reviewTexts) {
      await pool.query(`
        INSERT INTO reviews (user_id, restaurant_id, rating, comment)
        VALUES ($1, $2, $3, $4)
      `, [adminId, rv.restaurant_id, rv.rating, rv.comment]);
    }

    // Recalculate all restaurant ratings from reviews
    await pool.query(`
      UPDATE restaurants r 
      SET rating = (SELECT ROUND(AVG(rating), 1) FROM reviews v WHERE v.restaurant_id = r.id)
      WHERE EXISTS (SELECT 1 FROM reviews v WHERE v.restaurant_id = r.id)
    `);
    console.log(`  ✅ ${reviewTexts.length} reviews seeded and restaurant ratings recalculated`);

    console.log('\n🎉 Full seed complete! The website is alive.\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    pool.end();
  }
}
main();
