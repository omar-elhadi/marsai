import { useEffect, useState } from "react";

function NewsletterPopUp() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Ici tu peux appeler ton API backend
    console.log("Inscription newsletter :", email);

    localStorage.setItem("newsletter_subscribed", "true");
    setSubmitted(true);

    setTimeout(() => setOpen(false), 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {!submitted ? (
          <>
            <h2 className="mb-2 text-xl font-semibold text-black"> Inscris-toi à la newsletter du Festival de Marsai</h2>
            <p className="mb-4 text-sm text-gray-600">
              Le festival de l’IA arrive avec ses nouveautés et offres exclusives !
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Ton email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-gray-300 bg-black-100 text-black"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-black py-2 text-white hover:opacity-90"
              >
                S'inscrire
              </button>
            </form>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-gray-400 hover:underline"
              >
                Non merci
              </button>
              <button
                onClick={() => console.log('Je participe au festival!')}
                className="text-xs text-blue-500 hover:underline"
              >
                🚀 Je participe au festival !
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-green-600">
            ✅ Merci pour ton inscription !
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsletterPopUp;