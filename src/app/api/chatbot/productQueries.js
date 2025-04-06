import { db } from '@/db/index';
import { products, brands, categories, productAttributes } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function getAllProductsWithAttributes() {
  const baseProducts = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      brandName: brands.name,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id));

  const attributes = await db
    .select({
      productId: productAttributes.productId,
      key: productAttributes.key,
      value: productAttributes.value,
    })
    .from(productAttributes)
    .where(inArray(productAttributes.productId, baseProducts.map(p => p.id)));

  const attrMap = {};
  for (const attr of attributes) {
    if (!attrMap[attr.productId]) attrMap[attr.productId] = [];
    attrMap[attr.productId].push(`${attr.key}: ${attr.value}`);
  }

  return baseProducts.map(p => ({
    ...p,
    attributes: attrMap[p.id] || [],
  }));
}
