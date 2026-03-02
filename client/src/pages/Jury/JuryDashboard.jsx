import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JuryDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Étape 2 : Récupération de l'identité
    const savedUser = localStorage.getItem("marsai_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Sécurité : si pas d'utilisateur, retour au login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("marsai_token");
    localStorage.removeItem("marsai_user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      {/* Header du Dashboard */}
      <header className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase">
            Espace <span className="font-bold text-indigo-500">Jury</span>
          </h1>
          <p className="text-zinc-500 mt-2">Festival International MARSAI</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-zinc-400">Bienvenue,</p>
            <p className="font-medium">{user.firstName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contenu principal (Étape 3 à venir) */}
      <main>
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-20 text-center">
          <h2 className="text-xl text-zinc-400 font-light">
            Sélection de films en attente...
          </h2>
          <p className="text-zinc-600 mt-2 text-sm">
            L'accès aux votes sera disponible prochainement.
          </p>
        </div>
      </main>
    </div>
  );
}