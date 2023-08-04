// createTable.ts
import pool from './db';

export async function createTableIfNotExists(): Promise<void> {
  try {
    console.log(pool);
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        price NUMERIC NOT NULL
      )
    `;
    await pool.query(query);
    console.log('Table "products" created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } 
}
