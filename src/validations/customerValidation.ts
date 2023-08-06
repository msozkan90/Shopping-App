import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const registerValidation = [
  body('email')
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Please provide a valid email address'),
  body('name')
  .notEmpty().withMessage('Name is required'),
  body('surname')
  .notEmpty().withMessage('Surname is required'),
  body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // Diğer gerekli kontrolleri buraya ekleyebilirsiniz...
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


export const loginValidation = [
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
    body('password')
    .notEmpty().withMessage('Password is required'),
    // Diğer gerekli kontrolleri buraya ekleyebilirsiniz...
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
