/** @type {import('drizzle-kit').Config} */
module.exports = {
    schema: './src/db/schema.js',
    out: './drizzle/migrations',
    dialect: 'mysql',
    dbCredentials: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ai-ecommerce',
    },
  };
  