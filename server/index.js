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

// POST create order
app.post('/api/orders', async (req, res) => {
  const client = await db.pool.connect();
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

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
