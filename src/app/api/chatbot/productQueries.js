// src/app/api/chatbot/productQueries.js
import { db } from '@/db/index';
import {
  products,
  brands,
  categories,
  productAttributes,
} from '@/db/schema';
import { lte, eq, like, or, and, inArray } from 'drizzle-orm/expressions';

export async function getProductsByKeyword(message) {
  const normalized = normalizeKeywords(message);
  const conditions = normalized.map((keyword) =>
    or(
      like(products.name, `%${keyword}%`),
      like(brands.name, `%${keyword}%`),
      like(categories.name, `%${keyword}%`)
    )
  );

  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      brandName: brands.name,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(or(...conditions));
}

export async function getProductsByBudget(budget) {
  return db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      brandName: brands.name,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(lte(products.price, budget));
}

export async function getProductsByFeature(message) {
  const lower = message.toLowerCase();

  // Extract keyword and value pair (e.g., "16GB RAM", "AMOLED", "IP68")
  // const regex = /(\d+(?:\.\d+)?\s?(gb|tb|mp|mah|hz|inch|kg|g)?)|([a-zA-Z]+\s?[a-zA-Z]*scanner|retina|amoled|ip\d+|included|backlit)/gi;
  const regex = /(\d+(?:\.\d+)?\s?(gb|tb|mp|mah|hz|inch|kg|g)?)|(\bretina\b|\bamoled\b|ip\d+|included|backlit|scanner|fingerprint scanner|water resistance|s pen|ram|camera|display|processor|battery|keyboard)/gi;

  const matches = message.match(regex);

  if (!matches || matches.length === 0) {
    return {
      list: [],
      reply: `Please include a recognizable feature like "16GB RAM", "IP68", or "AMOLED" so I can help you better.`,
    };
  }

  const featureKeywords = matches.map(m => m.trim().toUpperCase());

  // Search for any attribute matching any extracted keyword
  const matchingAttrs = await db
    .select({ productId: productAttributes.productId })
    .from(productAttributes)
    .where(
      or(...featureKeywords.map(keyword =>
        or(
          like(productAttributes.value, `%${keyword}%`),
          like(productAttributes.key, `%${keyword}%`) // <-- add this line
        )
      ))
    )
    

  const productIds = matchingAttrs.map(a => a.productId);

  if (!productIds.length) {
    return {
      list: [],
      reply: `Sorry, I couldn’t find any products matching ${featureKeywords.join(", ")}.`,
    };
  }

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      brandName: brands.name,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(inArray(products.id, productIds));

  const productList = results.map((p, i) => `${i + 1}. ${p.name} – €${p.price}`).join('\n');

  return {
    list: results,
    reply: `Here are products matching ${featureKeywords.join(", ")}:\n\n${productList}\n\nWould you like more info about any of them?`,
  };
}


export async function getAttributesByProductIds(productIds) {
  const attributes = await db
    .select({
      productId: productAttributes.productId,
      key: productAttributes.key,
      value: productAttributes.value,
    })
    .from(productAttributes)
    .where(inArray(productAttributes.productId, productIds));

  return attributes.reduce((acc, attr) => {
    if (!acc[attr.productId]) acc[attr.productId] = [];
    acc[attr.productId].push(`${attr.key}: ${attr.value}`);
    return acc;
  }, {});
}

function normalizeKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .map((word) =>
      word
        .replace(/\bphones\b/, 'phone')
        .replace(/\blaptops\b/, 'laptop')
        .replace(/\btablets\b/, 'tablet')
        .replace(/\bcomputers\b/, 'laptop')
        .replace(/\bpcs\b/, 'laptop')
        .replace(/\bsmartphones\b/, 'phone')
    );
}
