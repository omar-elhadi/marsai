import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;
  
  const statusCode = error.statusCode || 500;
  
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: "Validation Error", details: err.errors });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: "Duplicate field value entered" });
  }

  res.status(statusCode).json({
    error: error.isOperational ? error.message : "Erreur serveur"
  });
};
