import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

const Reveal = ({ children, delay = 0 }: RevealProps) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // On cible tous les enfants directs (vos textes)
      if (!root.current) return;
      gsap.from(root.current.children, {
        y: "100%", // On commence en bas, hors du champ de vision
        skewY: 5, // Légère torsion pour un effet organique
        duration: 1.5,
        ease: "power4.out", // La courbe d'accélération des pros
        delay: delay,
        stagger: 0.1, // Chaque mot/ligne arrive avec un petit décalage
        scrollTrigger: {
          trigger: root.current,
          start: "top 90%", // Déclenche quand l'élément entre dans la vue
        },
      });
    },
    { scope: root },
  );

  return (
    // 'overflow-hidden' est CRUCIAL : il sert de masque.
    // Le texte sort de nulle part.
    <div ref={root} className="overflow-hidden flex flex-wrap">
      {children}
    </div>
  );
};

export default Reveal;
