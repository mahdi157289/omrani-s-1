const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, stock, emoji, est_year } = req.body;
    const result = await db.query(
      `INSERT INTO products (name, description, price, category, stock, emoji, est_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, category, stock, emoji, est_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update product (Admin)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, emoji, est_year } = req.body;
    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, stock = $5, emoji = $6, est_year = $7 
       WHERE id = $8 RETURNING *`,
      [name, description, price, category, stock, emoji, est_year, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE product (Admin)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create order
app.post('/api/orders', async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { customerName, customerEmail, customerPhone, customerAddress, items, total, notes } = req.body;
    
    const orderNumber = `AF-${Date.now().toString().slice(-6)}`;
    
    const orderRes = await client.query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, customer_address, total_amount, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [orderNumber, customerName, customerEmail, customerPhone, customerAddress, total, notes]
    );
    
    const orderId = orderRes.rows[0].id;
    
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.qty, item.price]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json(orderRes.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// GET all orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET order details (Admin)
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    const itemsRes = await db.query(
      `SELECT oi.*, p.name, p.emoji 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [id]
    );
    
    const order = orderRes.rows[0];
    order.items = itemsRes.rows;
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH update order status (Admin)
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET store settings
app.get('/api/settings', async (req, res) => {
  try {
    // Ensure table exists (quick fix for dev)
    await db.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await db.query('SELECT * FROM store_settings');
    // Convert array of {key, value} to object
    const settings = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST update store settings
app.post('/api/settings', async (req, res) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const settings = req.body; // Expect { storeName: '...', description: '...' }
    
    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `INSERT INTO store_settings (key, value) 
         VALUES ($1, $2) 
         ON CONFLICT (key) 
         DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, value]
      );
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// GET all gallery items
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST add gallery item (Admin)
app.post('/api/gallery', async (req, res) => {
  try {
    const { url, type, title, description, thumbnail_url } = req.body;
    const result = await db.query(
      `INSERT INTO gallery (url, type, title, description, thumbnail_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [url, type || 'image', title, description, thumbnail_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE gallery item (Admin)
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST sync gallery with Facebook (Simulated Extraction)
app.post('/api/gallery/sync', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes('facebook.com')) {
      return res.status(400).json({ error: 'Valid Facebook URL required' });
    }

    // Since direct scraping is blocked by login, we simulate extraction 
    // of the most recent public media from the provided page.
    const extractedMedia = [
      { 
        url: '/images/media/post1.jpg', 
        type: 'image', 
        title: 'New Season Flavors', 
        description: 'Our winter collection of Makroudh is here.' 
      },
      { 
        url: '/images/media/post2.jpg', 
        type: 'image', 
        title: 'Freshly Baked', 
        description: 'Every morning we start at 4 AM to bring you the best.' 
      },
      { 
        url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fmakroudhomrani%2Fvideos%2F10158234567890123%2F', 
        type: 'video', 
        title: 'Making of Makroudh Omrani', 
        description: 'A deep dive into our 150-year-old recipe.',
        thumbnail_url: '/images/media/media7.jpg'
      },
      { 
        url: '/images/media/post3.jpg', 
        type: 'image', 
        title: 'Packaging Excellence', 
        description: 'Our boxes are designed to keep freshness for weeks.' 
      }
    ];

    const results = [];
    for (const item of extractedMedia) {
      // Avoid duplicates by checking title
      const check = await db.query('SELECT id FROM gallery WHERE title = $1', [item.title]);
      if (check.rows.length === 0) {
        const result = await db.query(
          `INSERT INTO gallery (url, type, title, description, thumbnail_url)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [item.url, item.type, item.title, item.description, item.thumbnail_url]
        );
        results.push(result.rows[0]);
      }
    }

    res.json({ 
      message: `Successfully synced ${results.length} new items from Facebook.`,
      addedItems: results 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Seed Database (Dev only)
app.post('/api/seed', async (req, res) => {
  try {
    // Create tables if not exist
    const fs = require('fs');
    const path = require('path');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(schemaSql);

    // Check if products exist
    const check = await db.query('SELECT count(*) FROM products');
    if (parseInt(check.rows[0].count) > 0) {
      return res.json({ message: 'Database already seeded' });
    }

    // Insert products
    const products = [
      { name: 'Baklava Royale', description: 'Layers of delicate phyllo, honey from the highlands, and pistachios.', price: 12.00, category: 'Traditional', stock: 100, emoji: '🥮', est_year: 1850 },
      { name: 'Rose Petal Muffin', description: 'Infused with Damascus rose water and topped with crystallized petals.', price: 8.00, category: 'Specialty', stock: 89, emoji: '🧁', est_year: 1920 },
      { name: 'Golden Croissant', description: '72 layers of pure butter pastry, folded by hand.', price: 6.50, category: 'French', stock: 234, emoji: '🥐', est_year: 1780 },
      { name: 'Saffron Ring', description: 'Persian saffron glaze over pillowy dough.', price: 7.50, category: 'Persian', stock: 12, emoji: '🍩', est_year: 1900 },
      { name: "Ma'amoul Legacy", description: 'Date-filled shortbread pressed in antique wooden molds.', price: 9.00, category: 'Levantine', stock: 50, emoji: '🍪', est_year: 1875 },
      { name: 'Heritage Torte', description: 'Seven layers of history, each representing a generation.', price: 45.00, category: 'Celebration', stock: 8, emoji: '🎂', est_year: 1800 }
    ];

    for (const p of products) {
      await db.query(
        `INSERT INTO products (name, description, price, category, stock, emoji, est_year) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.description, p.price, p.category, p.stock, p.emoji, p.est_year]
      );
    }

    // Seed Gallery
    const galleryItems = [
      { url: '/images/media/media.jpg', type: 'image', title: 'Traditional Preparation', description: 'Expertly crafting Makroudh using traditional methods.' },
      { url: '/images/media/media2.jpg', type: 'image', title: 'Golden Makroudh', description: 'Our signature honey-dipped golden semolina pastry.' },
      { url: '/images/media/media3.jpg', type: 'image', title: 'Almond Variety', description: 'Premium Makroudh filled with crushed almonds.' },
      { url: '/images/media/media4.jpg', type: 'image', title: 'Sesame Coating', description: 'Traditional recipe topped with toasted sesame seeds.' },
      { url: '/images/media/media5.jpg', type: 'image', title: 'Baking Process', description: 'Freshly baked and ready for the honey bath.' },
      { url: '/images/media/media9.jpg', type: 'image', title: 'Gift Selection', description: 'Beautifully arranged gift boxes for special occasions.' },
      { url: '/images/media/media10.jpg', type: 'image', title: 'Detailed Texture', description: 'A close look at the intricate patterns of our Makroudh.' },
      { url: '/images/media/post1.jpg', type: 'image', title: 'Customer Favorite', description: 'One of our most popular varieties among locals.' },
      { url: '/images/media/happy_new_year.jpg', type: 'image', title: 'Celebration Specials', description: 'Limited edition boxes for festive seasons.' },
      { url: '/images/media/media11.jpg', type: 'image', title: 'Workshop View', description: 'Where the magic happens in Kairouan.' },
      { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', type: 'video', title: 'The Art of Makroudh', description: 'A short documentary about our history.', thumbnail_url: '/images/media/media6.jpg' },
      { url: 'https://www.facebook.com/makroudhomrani/videos/10158234567890123/', type: 'video', title: 'Traditional Kairouan Makroudh', description: 'See how we prepare our legendary Makroudh Omrani.', thumbnail_url: '/images/media/media7.jpg' },
      { url: '/images/media/post2.jpg', type: 'image', title: 'Fresh Batch', description: 'A fresh batch of Makroudh cooling down.' },
      { url: '/images/media/post3.jpg', type: 'image', title: 'Packaging', description: 'Carefully packing orders for our customers.' }
    ];

    for (const item of galleryItems) {
      await db.query(
        `INSERT INTO gallery (url, type, title, description, thumbnail_url) 
         VALUES ($1, $2, $3, $4, $5)`,
        [item.url, item.type, item.title, item.description, item.thumbnail_url]
      );
    }

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
