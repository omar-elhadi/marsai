import { userService } from "../services/user.service.js";
import { z } from "zod";

// Schéma de création
const userSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .optional() // On le rend optionnel
    .transform((val) => (val === "" ? undefined : val)) // S'il est vide, on le transforme en undefined
    .refine((val) => !val || val.length >= 6, {
      message: "Le mot de passe doit faire au moins 6 caractères",
    }),
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

// Schéma de mise à jour
const updateUserSchema = z.object({
  email: z.string().email("Format d'email invalide").optional(),
  password: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)) // Même logique ici
    .refine((val) => !val || val.length >= 6, {
      message: "Le mot de passe doit faire au moins 6 caractères",
    }),
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  role: z.enum(["ADMIN", "JURY"]).optional(),
});

export const userController = {
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
      res.status(500).json({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);
      const updateData = Object.fromEntries(
        Object.entries(validatedData).filter(([_, v]) => v !== undefined),
      );
      const updatedUser = await userService.update(id, updateData);
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError)
        return res.status(400).json({ error: "Validation échouée" });
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  },
  remove: async (req, res) => {
    try {
      await userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  },
};
