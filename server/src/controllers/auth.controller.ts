import prisma from "../utils/prisma.js";
import { loginAdmin } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

/**
 * CONNEXION CLASSIQUE (Email + Password)
 * Principalement pour l'ADMIN.
 */
export const login = catchAsync(async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  const result = await loginAdmin(email, password);

  if (!result) {
    return next(new AppError("Identifiants incorrects", 401));
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
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24h en ms
  });

  // Retourne uniquement les données utilisateur (jamais le token en clair)
  return res.status(200).json({ user: result.user });
});

/**
 * VÉRIFICATION DU TOKEN (Magic Link)
 * Pour les JURYS.
 */
export const verifyToken = catchAsync(async (req: any, res: any, next: any) => {
  const { token } = req.query;

  if (!token) {
    return next(new AppError("Token manquant", 400));
  }

  const user = await prisma.user.findFirst({
    where: { loginToken: token as string },
  });

  if (!user) {
    return next(new AppError("Lien invalide ou expiré.", 401));
  }

  // Vérification de l'expiration du token
  if (user.tokenExpires && new Date() > new Date(user.tokenExpires)) {
    // Token expiré : on le nettoie en base pour éviter des tentatives futures
    await prisma.user.update({
      where: { id: user.id },
      data: { loginToken: null, tokenExpires: null },
    });
    return next(
      new AppError(
        "Ce lien a expiré. Demandez un nouvel accès à l'administrateur.",
        401,
      ),
    );
  }

  // Invalidation du token (sécurité) : le lien magique est à usage unique.
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLogin: new Date(),
      loginToken: null,
      tokenExpires: null,
    },
  });

  const sessionToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" },
  );

  // Pose le JWT dans un cookie httpOnly (même logique que le login admin)
  res.cookie("marsai_token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
    },
  });
});

export const me = catchAsync(async (req: any, res: any) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  const userId = parseInt(req.user.id, 10);
  if (isNaN(userId)) {
    return res.status(401).json({ message: "Token corrompu" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Utilisateur non trouvé" });
  }

  return res.status(200).json({ user });
});
