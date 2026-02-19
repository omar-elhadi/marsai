import React, { useState, useEffect } from "react";

const TypewriterHeader = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <h1 className="text-3xl md:text-5xl font-black mb-4 text-center tracking-tighter uppercase italic min-h-[60px]">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">
        {displayText}
      </span>
      <span className="animate-pulse ml-2 inline-block w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]"></span>
    </h1>
  );
};

const Calendrier = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const events = [
    { id: "MISSION_01", title: "Conférence : L'IA dans l'art", details: "Intervenants : Dr. Jane Doe...\nHoraires : 10h00 - 12h00\nLieu : Salle Alpha" },
    { id: "MISSION_02", title: "Atelier : Robotique pour débutants", details: "Ing. Alice Martin\nHoraires : 14h00 - 16h00\nLieu : Salle Beta" },
    { id: "MISSION_03", title: "Projection : Film généré par IA", details: "Horaires : 18h00 - 20h00\nLieu : Auditorium" },
  ];

  return (
    <div className="calendar-page flex items-center justify-center min-h-screen bg-black p-6 font-serif relative overflow-hidden">
      
      <style>{`
        @keyframes filmFlicker { 0% { opacity: 0.98; } 50% { opacity: 1; } 100% { opacity: 0.99; } }
        .retro-cinema { 
          background: radial-gradient(circle, transparent 20%, #000 150%); 
          animation: filmFlicker 0.15s infinite; 
        }

        /* CONTOUR NÉON DÉGRADÉ VIOLET/ROSE */
        .neon-gradient-border {
          position: relative;
          background: #4a370b; /* DORÉ FONCÉ */
          border: 4px solid transparent;
          background-clip: padding-box;
          border-image: linear-gradient(to right, #7e22ce, #ec4899, #7e22ce) 1;
          animation: neonPulse 3s infinite ease-in-out;
        }

        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(236, 72, 153, 0.4), inset 0 0 20px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 30px rgba(126, 34, 206, 0.8), inset 0 0 20px rgba(0,0,0,0.5); }
        }

        .btn-action-neon {
          transition: all 0.3s;
          border: 1px solid #ec4899;
          background: rgba(0,0,0,0.4);
          color: #ff91d2;
          font-weight: 900;
        }
        .btn-action-neon:hover {
          background: #ec4899;
          color: #fff;
          box-shadow: 0 0 20px #ec4899;
          transform: scale(1.05);
        }
      `}</style>

      {/* Overlay Grain de film */}
      <div className="absolute inset-0 pointer-events-none opacity-10 retro-cinema bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-4xl w-full p-8 neon-gradient-border relative z-10">
        
        {/* Badge Mars AI */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-pink-500 px-5 py-1 text-[10px] font-black uppercase tracking-[0.4em] border border-pink-500 shadow-[0_0_10px_#ec4899]">
          Mars Ai • Ultra Deluxe
        </div>

        <TypewriterHeader text="Calendrier du Festival" />

        {/* --- BOUTONS HORS RECTANGLES --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 pb-6 border-b border-yellow-900/30">
          <button className="btn-action-neon px-6 py-2 text-[11px] uppercase tracking-widest rounded-sm">
            S'inscrire
          </button>
          <button className="btn-action-neon px-6 py-2 text-[11px] uppercase tracking-widest rounded-sm">
            Réserver
          </button>
          <button className="btn-action-neon px-6 py-2 text-[11px] uppercase tracking-widest rounded-sm flex items-center gap-2">
            <span>💳</span> Payer par Carte
          </button>
        </div>

        <div className="space-y-4 w-full">
          {events.map((event, index) => (
            <div key={index} className="transition-all duration-500">
              <button
                onClick={() => toggleAccordion(index)}
                className={`w-full flex justify-between items-center p-5 border transition-all ${
                  openIndex === index 
                  ? "bg-black text-pink-400 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                  : "bg-[#2d2207] border-yellow-900/50 text-yellow-100 hover:border-pink-500"
                }`}
              >
                <span className="text-[10px] font-mono opacity-60">[{event.id}]</span>
                <span className="text-lg font-black uppercase italic tracking-wider">{event.title}</span>
                <span>{openIndex === index ? "⊖" : "⊕"}</span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-5 bg-black/60 border-x border-b border-pink-500/50 text-yellow-50 italic text-center font-serif">
                  <pre className="whitespace-pre-wrap">{event.details}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-yellow-900/30 text-center text-[10px] text-pink-500 tracking-[0.5em] uppercase font-bold animate-pulse">
          Système Mars Ai // Mode Nuit Confirmé
        </div>
      </div>

      {/* Vignettage pour l'effet cinéma */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]"></div>
    </div>
  );
};

export default Calendrier;