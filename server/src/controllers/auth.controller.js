import { loginSchema } from "../validators/auth.validator.js";
import { loginAdmin } from "../services/auth.service.js";

/**
 * Gère la requête de connexion administrateur.
 * Reçoit email/password, valide, et renvoie le token.
 */
export const login = async (req, res) => {
  try {
    // 1. Validation des données entrantes (Zod)
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;

    // 2. Appel au service métier (qui utilise Prisma maintenant)
    const result = await loginAdmin(email, password);

    // 3. Gestion des erreurs métier
    if (!result) {
      // On reste vague pour la sécurité (ne pas dire si c'est l'email ou le mdp qui est faux)
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // 4. Succès
    return res.status(200).json(result);
  } catch (e) {
    // Si l'erreur est celle qu'on a lancée volontairement dans le service
    if (e.message === "Identifiants incorrects.") {
      // On renvoie un code 401 (Non autorisé) proprement
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Sinon, c'est un vrai bug technique (ex: base de données éteinte)
    console.error("Erreur Login Controller:", e);
    return res.status(500).json({ error: "Erreur serveur interne" });
  }
};
