import { db } from '@/db/index';
import { products, brands, categories } from '@/db/schema';

export async function getAllProductNames() {
  const results = await db.select({ name: products.name }).from(products);
  return results.map(p => p.name);
}

export async function getAllBrandNames() {
  const results = await db.select({ name: brands.name }).from(brands);
  return results.map(b => b.name);
}

export async function getAllCategoryNames() {
  const results = await db.select({ name: categories.name }).from(categories);
  return results.map(c => c.name);
}
