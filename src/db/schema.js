const { mysqlTable, int, varchar } = require('drizzle-orm/mysql-core');

const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(), // ✅ works with MariaDB
  name: varchar('name', { length: 255 }),
});

module.exports = { users };
