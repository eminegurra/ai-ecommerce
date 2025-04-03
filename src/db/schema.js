// src/db/schema.js
const { mysqlTable, int, varchar, text, decimal } = require('drizzle-orm/mysql-core');

const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
});

const categories = mysqlTable('categories', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
});

const brands = mysqlTable('brands', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(),
});

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

const productAttributes = mysqlTable('product_attributes', {
  id: int('id').primaryKey().autoincrement(),
  productId: int('product_id').notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
});

module.exports = {
  users,
  products,
  categories,
  brands,
  productAttributes,
};