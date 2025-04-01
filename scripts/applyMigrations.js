const { migrate } = require('drizzle-orm/mysql2/migrator');
const { db } = require('../src/db');

(async () => {
  await migrate(db, { migrationsFolder: 'drizzle/migrations' });
  console.log('✅ Migrations applied');
})();
