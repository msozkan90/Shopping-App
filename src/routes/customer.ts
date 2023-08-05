import express, {Request, Response} from 'express';
import pool from '../db/db';
const bcrypt = require('bcrypt');

const router = express.Router();

router.get("/customers", async(req: Request, res: Response) => {
    try{
        const customer = await pool.query("SELECT * FROM customer");
        res.json(customer.rows);
    }
    catch{
        console.error("Error retrieving customer from the database.");
        res.status(500).json({error: "Error retrieving customer from the database."});
    }
})


router.post("/customer", async(req: Request, res: Response) => {
    try{
        const {email, name, password} = req.body;
        // E-posta adresinin veritabanında kullanılabilir olup olmadığını kontrol et
            const emailExists = await pool.query('SELECT id FROM customer WHERE email = $1', [email]);
            if (emailExists.rows.length > 0) {
            return res.status(409).json({ error: 'Bu e-posta adresi zaten kullanılıyor.' });
            }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = await pool.query("INSERT INTO customer (email, name, password) VALUES ($1, $2, $3) RETURNING *", [email, name, hashedPassword]);
        res.json(newCustomer.rows[0]);
    }
    catch (error) {
        console.error('Müşteri oluşturulurken hata:', error);
        res.status(500).json({ error: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin.' });
      }
})


export default router;