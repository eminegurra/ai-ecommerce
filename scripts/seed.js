const { db } = require('../src/db/index');
const { products, brands, categories, productAttributes } = require('../src/db/schema');


async function seed() {
  // Insert brands
  await db.insert(brands).values([
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'Dell' },
    { name: 'Lenovo' },
    { name: 'Google' },
  ]);
  

  // Insert categories
  await db.insert(categories).values([
    { name: 'Phone' },
    { name: 'Laptop' },
    { name: 'Tablet' }, 
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
    {
      serialNumber: 'IPHONE-15-PRO-512GB',
      name: 'iPhone 15 Pro',
      brandId: getBrandId('Apple'),
      categoryId: getCategoryId('Phone'),
      description: 'Premium iPhone with Titanium frame',
      price: 1499.99,
      imageUrl: '/images/products/iphone15pro.jpg',
    },
    {
      serialNumber: 'LENOVO-THINKPAD-X1',
      name: 'Lenovo ThinkPad X1',
      brandId: getBrandId('Lenovo'),
      categoryId: getCategoryId('Laptop'),
      description: 'Business-grade ultrabook with high durability',
      price: 1299.99,
      imageUrl: '/images/products/thinkpad.jpg',
    },
    {
      serialNumber: 'GOOGLE-PIXEL-8',
      name: 'Google Pixel 8',
      brandId: getBrandId('Google'),
      categoryId: getCategoryId('Phone'),
      description: 'Pure Android experience with Google Tensor chip',
      price: 799.99,
      imageUrl: '/images/products/pixel8.jpg',
    },
    {
      serialNumber: 'IPAD-AIR-2024',
      name: 'iPad Air 2024',
      brandId: getBrandId('Apple'),
      categoryId: getCategoryId('Tablet'),
      description: 'Lightweight tablet with powerful performance',
      price: 699.99,
      imageUrl: '/images/products/ipadair.jpg',
    },
    {
      serialNumber: 'SAMSUNG-GALAXY-TAB-S9',
      name: 'Samsung Galaxy Tab S9',
      brandId: getBrandId('Samsung'),
      categoryId: getCategoryId('Tablet'),
      description: 'High-end Android tablet with S Pen',
      price: 849.99,
      imageUrl: '/images/products/tab.jpg',
    },
  ]);

  const productData = await db.select().from(products);
  const getProductId = (serialNumber) =>
    productData.find((p) => p.serialNumber === serialNumber)?.id;

  // Insert product attributes
  await db.insert(productAttributes).values([
    // MacBook Pro
    { productId: getProductId('MBP-14-M1PRO'), key: 'Processor', value: 'M1 Pro' },
    { productId: getProductId('MBP-14-M1PRO'), key: 'RAM', value: '16GB' },

    // iPhone 15
    { productId: getProductId('IPHONE-15-256GB'), key: 'Storage', value: '256GB' },
    { productId: getProductId('IPHONE-15-256GB'), key: 'Camera', value: '48MP' },

    // Samsung Galaxy S23
    { productId: getProductId('SAMSUNG-GALAXY-S23'), key: 'Display', value: '6.1-inch AMOLED' },

    // Dell XPS 13
    { productId: getProductId('DELL-XPS-13-2023'), key: 'Weight', value: '1.2kg' },

    // iPhone 15 Pro
    { productId: getProductId('IPHONE-15-PRO-512GB'), key: 'Storage', value: '512GB' },
    { productId: getProductId('IPHONE-15-PRO-512GB'), key: 'Frame', value: 'Titanium' },

    // Lenovo ThinkPad X1
    { productId: getProductId('LENOVO-THINKPAD-X1'), key: 'Keyboard', value: 'Backlit' },
    { productId: getProductId('LENOVO-THINKPAD-X1'), key: 'Security', value: 'Fingerprint Scanner' },

    // Google Pixel 8
    { productId: getProductId('GOOGLE-PIXEL-8'), key: 'Chip', value: 'Google Tensor G3' },
    { productId: getProductId('GOOGLE-PIXEL-8'), key: 'Battery', value: '4300mAh' },

    // iPad Air 2024
    { productId: getProductId('IPAD-AIR-2024'), key: 'Display', value: '10.9-inch Liquid Retina' },

    // Galaxy Tab S9
    { productId: getProductId('SAMSUNG-GALAXY-TAB-S9'), key: 'S Pen', value: 'Included' },
    { productId: getProductId('SAMSUNG-GALAXY-TAB-S9'), key: 'Water Resistance', value: 'IP68' },
  ]);

  console.log('✅ Seeded brands, categories, 9 products, and attributes!');
  process.exit();
}

seed().catch((err) => {
  console.error('❌ Error seeding data:', err);
  process.exit(1);
});