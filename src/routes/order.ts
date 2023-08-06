import express, { Request, Response } from 'express';
import pool from '../db/db';
import {authMiddleware} from '../middlewares/authenticationMiddleware';

const router = express.Router();

router.get('/orders', authMiddleware, async (req: Request, res: Response) => {
    try {
        const orders = await pool.query('SELECT * FROM orders');
        res.json(orders.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders from the database.' });
    }
})


router.post('/order', authMiddleware, async (req: Request, res: Response) => {
    const { order_id, products_id } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO orders (order_id, products_id) VALUES ($1, $2) RETURNING *', [order_id, products_id]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error inserting order into the database.' });
    }

})

export default router;