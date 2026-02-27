import jwt from "jsonwebtoken";

/**
 * MIDDLEWARE 1 : Authentification
 * Vérifie si l'utilisateur est porteur d'un badge (Token) valide.
 */
export const verifyToken = (req, res, next) => {
  // Extraction du header 'Authorization'
  const authHeader = req.headers["authorization"];

  // Format attendu : "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Accès refusé. Jeton d'authentification manquant.",
    });
  }

  try {
    // Vérification de la signature du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On injecte les données décodées dans l'objet 'req'
    // pour que les middlewares suivants y aient accès.
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expirée ou jeton invalide. Reconnexion requise.",
    });
  }
};

/**
 * MIDDLEWARE 2 : Autorisation (Admin uniquement)
 * Vérifie si l'utilisateur authentifié possède les droits d'administration.
 */
export const isAdmin = (req, res, next) => {
  // Sécurité préventive : on vérifie que verifyToken a bien été exécuté avant
  if (!req.user) {
    return res.status(500).json({
      message:
        "Erreur serveur : Identification utilisateur manquante pour le contrôle de rôle.",
    });
  }

  if (req.user.role !== "ADMIN") {
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
export const isAdminOrModerator = (req, res, next) => {
  if (!req.user)
    return res.status(500).json({ message: "Identification manquante." });

  if (req.user.role === "ADMIN" || req.user.role === "MODERATOR") {
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
export const isJury = (req, res, next) => {
  if (!req.user)
    return res.status(500).json({ message: "Identification manquante." });

  if (req.user.role === "JURY" || req.user.role === "ADMIN") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Accès réservé aux membres du Jury." });
  }
};
