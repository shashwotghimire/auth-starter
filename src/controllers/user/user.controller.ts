import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/prisma";

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.user.id } });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "no user found",
      });
    }
    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (e) {
    next(e);
  }
};
