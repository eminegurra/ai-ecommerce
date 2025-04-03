const { db } = require('../src/db/index');
const { products, brands, categories } = require('../src/db/schema');

async function seed() {
  // Insert brands
  await db.insert(brands).values([
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'Dell' },
  ]);

  // Insert categories
  await db.insert(categories).values([
    { name: 'Phone' },
    { name: 'Laptop' },
  ]);

  // Manually get brand/category IDs
  const brandData = await db.select().from(brands);
  const categoryData = await db.select().from(categories);

  const getBrandId = (name) => brandData.find(b => b.name === name)?.id;
  const getCategoryId = (name) => categoryData.find(c => c.name === name)?.id;

  // Insert products
  await db.insert(products).values([
    {
      serialNumber: 'MBP-14-M1PRO',
      name: 'MacBook Pro 14"',
      brandId: getBrandId('Apple'),
      categoryId: getCategoryId('Laptop'),
      description: 'Powerful laptop with M1 Pro chip',
      price: 1999.99,
      imageUrl: '/images/products/macbook.jpg',
    },
    {
      serialNumber: 'IPHONE-15-256GB',
      name: 'iPhone 15',
      brandId: getBrandId('Apple'),
      categoryId: getCategoryId('Phone'),
      description: 'Latest iPhone with stunning camera and performance',
      price: 1099.99,
      imageUrl: '/images/products/iphone.jpg',
    },
    {
      serialNumber: 'SAMSUNG-GALAXY-S23',
      name: 'Samsung Galaxy S23',
      brandId: getBrandId('Samsung'),
      categoryId: getCategoryId('Phone'),
      description: 'Flagship Android phone with incredible display',
      price: 899.99,
      imageUrl: '/images/products/samsung.jpg',
    },
    {
      serialNumber: 'DELL-XPS-13-2023',
      name: 'Dell XPS 13',
      brandId: getBrandId('Dell'),
      categoryId: getCategoryId('Laptop'),
      description: 'Lightweight and powerful ultrabook',
      price: 1399.99,
      imageUrl: '/images/products/dell.jpg',
    },
  ]);

  console.log('✅ Products, brands, and categories seeded!');
  process.exit();
}

seed().catch((err) => {
  console.error('❌ Error seeding data:', err);
  process.exit(1);
});
