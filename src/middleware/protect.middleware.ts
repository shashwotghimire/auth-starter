import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}
interface AuthRequest extends Request {
  user: TokenPayload;
}
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(403).json({
        success: false,
        error: "unauthorized or token expired",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as TokenPayload;
    if (!decoded) {
      return res.status(403).json({
        success: false,
        error: "unauthorized or token expired",
      });
    }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({
      success: false,
      error: "unauthorized or token expired",
    });
  }
};
