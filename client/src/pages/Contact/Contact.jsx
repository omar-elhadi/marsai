import React from 'react';

function Contact() {
  return (
    <div className="min-h-screen bg-midnight text-white font-sans selection:bg-indigo-500/30 pt-24 pb-20">
      
      {/* TITRE DE LA PAGE */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-indigo-400 uppercase tracking-[0.3em] text-sm md:text-base font-bold mb-8">
          Contact
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-light">
          Une question ? Une suggestion ? N'hésitez pas à nous contacter.
        </p>
      </div>

      {/* FORMULAIRE DE CONTACT */}
      <div className="max-w-2xl mx-auto px-6">
        <form className="space-y-6 bg-midnight-light border border-white/10 rounded-lg p-8 md:p-12">
          
          {/* NOM */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider"
            >
              Nom
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-midnight border border-white/20 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Votre nom"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-midnight border border-white/20 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="votre.email@exemple.com"
              required
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="6"
              className="w-full px-4 py-3 bg-midnight border border-white/20 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="Votre message..."
              required
            ></textarea>
          </div>

          {/* BOUTON D'ENVOI */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-md font-bold uppercase tracking-wider hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all transform hover:scale-[1.02]"
          >
            Envoyer le message
          </button>
        </form>
      </div>

    </div>
  );
}

export default Contact;