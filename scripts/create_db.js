const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(
  process.env.DATABASE_URL || 'data/payments.db',
);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS sessions (id TEXT, hash TEXT)');
});

db.close();
