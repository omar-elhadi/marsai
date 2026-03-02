import React, { useState, useEffect } from "react";

const TypewriterHeader = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60);
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <div className="flex flex-col items-center mb-10">
      <h1 className="text-4xl md:text-6xl font-black text-center tracking-tight leading-tight font-sans">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-400">
          {displayText}
        </span>
      </h1>
      {/* Barre décorative animée plus élégante */}
      <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-4 animate-pulse"></div>
    </div>
  );
};

const Calendrier = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const events = [
    { id: "01", title: "Conférence : L'IA dans l'art", details: "Intervenants : Dr. Jane Doe...\nHoraires : 10h00 - 12h00\nLieu : Salle Alpha" },
    { id: "02", title: "Atelier : Robotique pour débutants", details: "Ing. Alice Martin\nHoraires : 14h00 - 16h00\nLieu : Salle Beta" },
    { id: "03", title: "Projection : Film généré par IA", details: "Horaires : 18h00 - 20h00\nLieu : Auditorium" },
  ];

  return (
    <div className="calendar-page flex items-center justify-center min-h-screen bg-[#050508] p-6 font-sans relative overflow-hidden text-slate-200">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        .font-sans { font-family: 'Inter', sans-serif; }

        /* BORDURE DOUCE ET PROFONDEUR */
        .premium-card {
          background: rgba(15, 15, 25, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .btn-premium {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-premium:hover {
          background: white;
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        .accordion-item {
          transition: all 0.3s ease;
          border-radius: 12px;
          margin-bottom: 8px;
        }
      `}</style>

      {/* Halo lumineux en arrière-plan (plus doux que le néon) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl w-full p-10 premium-card relative z-10">
        
        <div className="flex justify-center mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-indigo-400 bg-indigo-400/10 px-4 py-1 rounded-full border border-indigo-400/20">
            Mars Ai • Edition 2026
          </span>
        </div>

        <TypewriterHeader text="Calendrier du Festival" />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="btn-premium px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full">S'inscrire</button>
          <button className="btn-premium px-8 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full">Réserver</button>
        </div>

        <div className="space-y-3 w-full font-sans">
          {events.map((event, index) => (
            <div key={index} className="accordion-item overflow-hidden">
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full flex justify-between items-center p-6 transition-all duration-300 ${
                  openIndex === index 
                  ? "bg-white/10 text-white" 
                  : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono opacity-30">{event.id}</span>
                  <span className="text-lg font-bold tracking-tight">{event.title}</span>
                </div>
                <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-indigo-400' : 'rotate-0'}`}>
                  <span className="text-2xl">+</span>
                </div>
              </button>

              <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-6 bg-white/[0.01] text-slate-400 text-sm leading-relaxed border-t border-white/5">
                  <pre className="font-sans whitespace-pre-wrap">{event.details}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-[9px] text-slate-500 tracking-[0.4em] uppercase font-medium">
          Interface Sécurisée — Station Mars Ai
        </div>
      </div>
    </div>
  );
};

export default Calendrier;