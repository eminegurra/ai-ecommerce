// scripts/seed.js
const { db } = require('../src/db/index');
const { products } = require('../src/db/schema');

async function seed() {
  await db.insert(products).values([
    {
      serialNumber: 'MBP-14-M1PRO',
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      description: 'Powerful laptop with M1 Pro chip',
      category: 'Laptop',
      price: 1999.99,
      imageUrl: '/images/products/macbook.jpg',
    },
    {
      serialNumber: 'IPHONE-15-256GB',
      name: 'iPhone 15',
      brand: 'Apple',
      description: 'Latest iPhone with stunning camera and performance',
      category: 'Phone',
      price: 1099.99,
      imageUrl: '/images/products/iphone.jpg',
    },
    {
      serialNumber: 'SAMSUNG-GALAXY-S23',
      name: 'Samsung Galaxy S23',
      brand: 'Samsung',
      description: 'Flagship Android phone with incredible display',
      category: 'Phone',
      price: 899.99,
      imageUrl: '/images/products/samsung.jpg',
    },
    {
      serialNumber: 'DELL-XPS-13-2023',
      name: 'Dell XPS 13',
      brand: 'Dell',
      description: 'Lightweight and powerful ultrabook',
      category: 'Laptop',
      price: 1399.99,
      imageUrl: '/images/products/dell.jpg',
    },
  ]);

  console.log('✅ Products seeded!');
  process.exit();
}

seed().catch((err) => {
  console.error('❌ Error seeding products:', err);
  process.exit(1);
});
