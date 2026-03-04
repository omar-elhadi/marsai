import prisma from "../utils/prisma.js";
import { loginAdmin } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

/**
 * CONNEXION CLASSIQUE (Email + Password)
 * Principalement pour l'ADMIN.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // MISE À JOUR DU STATUT : On enregistre la date de connexion
    // Cela fera passer le badge au VERT sur le dashboard.
    await prisma.user.update({
      where: { id: result.user.id },
      data: { lastLogin: new Date() },
    });

    // Pose le JWT dans un cookie httpOnly — inaccessible depuis JS (protection XSS)
    res.cookie("marsai_token", result.token, {
      httpOnly: true,
      sameSite: "strict",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   24 * 60 * 60 * 1000, // 24h en ms
    });

    // Retourne uniquement les données utilisateur (jamais le token en clair)
    return res.status(200).json({ user: result.user });
  } catch (e) {
    console.error("❌ Erreur Login Controller:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

/**
 * VÉRIFICATION DU TOKEN (Magic Link)
 * Pour les JURYS.
 */
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token manquant" });
    }

    const user = await prisma.user.findFirst({
      where: { loginToken: token },
    });

    if (!user) {
      return res.status(401).json({ error: "Lien invalide ou expiré." });
    }

    // Vérification de l'expiration du token
    if (user.tokenExpires && new Date() > new Date(user.tokenExpires)) {
      // Token expiré : on le nettoie en base pour éviter des tentatives futures
      await prisma.user.update({
        where: { id: user.id },
        data: { loginToken: null, tokenExpires: null },
      });
      return res.status(401).json({ error: "Ce lien a expiré. Demandez un nouvel accès à l'administrateur." });
    }

    // On enregistre uniquement la date de connexion (badge VERT dashboard)
    // Le token est conservé en base — réutilisable jusqu'à tokenExpires (fin festival)
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const sessionToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Pose le JWT dans un cookie httpOnly (même logique que le login admin)
    res.cookie("marsai_token", sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      secure:   process.env.NODE_ENV === "production",
      maxAge:   24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      },
    });
  } catch (error) {
    console.error("❌ Erreur VerifyToken:", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la vérification du lien" });
  }
};
