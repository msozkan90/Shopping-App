import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface for the authentication payload
interface AuthPayload {
  id: string;
  email: string;
  status: string;
  is_admin: boolean;
}

// Augmenting the Request type in Express to include the 'user' field.
// This will allow us to access the authenticated user information later in the request handling process.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload; // Adding the 'user' field to the Request object.
    }
  }
}

/**
 * Permission Middleware
 * This middleware checks for a valid JWT token in the 'Authorization' header and verifies
 * if the user is an admin based on the 'is_admin' property in the decoded token.
 * If the user is an admin, it allows the request to proceed to the next middleware.
 * Otherwise, it returns a 403 Forbidden error response.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction to proceed to the next middleware
 */
export const permissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  try {
    // Verify the token using the JWT_SECRET and decode it as an AuthPayload
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    ) as AuthPayload;

    // Attach the decoded user information to the 'user' field in the Request object
    req.user = decodedToken;

    // Check if the user is an admin
    if (req.user.is_admin) {
      // If user is an admin, allow the request to proceed to the next middleware
      next();
    } else {
      // If user is not an admin, return a 403 Forbidden error
      return res.status(403).json({ message: "Permission denied" });
    }
  } catch (error) {
    // If an error occurs during token verification, return 401 Unauthorized
    return res.status(401).json({ message: "Unauthorized" });
  }
};
