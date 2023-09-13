import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.env.DATABASE_URL || 'data/payments.db');

export const getDatabase = () => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  return db;
}