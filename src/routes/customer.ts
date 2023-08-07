import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authenticationMiddleware";
import {
  registerValidation,
  loginValidation,
  validateData,
} from "../validations/customerValidation";
import { User } from "../entities/User";
import { AppDataSource } from "../db/dataSource";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

/**
 * User Registration
 * Register a new user with the provided information.
 * Validates the request body using 'registerValidation' and 'validateData' middlewares.
 * Hashes the password and saves the user to the database.
 */
router.post(
  "/register",
  registerValidation,
  validateData,
  async (req: Request, res: Response) => {
    const { email, name, surname, password, is_admin } = req.body;

    try {
      const user_object = new User();

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user_exists = await userRepository.findOneBy({ email: email });
      if (user_exists) {
        return res.status(400).json({ message: "This email already taken" });
      }

      user_object.email = email;
      user_object.name = name;
      user_object.surname = surname;
      user_object.password = hashedPassword;
      user_object.is_admin = is_admin;

      // Save the user to the database
      const user = await AppDataSource.manager.save(user_object);

      // Create a new object without the password property
      const userWithoutPassword = { ...user, password: undefined };

      res.status(201).json({
        message: "Registration successful",
        user: userWithoutPassword,
      });
    } catch (err) {
      console.error("Error while registering:", err);
      res.status(500).json({ message: "Registration failed" });
    }
  }
);

/**
 * User Login
 * Authenticate a user with the provided email and password.
 * Validates the request body using 'loginValidation' and 'validateData' middlewares.
 * Checks if the user exists and the password is valid, then returns a JWT token.
 */
router.post(
  "/login",
  loginValidation,
  validateData,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      // Get the user by email from the database
      const user = await userRepository.findOneBy({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate and send JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET || "your_jwt_secret", // Provide your JWT secret here
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    } catch (err) {
      console.error("Error while logging in:", err);
      res.status(500).json({ message: "Login failed" });
    }
  }
);

/**
 * User Profile
 * Fetch and return the profile data of the authenticated user.
 * Uses 'authMiddleware' to check the JWT token.
 */
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id); // Safely check the 'req.user' field.

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Fetch user data without the 'password' field
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "name", "surname", "is_admin"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error while fetching user detail:", err);
    res.status(500).json({ message: "Failed to get user detail" });
  }
});

export default router;
