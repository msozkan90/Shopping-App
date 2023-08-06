// middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
  id: string;
  email: string;
  status: string;
  is_admin: boolean;
}

// Genişletilmiş bir Request türü tanımlıyoruz, böylece 'user' alanını ekleyebiliriz.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload; // Talep nesnesine 'user' alanını ekliyoruz.
    }
  }
}

// Bu fonksiyon, gelen talepteki JWT tokenını kontrol eder.
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Talep başlıklarından authorization header'ını alıyoruz.
  const authHeader = req.header('Authorization');

  // Eğer header yoksa veya Bearer ile başlamıyorsa hata döndürüyoruz.
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Tokenı alıyoruz ve "Bearer " bölümünü kaldırıyoruz.
  const token = authHeader.slice(7);

  // Eğer token yoksa hata döndürüyoruz.
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Tokenı doğruluyoruz. Eğer doğrulanamazsa hata döndürüyoruz.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as AuthPayload;
    req.user = decodedToken; // Talep nesnesine kullanıcı bilgilerini ekliyoruz.
    next(); // Middleware'i devam ettiriyoruz.
  } catch (error) {
    // Token doğrulanamazsa hata döndürüyoruz.
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
