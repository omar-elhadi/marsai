function Button({ 
  children, 
  onClick, 
  type = "button", 
  disabled = false, 
  className = "" 
}) {
  
  // Styles de base (forme, typo, majuscules, espacement)
  const baseStyles = "px-12 py-4 font-bold text-sm tracking-[0.2em] transition-all duration-300 uppercase rounded-sm shadow-lg";
  
  // Style ACTIF (Le violet flashy demandé)
  // - bg-indigo-500 : Le violet vif du titre
  // - border border-white : La bordure blanche fine
  // - text-white : Texte blanc
  // - hover:bg-indigo-400 : S'éclaircit légèrement au survol
  const activeStyles = "bg-indigo-500 text-white border border-white hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transform hover:-translate-y-1";
  
  // Style DÉSACTIVÉ (Gris sombre, bordure discrète)
  const disabledStyles = "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${disabled ? disabledStyles : activeStyles}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;