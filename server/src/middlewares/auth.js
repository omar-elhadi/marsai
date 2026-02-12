import jwt from "jsonwebtoken";

/**
 * Middleware pour vérifier la présence et la validité du JWT
 * attendu dans le header 'Authorization: Bearer <token>'
 */
export const verifyToken = (req, res, next) => {
  // 1. Récupérer le header Authorization
  const authHeader = req.headers["authorization"];

  // 2. Extraire le token (format "Bearer TOKEN_ICI")
  const token = authHeader && authHeader.split(" ")[1];

  // 3. Si pas de token, on arrête tout (403 Forbidden)
  if (!token) {
    return res.status(403).json({
      message: "Accès refusé. Aucun jeton d'authentification fourni.",
    });
  }

  try {
    // 4. Vérifier la signature du token avec notre SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Injecter les infos utilisateur décodées dans l'objet 'req'
    // Cela permettra aux fonctions suivantes de savoir QUI fait la requête
    req.user = decoded;

    // 6. Passer au middleware suivant ou au contrôleur
    next();
  } catch (error) {
    // 7. Si le token est expiré ou falsifié (401 Unauthorized)
    return res.status(401).json({
      message: "Session expirée ou jeton invalide. Veuillez vous reconnecter.",
    });
  }
};
