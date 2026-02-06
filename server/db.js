const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'pastery.db');
const db = new sqlite3.Database(dbPath);

// Helper to convert Postgres query to SQLite
function convertQuery(text) {
  // Replace $1, $2, etc with ?
  return text.replace(/\$\d+/g, '?');
}

// Initialize DB and Tables
db.serialize(() => {
  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON");

  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`DROP TABLE IF EXISTS products`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price_at_purchase REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Seed products if empty
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
      console.log('Seeded products');
    }
  });
});

const executeQuery = (text, params = []) => {
  return new Promise((resolve, reject) => {
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
        resolve({ rows, rowCount: rows.length });
      });
    } else {
      if (hasReturning) {
          // Fallback for RETURNING
          db.all(sql, params, function(err, rows) {
             if (err) {
                 if (sql.includes('INSERT INTO orders')) {
                     const sqlNoRet = sql.split('RETURNING')[0];
                     db.run(sqlNoRet, params, function(err2) {
                         if (err2) return reject(err2);
                         const lastID = this.lastID;
                         db.get("SELECT * FROM orders WHERE id = ?", [lastID], (err3, row) => {
                             if (err3) return reject(err3);
                             resolve({ rows: [row], rowCount: 1 });
                         });
                     });
                     return;
                 }
                 return reject(err);
             }
             resolve({ rows, rowCount: rows.length });
          });
      } else {
          db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ rows: [], rowCount: this.changes });
          });
      }
    }
  });
};

const pool = {
  connect: async () => {
    return {
      query: executeQuery,
      release: () => {}
    };
  },
  query: executeQuery
};

module.exports = {
  query: executeQuery,
  pool
};
