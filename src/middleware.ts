import { Request, Response, NextFunction } from "express";

/**
 * Middleware for API Key Authentication.
 * @info This middleware checks the API-Key header in the request and compares it with the stored API key.
 *       If the API key is missing or invalid, it returns a "Forbidden" error response.
 * @desc This middleware is used to protect routes that require valid API keys for access.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 */
export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header("API-Key");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
