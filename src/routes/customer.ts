import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/db';
import {authMiddleware} from '../middlewares/authenticationMiddleware';

const router = express.Router();


// Kayıt olma (Register) endpoint'i
router.post('/register', async (req: Request, res: Response) => {
  const { email, name, surname, password, is_admin } = req.body;

  try {
    // Parolayı hashleme
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı veritabanına ekleme
    const insertQuery = `
      INSERT INTO users (email, name, surname, password, is_admin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [email, name, surname, hashedPassword, is_admin];

    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    console.error('Error while registering:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı e-posta adresine göre veritabanından getirme
    const selectQuery = `
      SELECT * FROM users
      WHERE email = $1
    `;
    const result = await pool.query(selectQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Şifre karşılaştırma
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // JWT oluşturma ve gönderme
    const token = jwt.sign(
      { id: user.id, email: user.email, status: user.status, is_admin: user.is_admin },
      process.env.JWT_SECRET || 'your_jwt_secret', // Provide your JWT secret here
      { expiresIn: '1h' }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error while logging in:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Örnek bir rota, middleware'i kullanarak tokenı kontrol ediyoruz.
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id; // Güvenli bir şekilde req.user alanını kontrol ediyoruz.

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Tokenin ait olduğu kullanıcıyı veritabanından getirme
      const selectQuery = `
        SELECT id, email, name, surname, is_admin FROM users
        WHERE id = $1
      `;
      const result = await pool.query(selectQuery, [userId]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (err) {
      console.error('Error while fetching user detail:', err);
      res.status(500).json({ message: 'Failed to get user detail' });
    }
  });

export default router;
