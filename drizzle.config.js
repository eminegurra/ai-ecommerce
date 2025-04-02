/** @type {import('drizzle-kit').Config} */
module.exports = {
    schema: './src/db/schema.js',
    out: './drizzle/migrations',
    dialect: 'mysql',
    dbCredentials: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'ai-ecommerce',
    },
  };
  