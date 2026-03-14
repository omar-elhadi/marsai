// @ts-nocheck
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Parallax = ({ children, speed = 1, className = "" }) => {
  const target = useRef();

  useGSAP(() => {
    // Calcul de la puissance du mouvement : 
    // Un speed de 1.2 signifie que l'élément bouge 20% plus vite/lentement.
    const yMovement = (speed - 1) * 100;

    gsap.to(target.current, {
      yPercent: yMovement,
      ease: "none", // Indispensable pour que le mouvement soit lié strictement au scroll
      scrollTrigger: {
        trigger: target.current,
        start: "top bottom", // Commence quand le haut de l'élément touche le bas de l'écran
        end: "bottom top",   // Finit quand le bas de l'élément touche le haut de l'écran
        scrub: true,         // Synchronisation parfaite avec la barre de scroll
      }
    });
  }, { scope: target });

  return (
    <div ref={target} className={className}>
      {children}
    </div>
  );
};

export default Parallax;