import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authMiddleware} from '../middlewares/authenticationMiddleware';
import {registerValidation, loginValidation, validateData} from '../validations/customerValidation';
import { User } from '../entities/User';
import { AppDataSource } from '../db/dataSource';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User)

// Kayıt olma (Register) endpoint'i
router.post('/register', registerValidation, validateData, async (req: Request, res: Response) => {
  const { email, name, surname, password, is_admin } = req.body;

  try {
    const user_object = new User()

    // Parolayı hashleme
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user_object.email = email
    user_object.name = name
    user_object.surname = surname
    user_object.password = hashedPassword
    user_object.is_admin = is_admin

    const user = await AppDataSource.manager.save(user_object)

    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    console.error('Error while registering:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', loginValidation, validateData, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı e-posta adresine göre veritabanından getirme

    const user = await userRepository.findOneBy({
      email: email,
  });

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
      { id: user.id, email: user.email,is_admin: user.is_admin },
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
      const userId = Number(req.user?.id); // Güvenli bir şekilde req.user alanını kontrol ediyoruz.

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const user = await userRepository.findOne({ where: { id: userId }, select: ['id', 'email', 'name', 'surname', 'is_admin'] }); // Fetch user data without the 'password' field

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
