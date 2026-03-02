import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Vérification de votre accès...");
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("Lien d'invitation manquant.");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-token?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("marsai_token", data.token);
          localStorage.setItem("marsai_user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token); // Compatibilité anciens composants

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