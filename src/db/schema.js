// src/db/schema.js
const { mysqlTable, int, varchar, text, decimal, timestamp,
  foreignKey, } = require('drizzle-orm/mysql-core');

// USERS TABLE
const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
});

// CATEGORIES TABLE
const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
});

// BRANDS TABLE
const brands = mysqlTable('brands', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
});

// PRODUCTS TABLE
const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  serialNumber: varchar('serial_number', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  brandId: int('brand_id').notNull(),
  categoryId: int('category_id').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }),
});

// PRODUCT ATTRIBUTES TABLE
const productAttributes = mysqlTable('product_attributes', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
});

// ORDERS TABLE
const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id'), // Optional user login
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 100 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 1. Define orderItems AFTER orders/products
const orderItems = mysqlTable('order_items', {
  id: int('id').primaryKey().autoincrement(),

  orderId: int('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),

  productId: int('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),

  quantity: int('quantity').notNull(),

  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});


module.exports = {
  users,
  products,
  categories,
  brands,
  productAttributes,
  orders,
  orderItems,
};
