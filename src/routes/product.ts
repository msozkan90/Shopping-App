import express, { Request, Response } from 'express';
import pool from '../db/db';
import {authMiddleware} from '../middlewares/authenticationMiddleware';
import {permissionMiddleware} from '../middlewares/permissionMiddleware';

const router = express.Router();

router.get('/products', authMiddleware, async (req: Request, res: Response) => {

    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch (err) {
      console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Ürün ekleme
router.post('/product', permissionMiddleware, async (req: Request, res: Response) => {
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


router.patch('/product/:id', permissionMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const updateFields: any = {}; // Boş bir nesne oluşturuyoruz, güncellenecek alanları buraya ekleyeceğiz.

    if (name) {
      updateFields.name = name;
    }

    if (price) {
      updateFields.price = price;
    }

    if (description) {
      updateFields.description = description;
    }

    if (Object.keys(updateFields).length === 0) {
      // Eğer hiçbir alan gelmemişse, hata döndürüyoruz.
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updateProduct = await pool.query(
      'UPDATE products SET name = COALESCE($1, name), price = COALESCE($2, price), description = COALESCE($3, description) WHERE id = $4 RETURNING *',
      [updateFields.name, updateFields.price, updateFields.description, id]
    );

    if (updateProduct.rows.length === 0) {
      // Güncellenen ürün bulunamadıysa, hata döndürüyoruz.
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updateProduct.rows[0]); // Güncellenen ürünü döndürüyoruz.
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/product/:id', permissionMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Ürünü veritabanından silmeden önce, ürünü bulup döndürebiliriz.
    const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (deletedProduct.rows.length === 0) {
      // Silinen ürün bulunamadıysa, hata döndürüyoruz.
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;


