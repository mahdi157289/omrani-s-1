const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

let db;
let pool;

if (connectionString) {
  // PostgreSQL Configuration (Production/Render)
  pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  console.log('Connected to PostgreSQL');
} else {
  // SQLite Configuration (Local Development)
  const dbPath = path.resolve(__dirname, 'pastery.db');
  db = new sqlite3.Database(dbPath);
  console.log('Connected to SQLite');
}

// Helper to convert Postgres query to SQLite (only needed for SQLite)
function convertQuery(text) {
  if (pool) return text; // Postgres supports $1, $2 natively
  return text.replace(/\$\d+/g, '?');
}

// Initialize DB and Tables
const initDB = () => {
  const schema = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0,
      emoji TEXT,
      image_url TEXT,
      est_year INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_address TEXT,
      status TEXT DEFAULT 'pending',
      total_amount REAL NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'image',
      title TEXT,
      description TEXT,
      thumbnail_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS store_settings (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  const sqliteSchema = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      stock INTEGER DEFAULT 0,
      emoji TEXT,
      image_url TEXT,
      est_year INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_address TEXT,
      status TEXT DEFAULT 'pending',
      total_amount REAL NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'image',
      title TEXT,
      description TEXT,
      thumbnail_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  if (pool) {
    // Postgres Init
    (async () => {
      try {
        for (const query of schema) {
          await pool.query(query);
        }
        
        // Seed if empty
        const res = await pool.query("SELECT count(*) FROM products");
        if (parseInt(res.rows[0].count) === 0) {
           const products = [
              { name: 'Traditional Makroudh', price: 15.00, emoji: '🍯', image_url: '/images/product1.jpg', description: 'Classic semolina pastry filled with dates and soaked in honey.', est_year: 1850 },
              { name: 'Almond Makroudh', price: 18.00, emoji: '�', image_url: '/images/product2.jpg', description: 'Delicate white makroudh filled with crushed almonds.', est_year: 1920 },
              { name: 'Sesame Makroudh', price: 16.50, emoji: '�', image_url: '/images/product3.jpg', description: 'Golden pastry covered in roasted sesame seeds.', est_year: 1900 },
          ];
          for (const p of products) {
            await pool.query(
              "INSERT INTO products (name, price, emoji, image_url, description, est_year) VALUES ($1, $2, $3, $4, $5, $6)",
              [p.name, p.price, p.emoji, p.image_url, p.description, p.est_year]
            );
          }
          console.log('Seeded products (Postgres)');
        }
      } catch (err) {
        console.error('Error initializing Postgres:', err);
      }
    })();
  } else {
    // SQLite Init
    db.serialize(() => {
      db.run("PRAGMA foreign_keys = ON");
      sqliteSchema.forEach(query => db.run(query));
      
      // Seed if empty
      db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (!err && row.count === 0) {
          const products = [
              { name: 'Traditional Makroudh', price: 15.00, emoji: '🍯', image_url: '/images/product1.jpg', description: 'Classic semolina pastry filled with dates and soaked in honey.', est_year: 1850 },
              { name: 'Almond Makroudh', price: 18.00, emoji: '�', image_url: '/images/product2.jpg', description: 'Delicate white makroudh filled with crushed almonds.', est_year: 1920 },
              { name: 'Sesame Makroudh', price: 16.50, emoji: '�', image_url: '/images/product3.jpg', description: 'Golden pastry covered in roasted sesame seeds.', est_year: 1900 },
          ];
          const stmt = db.prepare("INSERT INTO products (name, price, emoji, image_url, description, est_year) VALUES (?, ?, ?, ?, ?, ?)");
          products.forEach(p => {
            stmt.run(p.name, p.price, p.emoji, p.image_url, p.description, p.est_year);
          });
          stmt.finalize();
          console.log('Seeded products (SQLite)');
        }
      });
    });
  }
};

initDB();

const executeQuery = (text, params = []) => {
  return new Promise((resolve, reject) => {
    if (pool) {
      // Postgres Query
      pool.query(text, params)
        .then(res => resolve(res))
        .catch(err => reject(err));
    } else {
      // SQLite Query
      const sql = convertQuery(text);
      
      // Simple transaction handling
      if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
          db.run(sql, (err) => {
              if (err) return reject(err);
              resolve({ rows: [], rowCount: 0 });
          });
          return;
      }

      const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
      const hasReturning = sql.includes('RETURNING');

      if (isSelect) {
        db.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows });
        });
      } else {
        db.run(sql, params, function(err) {
          if (err) return reject(err);
          if (hasReturning) {
             // Mock RETURNING for INSERT/UPDATE
             // This is a simplification; for robust support, use a separate SELECT
             resolve({ rows: [{ id: this.lastID }], rowCount: this.changes });
          } else {
             resolve({ rows: [], rowCount: this.changes });
          }
        });
      }
    }
  });
};

const getClient = async () => {
  if (pool) {
    return await pool.connect();
  }
  // For SQLite, we just return the db object with a compatible interface
  // but since SQLite is single-connection here, we don't need a pool
  return {
    query: executeQuery,
    release: () => {}
  };
};

module.exports = {
  query: executeQuery,
  getClient,
  pool // Export pool for direct access if needed
};
