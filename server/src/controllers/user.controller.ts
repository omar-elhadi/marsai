import { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import prisma from "../utils/prisma.js"; // SANS les accolades
import crypto from "crypto";
import { mailService } from "../services/mail.service.js";

/**
 * CONTRÔLEUR : Gestion des Utilisateurs
 * Gère le CRUD et l'envoi des invitations Magic Link.
 */
export const userController = {
  /**
   * Récupérer tous les membres (Admin & Jury)
   */
  getAll: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(users);
    } catch {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des membres" });
    }
  },

  /**
   * Création d'un nouveau membre
   * Note : Si le password est absent, le compte reste "en attente" d'activation via Magic Link.
   */
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const newUser = await prisma.user.create({
        data: {
          email,
          password, // Sera null si non fourni (Jury)
          firstName,
          lastName,
          role: role || "JURY",
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({
        message: "Erreur lors de la création : " + (error as Error).message,
      });
    }
  },

  /**
   * ENVOI DE L'INVITATION (Magic Link)
   * Génère un token unique, définit une expiration et envoie le mail.
   */
  sendInvite: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      // 1. Récupération du membre
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({ message: "Membre introuvable" });
      }

      // 2. Génération d'un token sécurisé de 64 caractères (hex)
      const token = crypto.randomBytes(32).toString("hex");

      // 3. Calcul de l'expiration — valable jusqu'à la fin du festival (22 juin 2026)
      const expires = new Date("2026-06-22T23:59:59.000Z");

      // 4. Mise à jour en base de données
      // On utilise les noms de colonnes exacts de ton schéma : loginToken et tokenExpires
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginToken: token,
          tokenExpires: expires,
        },
      });

      // 5. Envoi effectif de l'email via le service
      await mailService.sendMagicLink(user.email, token, user.firstName);

      res.json({
        message: `Lien magique envoyé avec succès à ${user.firstName} (${user.email})`,
      });
    } catch (error) {
      logger.error({ err: error }, "Erreur sendInvite:");
      res.status(500).json({
        message:
          "Échec de l'envoi de l'invitation. Vérifiez la configuration SMTP.",
      });
    }
  },

  /**
   * Mise à jour d'un membre
   */
  update: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const data = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data,
      });

      res.json(updatedUser);
    } catch {
      res.status(400).json({ message: "Erreur lors de la mise à jour" });
    }
  },

  /**
   * Suppression d'un membre
   */
  delete: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Membre supprimé" });
    } catch {
      res.status(400).json({ message: "Erreur lors de la suppression" });
    }
  },
};
