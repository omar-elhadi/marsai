import { userService } from "../services/user.service.js";
import { z } from "zod";

// Schéma de validation pour la création d'un utilisateur
const userSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
  name: z.string().min(2, "Le nom est trop court"),
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

export const userController = {
  // Gère la création
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
      res.status(500).json({ error: "Erreur serveur lors de la création" });
    }
  },

  // Gère la liste
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

  // --- MÉTHODE À RAJOUTER ---
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.status(204).send(); // Succès, pas de contenu à renvoyer
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  },
};
