// On utilise une variable d'environnement ou l'URL par défaut de ton serveur local
const API_URL = "http://localhost:5001/api";

export const userService = {
  /**
   * Récupère tous les jurys
   * @param {string} token - Le JWT de l'admin connecté
   */
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Échec de la récupération des jurys");
    }
    return response.json();
  },

  /**
   * Supprime un utilisateur
   */
  delete: async (id, token) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }
    return true; // Succès 204
  },
};
