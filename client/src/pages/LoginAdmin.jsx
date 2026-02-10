import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Login admin form

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
        throw new Error("VITE_API_URL manquant dans le .env");
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Connexion impossible.");
      }

      localStorage.setItem("marsai_token", data.token);
      localStorage.setItem("marsai_user", JSON.stringify(data.user));
      setSuccess("Connexion réussie.");
      setPassword("");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12 font-sans">
      <form
        className="w-full max-w-md bg-[#111827] rounded-2xl shadow-xl p-8 space-y-5 border border-white/10"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400 font-bold">
            Admin
          </p>
          <h2 className="text-2xl font-semibold text-white">Connexion</h2>
          <p className="text-sm text-white/50">Accédez au panneau d'administration</p>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
