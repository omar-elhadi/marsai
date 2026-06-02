import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: JwtPayload & { id: number; email: string; role: string };
}

/**
 * MIDDLEWARE 1 : Authentification
 * Vérifie si l'utilisateur est porteur d'un badge (Token) valide.
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Priorité 1 : cookie httpOnly (navigateur)
  // Priorité 2 : header Authorization (outils API / tests)
  const authHeader = req.headers["authorization"];
  const token =
    (req as CustomRequest).cookies?.marsai_token ||
    (authHeader && authHeader.split(" ")[1]);

  if (!token) {
    return res.status(403).json({
      message: "Accès refusé. Jeton d'authentification manquant.",
    });
  }

  const jwtSecret = process.env.JWT_SECRET || "";
  if (!jwtSecret) {
    return res
      .status(500)
      .json({ message: "Erreur de configuration serveur." });
  }

  try {
    // Vérification de la signature du token
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
      id: number;
      email: string;
      role: string;
    };

    // On injecte les données décodées dans l'objet 'req'
    // pour que les middlewares suivants y aient accès.
    (req as CustomRequest).user = decoded;

    next();
  } catch {
    return res.status(401).json({
      message: "Session expirée ou jeton invalide. Reconnexion requise.",
    });
  }
};

/**
 * MIDDLEWARE 2 : Autorisation (Admin uniquement)
 * Vérifie si l'utilisateur authentifié possède les droits d'administration.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const customReq = req as CustomRequest;
  // Sécurité préventive : on vérifie que verifyToken a bien été exécuté avant
  if (!customReq.user) {
    return res.status(500).json({
      message:
        "Erreur serveur : Identification utilisateur manquante pour le contrôle de rôle.",
    });
  }

  if (customReq.user.role !== "ADMIN") {
    return res.status(403).json({
      message:
        "Accès interdit. Cette ressource nécessite des privilèges Administrateur.",
    });
  }

  next();
};

/**
 * MIDDLEWARE 3 : Autorisation (Admin ou Modérateur)
 * Utilisé pour les routes de gestion des films (ADMIN + MODERATOR).
 */
export const isAdminOrModerator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customReq = req as CustomRequest;
  if (!customReq.user)
    return res.status(500).json({ message: "Identification manquante." });

  if (customReq.user.role === "ADMIN" || customReq.user.role === "MODERATOR") {
    next();
  } else {
    return res.status(403).json({
      message: "Accès interdit. Droits Admin ou Modérateur requis.",
    });
  }
};

/**
 * MIDDLEWARE 4 : Autorisation (Jury — accès à ses films assignés)
 * Le jury ne peut accéder qu'à ses films, pas au dashboard admin.
 */
export const isJury = (req: Request, res: Response, next: NextFunction) => {
  const customReq = req as CustomRequest;
  if (!customReq.user)
    return res.status(500).json({ message: "Identification manquante." });

  if (customReq.user.role === "JURY" || customReq.user.role === "ADMIN") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Accès réservé aux membres du Jury." });
  }
};
