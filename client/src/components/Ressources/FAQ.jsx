import { useState } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 group">
      <button
        className="w-full flex justify-between items-center py-8 text-left transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={`text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#E6D5AC]' : 'text-white/90 group-hover:text-white'}`}>
          {question}
        </h3>
        <span
          className={`ml-6 transform transition-transform duration-500 ${
            isOpen ? 'rotate-180 text-[#D4AF37]' : 'rotate-0 text-white/40'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="pb-8 text-lg text-white/60 leading-relaxed font-light italic border-l border-[#D4AF37]/30 pl-6 ml-1">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const currentYear = 2026;

  const faqData = [
    {
      question: "Comment puis-je soumettre mon film ?",
      answer: "Les soumissions sont ouvertes via notre plateforme dédiée. Vous trouverez un lien 'SOUMETTRE' dans le menu principal qui vous guidera tout au long du processus."
    },
    {
      question: "Quels sont les critères de sélection ?",
      answer: "Nous recherchons des œuvres narratives qui explorent l'utilisation créative et éthique de l'IA générative dans leur processus de production."
    },
    {
      question: "Le festival est-il ouvert au public ?",
      answer: "Certaines projections et conférences seront ouvertes au public sur billetterie. Les détails seront annoncés prochainement."
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      
      {/* ── BACKGROUND AVEC IMAGE ET OVERLAY ── */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop" 
          alt="Cinema Background" 
          className="w-full h-full object-cover opacity-40"
        />
        {/* Gradient radial pour l'effet de profondeur cinéma */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,rgba(5,5,5,1)_90%)]" />
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-[20vh] pb-40">
        
        {/* Petit label en haut */}
        <div className="mb-8 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#E6D5AC] opacity-70">
            Protocol Assistance // FAQ
          </p>
        </div>

        {/* TITRE GÉANT MARSAI STYLE (Blanc Sable Doré) */}
        <h1 className="text-[15vw] md:text-[200px] font-black leading-none tracking-tighter mb-24 select-none italic uppercase">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FAF0E6] via-[#E6D5AC] to-[#D4AF37] drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            MARSAI
          </span>
          <span className="text-[#D4AF37] animate-pulse">.</span>
        </h1>

        {/* SECTION DES QUESTIONS (Centrée ou décalée) */}
        <div className="w-full max-w-4xl ml-auto md:mr-20">
          <div className="mb-12">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40 mb-2">Questions Fréquentes</h2>
            <div className="h-1 w-20 bg-[#D4AF37]"></div>
          </div>
          
          <div className="space-y-2">
            {faqData.map((item, index) => (
              <FaqItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </main>

      {/* ── FOOTER STYLE GÉNÉRIQUE ── */}
      <footer className="relative z-10 w-full px-10 py-16 mt-20 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white/40 text-[10px] tracking-[0.4em] uppercase">
          <div className="flex items-center gap-6 font-bold">
            <span className="text-[#D4AF37]">Marseille</span>
            <span className="w-2 h-2 rounded-full bg-white/10"></span>
            <span>Station 01 — {currentYear}</span>
          </div>
          <p className="text-center">© {currentYear} Marsai. L'apogée du cinéma génératif.</p>
        </div>
      </footer>

      {/* Effet de vignettage cinéma final */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_15vw_rgba(0,0,0,1)] z-20" />
    </div>
  );
};

export default FAQ;