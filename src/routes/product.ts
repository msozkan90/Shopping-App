import express, { Request, Response } from 'express';
import pool from '../db/db';


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




export default router;
