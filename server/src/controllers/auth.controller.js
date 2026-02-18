import prisma from "../config/prisma.js";
import { loginAdmin } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin(email, password);

    if (!result) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error("Erreur Login Controller:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

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

    const sessionToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      token: sessionToken,
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
