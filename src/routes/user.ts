import express, { Request, Response } from 'express';
import pool from '../db/db';

const router = express.Router();


router.get('/users', async (req: Request, res: Response) => {
    try {
        const users= await pool.query('SELECT * FROM users;');
        res.json(users.rows);
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