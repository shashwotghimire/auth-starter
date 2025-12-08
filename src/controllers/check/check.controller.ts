import { Request, Response, NextFunction } from "express";

export const check = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "api is working correctly" });
  } catch (e) {
    next(e);
  }
};
