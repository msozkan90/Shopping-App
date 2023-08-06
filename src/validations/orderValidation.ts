import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

const orderValidation: ValidationChain[] = [
  body('products_id')
    .notEmpty().withMessage('Products ID is required')
    .isArray().withMessage('Please provide an array'),
];



const validateData  = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { orderValidation, validateData  };
