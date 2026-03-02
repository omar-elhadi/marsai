import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../Button'; 

gsap.registerPlugin(ScrollTrigger);

const ReglesConditions = () => {
  const containerRef = useRef(null);
  const chatRef = useRef(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Système Mars AI en ligne. Comment puis-je assister votre déploiement aujourd\'hui ?' }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickReplies = [
    { label: "Format Vidéo ?", action: "Quel est le format requis ?" },
    { label: "Droits d'auteur", action: "Qui possède les droits des films ?" },
    { label: "Deadline", action: "Quelle est la date limite ?" },
    { label: "Problème technique", action: "J'ai un bug sur le terminal." }
  ];

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 0.9;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    
    setTimeout(() => {
      let reply = "Requête reçue. Analyse des serveurs Marseille-01... La réponse est conforme aux protocoles 2026. Voulez-vous plus de précisions ?";
      if (text.includes("format")) reply = "Le format doit être strictement 4K, en 21:9 (Cinema) ou 9:16 (Vertical). Durée : 60s.";
      if (text.includes("droits")) reply = "Vous restez propriétaire. Mars AI dispose d'un droit de diffusion exclusif pour l'édition 2026.";
      
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      speak(reply);
    }, 600);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* BACKGROUND CINÉMATIQUE */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        <img className="w-full h-full object-cover opacity-20" src="https://plus.unsplash.com/premium_photo-1705091308945-19adc45aeb07?q=80&w=1074" alt="Mars AI" />
      </div>

      {/* CONTENU RÉGLER & CONDITIONS */}
      <main className="relative z-20 px-8 flex flex-col items-center pt-[20vh] pb-60 text-center">
        <header className="mb-40">
          <span className="text-[10px] tracking-[0.8em] text-orange-400 font-black uppercase mb-6 block">Protocol 2026 // AI Rules</span>
          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-none lowercase italic">règles & <span className="text-orange-400">conditions.</span></h1>
        </header>

        <div className="rules-grid grid grid-cols-1 gap-y-40 max-w-2xl w-full">
          {[
            { id: "01", title: "L'Algorithme", text: "Toute œuvre doit être générée via des modèles d'IA éthiques et traçables." },
            { id: "02", title: "L'Espace Temps", text: "Le rendu final ne doit pas excéder 60 secondes terrestres." }
          ].map(rule => (
            <div key={rule.id} className="group cursor-pointer" onClick={() => { setIsChatOpen(true); handleSendMessage(`Parle moi de : ${rule.title}`); }}>
              <span className="text-[10px] text-orange-400/40 font-bold tracking-widest uppercase">Section {rule.id}</span>
              <h3 className="text-3xl font-black italic mt-4 group-hover:text-orange-400 transition-colors uppercase tracking-tight">{rule.title}</h3>
              <p className="text-slate-400 mt-6 text-xl font-light italic leading-relaxed">"{rule.text}"</p>
              <div className="h-[1px] w-12 bg-white/10 mx-auto mt-10 group-hover:w-32 transition-all duration-700" />
            </div>
          ))}
        </div>
      </main>

      {/* --- CHATBOT GPT STYLE --- */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="w-[350px] md:w-[400px] h-[550px] bg-black/95 border border-white/10 rounded-[2.5rem] mb-6 backdrop-blur-3xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/5">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-orange-400/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase">Mars AI Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="opacity-40 hover:opacity-100">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-orange-400 text-black font-bold' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK REPLIES */}
            <div className="px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => handleSendMessage(qr.action)} className="whitespace-nowrap px-3 py-1.5 border border-white/10 rounded-full text-[10px] hover:bg-white/10 transition-colors">
                  {qr.label}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); setInputValue(""); }} className="p-6">
              <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-orange-400/50 transition-colors" placeholder="Posez votre question..." />
            </form>
          </div>
        )}

        <button onClick={() => { setIsChatOpen(!isChatOpen); if(!isChatOpen) speak("Terminal Mars AI activé."); }} className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform group relative">
          <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-10" />
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReglesConditions;