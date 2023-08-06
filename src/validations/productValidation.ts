import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

const productCreateValidation: ValidationChain[] = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Please provide string value'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Please provide string value'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Please provide numeric value'),

];


const productUpdateValidation: ValidationChain[] = [
    body('name')
        .optional({ nullable: true })
        .isString().withMessage('Please provide string value'),
    body('description')
        .optional({ nullable: true })
        .isString().withMessage('Please provide string value'),
    body('price')
        .isNumeric().withMessage('Please provide numeric value')
        .optional({ nullable: true }),
  ];

const validateData  = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { productCreateValidation, productUpdateValidation, validateData  };
