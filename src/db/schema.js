const { mysqlTable, int, varchar , text, decimal} = require('drizzle-orm/mysql-core');

const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(), // ✅ works with MariaDB
  name: varchar('name', { length: 255 }),
});


const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
});

module.exports = { 
  users,
  products,

 };


