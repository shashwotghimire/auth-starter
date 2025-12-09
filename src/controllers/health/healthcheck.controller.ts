import { Request, Response, NextFunction } from "express";

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      success: true,
      message: "express api is running",
    });
  } catch (e) {
    next(e);
  }
};
