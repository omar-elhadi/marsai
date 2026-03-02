import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PAGE : Connexion Administration (LoginAdmin.jsx)
 * Gère l'accès sécurisé et le stockage des tokens Marsai.
 */
export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL;
      
      if (!apiBaseUrl) {
        throw new Error("Configuration VITE_API_URL manquante dans le .env");
      }

      // ✅ FIX : On utilise ${apiBaseUrl}/auth/login
      // Car VITE_API_URL contient déjà le "/api"
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Identifiants incorrects.");
      }

      // ✅ HARMONISATION DES TOKENS
      // 1. Pour ton ProtectedRoute (le gardien de la route)
      localStorage.setItem("marsai_token", data.token);
      localStorage.setItem("marsai_user", JSON.stringify(data.user));
      
      // 2. Pour ton AdminDashboard (le tableau de données)
      localStorage.setItem("token", data.token);

      setSuccess("Connexion réussie !");
      
      // Petit délai pour laisser l'utilisateur voir le message de succès
      setTimeout(() => {
        // Redirection vers le dashboard
        navigate("/admin", { replace: true });
      }, 800);

    } catch (err) {
      console.error("Erreur Login:", err);
      setError(err.message || "Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12 font-sans">
      <form
        className="w-full max-w-md bg-[#111827] rounded-2xl shadow-xl p-8 space-y-6 border border-white/10"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold text-center">
            Marsai Festival
          </p>
          <h2 className="text-2xl font-bold text-white text-center italic tracking-tighter">
            ADMIN_LOGIN
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block ml-1">Email</label>
            <input
              type="email"
              placeholder="admin@marsai.local"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 block ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg animate-pulse">
            <p className="text-[11px] text-red-400 text-center font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
            <p className="text-[11px] text-emerald-400 text-center font-medium">{success}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-white py-3 text-xs font-black text-black hover:bg-gray-200 disabled:opacity-50 transition-all uppercase tracking-widest"
          disabled={loading}
        >
          {loading ? "Authentification..." : "Accéder à la gestion"}
        </button>
      </form>
    </div>
  );
}