import { userService } from "../services/user.service.js";
import { z } from "zod";

// 1. Mise à jour du Schéma de validation (Zod)
const userSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom est trop court"), // Changé
  lastName: z.string().min(2, "Le nom est trop court"), // Changé
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

export const userController = {
  create: async (req, res) => {
    try {
      // Zod va maintenant valider firstName et lastName
      const validatedData = userSchema.parse(req.body);

      // On passe les données validées au service
      const newUser = await userService.create(validatedData);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation échouée",
          details: error.flatten().fieldErrors,
        });
      }
      // Log de l'erreur pour t'aider en cas de souci Prisma
      console.error("Erreur création user:", error);
      res
        .status(500)
        .json({ error: error.message || "Erreur serveur lors de la création" });
    }
  },
  // ... le reste (list, remove) ne change pas

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
