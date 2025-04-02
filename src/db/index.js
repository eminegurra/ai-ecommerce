const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
const schema = require('./schema');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ai-ecommerce',
});

const db = drizzle(pool, {
  schema,
  mode: 'default', // ✅ REQUIRED for latest drizzle + mysql2
});

module.exports = { db };
