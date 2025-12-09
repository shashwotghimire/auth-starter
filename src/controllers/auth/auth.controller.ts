import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/prisma";
import crypto from "crypto";
import { signToken, verifyToken } from "../../utils/jwt";
import { hashPassword, verifyPassword } from "../../utils/hash";

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        error: "details missing",
      });
    }
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "user with that email already exists",
      });
    }
    const encryptedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: { username, email, password: encryptedPassword },
    });

    const token = generateVerificationToken();

    await prisma.emailVerificationToken.create({
      data: {
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        userId: newUser.id,
      },
    });

    const verifyLink = `localhost:8000/api/auth/verify/${token}`;

    return res.status(201).json({
      success: true,
      message: "check your email for verification",
      verificationLink: verifyLink, //send this link in email
    });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const verifyToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });
    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        error: "invalid, missing or expired token",
      });
    }
    if (verifyToken.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: "token expired",
      });
    }
    await prisma.user.update({
      where: { id: verifyToken.userId },
      data: { emailVerified: true },
    });
    const verifiedUser: any = await prisma.user.findFirst({
      where: { id: verifyToken.userId },
    });
    const accessToken = signToken({
      id: verifiedUser.id,
      email: verifiedUser.email,
    });
    await prisma.emailVerificationToken.delete({ where: { token } });
    return res.status(200).json({
      success: true,
      message: "email verified successfully",
      user: {
        username: verifiedUser?.username,
        email: verifiedUser?.email,
        verified: verifiedUser?.emailVerified,
        token: accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "invalid email",
      });
    }
    const hashedPassword: any = user.password;
    if (!(await verifyPassword(password, hashedPassword))) {
      return res.status(400).json({
        success: false,
        error: "invalid email or password",
      });
    }
    const accessToken = signToken({ id: user.id, email: user.email });
    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken,
      },
    });
  } catch (e) {
    next(e);
  }
};
