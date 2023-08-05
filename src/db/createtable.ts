// createTable.ts
import pool from "./db";

export async function createTableIfNotExists(): Promise<void> {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        price NUMERIC NOT NULL,
        description VARCHAR NOT NULL -- Burada description sütununu ekleyin
      )
    `;
    await pool.query(query);
    console.log('Table "products" created successfully!');
  } catch (error) {
    console.error("Error creating table:", error);
  }

  try {
    pool
      .query(
        `
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          surname VARCHAR(100) NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT false NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

      `
      )
      .then(() => console.log('Table "users" created successfully.'))
      .catch((err) => console.error('Error creating "users" table:', err));
  } catch (error) {
    console.error("Error creating table:", error);
  }



  try {
    const query = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        products_id INTEGER[] NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await pool.query(query);
    console.log('Table "orders" created successfully!');
  } catch (error) {
    console.error('Error creating "orders" table:', error);
  }
}
