import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * validate.middleware.js
 * Middleware générique Zod — reçoit un schéma, valide req.body.
 * En cas d'erreur, renvoie 400 avec le détail des champs invalides.
 */
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(
        (e: { path: (string | number)[]; message: string }) => ({
          field: e.path.join("."),
          message: e.message,
        }),
      );
      return res
        .status(400)
        .json({ error: "Données invalides", details: errors });
    }

    // Remplace req.body par les données validées + nettoyées par Zod
    req.body = result.data;
    next();
  };
