import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

/**
 * Validation chain for order creation or update.
 * Validates the 'products_id' field in the request body.
 * It ensures that the 'products_id' field is not empty and is an array.
 */
const orderValidation: ValidationChain[] = [
  body("products_id")
    .notEmpty()
    .withMessage("Products ID is required")
    .isArray()
    .withMessage("Please provide an array of product IDs"),
];

/**
 * Middleware to validate data using the express-validator library.
 * If there are validation errors, it returns a 400 response with the validation errors array.
 * Otherwise, it calls the 'next()' function to continue with the next middleware.
 */
const validateData = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { orderValidation, validateData };
