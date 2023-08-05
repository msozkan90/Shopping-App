import express, { Request, Response } from 'express';
import pool from '../db/db';
import { Product } from '../models/Product';

const router = express.Router();

router.get('/products', async (req: Request, res: Response) => {

    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch (err) {
      console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
// Ürün ekleme
router.post('/product', async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/users', async (req: Request, res: Response) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users;');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving users from the database.' });
    }
  });

  router.post('/users', async (req: Request, res: Response) => {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Both username and email are required.' });
    }

    try {
      const { rows } = await pool.query('INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;', [username, email]);
      res.status(201).json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error inserting user into the database.' });
    }
  });
export default router;
