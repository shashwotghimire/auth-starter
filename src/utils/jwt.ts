import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface TokenPayload {
  id: string;
  email: string;
}

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "28d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
