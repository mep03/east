import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/schema";

/**
 * Middleware for requiring authentication.
 * @info This middleware function checks if a session token exists in the user's cookies,
 *       indicating that the user is authenticated. If the token is present, the request is allowed to proceed.
 *       Otherwise, the user is redirected to the sign-in page with a forbidden status.
 * @desc Handles the logic for requiring user authentication.
 * @param req - The Express request object.
 * @param res - The Express response object used to send the response.
 * @param next - The next middleware function in the pipeline.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.cookies.sessionToken) {
    next();
  } else {
    res.status(403).redirect("/signin");
  }
};

/**
 * Middleware for checking an active session.
 * @info This middleware function checks if a session token exists in the user's cookies.
 *       If a session token is present, it indicates an active session, and the user is redirected to the dashboard page.
 *       If no session token is found, the request is allowed to proceed to the next middleware/route handler.
 * @desc Handles the logic for checking an active session.
 * @param req - The Express request object.
 * @param res - The Express response object used to send the response.
 * @param next - The next middleware function in the pipeline.
 */
export const isSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userSessionToken = req.cookies.sessionToken;

  if (userSessionToken) {
    try {
      const user = await UserModel.findOne({
        sessionToken: userSessionToken,
      });

      if (user) {
        res.status(403).redirect("/dashboard");
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    next();
  }
};
