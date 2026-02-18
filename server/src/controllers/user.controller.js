import { userService } from "../services/user.service.js";
import { z } from "zod";

// 1. Schéma de validation pour la CRÉATION
const userSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

// 2. Schéma de validation pour la MISE À JOUR (Champs optionnels)
const updateUserSchema = z.object({
  email: z.string().email("Format d'email invalide").optional(),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères")
    .optional()
    .nullable(),
  firstName: z.string().min(2, "Le prénom est trop court").optional(),
  lastName: z.string().min(2, "Le nom est trop court").optional(),
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

export const userController = {
  // CRÉER un utilisateur
  create: async (req, res) => {
    try {
      const validatedData = userSchema.parse(req.body);
      const newUser = await userService.create(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation échouée",
          details: error.flatten().fieldErrors,
        });
      }
      console.error("Erreur création user:", error);
      res.status(500).json({ error: error.message || "Erreur serveur" });
    }
  },

  // LISTER les utilisateurs
  list: async (req, res) => {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Impossible de récupérer les utilisateurs" });
    }
  },

  // MODIFIER un utilisateur
  update: async (req, res) => {
    try {
      const { id } = req.params;

      // On valide les données avec le schéma de mise à jour
      const validatedData = updateUserSchema.parse(req.body);

      // On nettoie l'objet pour ne pas envoyer de champs "undefined" au service
      const updateData = Object.fromEntries(
        Object.entries(validatedData).filter(([_, v]) => v !== undefined),
      );

      const updatedUser = await userService.update(id, updateData);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation échouée",
          details: error.flatten().fieldErrors,
        });
      }
      console.error("Erreur lors de l'update :", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  },

  // SUPPRIMER un utilisateur
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  },
};
