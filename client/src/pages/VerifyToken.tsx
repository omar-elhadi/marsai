import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Vérification de votre accès...");
  const token = searchParams.get("token");
  // Ref pour éviter le double appel causé par React.StrictMode en développement
  const called = useRef(false);

  useEffect(() => {
    // Si déjà appelé (StrictMode double-mount), on stoppe immédiatement
    if (called.current) return;
    called.current = true;

    const verify = async () => {
      if (!token) {
        setStatus("Lien d'invitation manquant.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-token?token=${token}`,
          { credentials: "include" }, // Le cookie httpOnly est posé automatiquement
        );
        const data = await response.json();

        if (response.ok) {
          // Le token est dans un cookie httpOnly — on stocke uniquement les infos utilisateur
          localStorage.setItem("marsai_user", JSON.stringify(data.user));

          setStatus("Accès validé ! Redirection...");
          setTimeout(() => navigate("/jury/dashboard"), 1500);
        } else {
          setStatus(data.error || "Lien invalide ou expiré.");
        }
      } catch (err) {
        setStatus("Erreur de connexion au serveur.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
      <div className="text-center p-8 border border-gray-800 rounded-2xl bg-zinc-900/50">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <p className="text-xl font-light tracking-tight">{status}</p>
      </div>
    </div>
  );
}
