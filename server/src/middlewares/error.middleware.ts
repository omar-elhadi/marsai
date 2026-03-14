import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  if (
    err.statusCode !== 404 &&
    err.statusCode !== 401 &&
    err.statusCode !== 403
  ) {
    logger.error(
      { err, req: { method: req.method, url: req.url } },
      err.message || "Erreur non gérée",
    );
  }

  const statusCode = error.statusCode || err.statusCode || 500;

  if (err.name === "ZodError") {
    return res
      .status(400)
      .json({ error: "Validation Error", details: err.errors });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Duplicate field value entered" });
  }

  res.status(statusCode).json({
    error: error.isOperational ? error.message : "Erreur serveur",
  });
};
