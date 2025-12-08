import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    error: { errorPath: req.path, method: req.method },
    errorMessage: errorMessage,
  });
};
