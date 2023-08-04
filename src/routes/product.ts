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
// // Ürün ekleme
// router.post('/products', async (req: Request, res: Response) => {
//   try {
//     const { name, price, description } = req.body;
//     const newProduct: Product = await pool.query(
//       'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
//       [name, price, description]
//     );

//     res.json(newProduct.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Ürün güncelleme
// router.put('/products/:id', async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, price, description } = req.body;
//     const updatedProduct: Product = await pool.query(
//       'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
//       [name, price, description, id]
//     );

//     res.json(updatedProduct.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Ürün silme
// router.delete('/products/:id', async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deletedProduct: Product = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

//     res.json(deletedProduct.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

export default router;
