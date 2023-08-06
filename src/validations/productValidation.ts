import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

/**
 * Validation chain for creating a new product.
 * Validates the 'name', 'description', and 'price' fields in the request body.
 * Ensures that 'name' and 'description' are not empty and are strings.
 * Also, it ensures that 'price' is not empty and is a numeric value.
 */
const productCreateValidation: ValidationChain[] = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Please provide a string value"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Please provide a string value"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Please provide a numeric value"),
];

/**
 * Validation chain for updating a product.
 * Validates the 'name', 'description', and 'price' fields in the request body.
 * Allows these fields to be optional and nullable, so they can be omitted during updates.
 * Ensures that if provided, 'name' and 'description' are strings, and 'price' is a numeric value.
 */
const productUpdateValidation: ValidationChain[] = [
  body("name")
    .optional({ nullable: true })
    .isString()
    .withMessage("Please provide a string value"),

  body("description")
    .optional({ nullable: true })
    .isString()
    .withMessage("Please provide a string value"),

  body("price")
    .isNumeric()
    .withMessage("Please provide a numeric value")
    .optional({ nullable: true }),
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

export { productCreateValidation, productUpdateValidation, validateData };
