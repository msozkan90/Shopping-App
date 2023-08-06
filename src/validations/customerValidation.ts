import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

/**
 * Validation chain for registering a new user.
 * Validates the request body fields: 'email', 'name', 'surname', and 'password'.
 */
const registerValidation: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Please provide a string value"),
  body("surname")
    .notEmpty()
    .withMessage("Surname is required")
    .isString()
    .withMessage("Please provide a string value"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

/**
 * Validation chain for user login.
 * Validates the request body fields: 'email' and 'password'.
 */
const loginValidation: ValidationChain[] = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
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

export { registerValidation, loginValidation, validateData };
