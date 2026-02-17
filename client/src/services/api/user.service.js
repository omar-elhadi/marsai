const API_URL = "http://localhost:5001/api";

export const userService = {
  /**
   * Récupère la liste de tous les utilisateurs (Jurys + Admins)
   */
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la récupération des utilisateurs",
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crée un nouvel utilisateur (Jury)
   * Nommé 'register' pour correspondre à l'appel dans AdminDashboard.jsx
   */
  register: async (userData, token) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création de l'utilisateur",
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Supprime un utilisateur par son ID
   */
  delete: async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Met à jour un utilisateur existant
   */
  update: async (userId, userData, token) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT", // On utilise PUT pour la modification
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour de l'utilisateur",
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
