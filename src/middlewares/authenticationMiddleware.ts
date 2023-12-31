import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../db/dataSource";

const userRepository = AppDataSource.getRepository(User);

// Interface for the authentication payload
interface AuthPayload {
  id: number;
  email: string;
  name: string;
  surname: string;
  password: string;
  is_admin: boolean;
}

// Augmenting the Request type in Express to include the 'user' field.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload; // Adding the 'user' field to the Request object.
    }
  }
}

/**
 * Auth Token Middleware
 * This middleware checks for a valid JWT token in the 'Authorization' header.
 * If a valid token is found, it decodes the token and attaches the user information to the request object.
 * If the token is missing or invalid, it returns a 401 Unauthorized error response.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to proceed to the next middleware
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the 'Authorization' header from the request
    const authHeader = req.header("Authorization");

    // Check if the header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extract the token from the header
    const token = authHeader.slice(7);

    // If token is not found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token using the JWT_SECRET and decode it as an AuthPayload
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as AuthPayload;

    // Find the user by their ID (assuming the user repository has a method to do this)
    const user = await userRepository.findOneBy({
      id: Number(decodedToken.id),
    });

    // If user not found
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user object to the 'user' field in the Request object
    req.user = user;

    // Continue to the next middleware
    next();
  } catch (error) {
    // If an error occurs during token verification, return 401 Unauthorized
    return res.status(401).json({ message: "Unauthorized" });
  }
};
