import express, { Request, Response } from 'express';
import pool from '../db/db';
import {authMiddleware} from '../middlewares/authenticationMiddleware';

const router = express.Router();

router.get('/orders', authMiddleware, async (req: Request, res: Response) => {
    try {
        const orders = await pool.query(
            `SELECT
                orders.id,
                orders.customer_id,
                orders.created_at,
                (
                    SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'price', price))
                    FROM products
                    WHERE products.id = ANY(orders.products_id)
                ) AS products,
                (
                    SELECT COALESCE(SUM(products.price), 0)  -- Calculate the total_price by summing product prices
                    FROM products
                    WHERE products.id = ANY(orders.products_id)
                ) AS total_price
            FROM
                orders
            WHERE
                orders.customer_id = $1`,
            [req.user?.id]
        );

        if (!orders.rows.length) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders from the database.' });
    }
})



router.post('/order', authMiddleware, async (req: Request, res: Response) => {
    const { products_id } = req.body;
    const customer_id = req.user?.id;

    try {
        // Check if all product IDs in the products_id array exist in the products table
        const { rows: validProducts } = await pool.query(
            'SELECT id FROM products WHERE id = ANY($1::int[])',
            [products_id]
        );

        if (validProducts.length !== products_id.length) {
            // If the number of valid products found is not equal to the input length,
            // it means there are invalid product IDs
            return res.status(400).json({ error: 'Invalid product ID(s) in the products_id array.' });
        }

        const { rows } = await pool.query(
            'INSERT INTO orders (customer_id, products_id) VALUES ($1, $2) RETURNING *',
            [customer_id, products_id]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error inserting order into the database:', error);
        res.status(500).json({ error: 'Error inserting order into the database.' });
    }
});


router.get('/order/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const orders = await pool.query(
            `SELECT
                orders.id,
                orders.customer_id,
                orders.created_at,
                (
                    SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name, 'price', price))
                    FROM products
                    WHERE products.id = ANY(orders.products_id)
                ) AS products,
                (
                    SELECT COALESCE(SUM(products.price), 0) -- Calculate the total_price by summing product prices
                    FROM products
                    WHERE products.id = ANY(orders.products_id)
                ) AS total_price
            FROM
                orders
            WHERE
                orders.customer_id = $1
                AND orders.id = $2`, // Add an additional condition for order.id
            [req.user?.id, req.params.id] // Assuming you pass orderId as a parameter
        );

        if (!orders.rows.length) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders from the database.' });
    }
});


router.patch('/order/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { products_id } = req.body;
    try {
        const { rows } = await pool.query('UPDATE orders SET products_id = $1 WHERE id = $2 AND customer_id = $3 RETURNING *', [products_id, id, req.user?.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order in the database.' });
    }
})

router.delete('/order/:id', authMiddleware, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedOrder = await pool.query('DELETE FROM orders WHERE id = $1 AND customer_id = $2 RETURNING *', [id, req.user?.id]);

        if (deletedOrder.rows.length === 0) {
            // Silinen ürün bulunamadıysa, hata döndürüyoruz.
            return res.status(404).json({ error: 'Order not found' });
          }

          res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order from the database.' });
    }
})

export default router;