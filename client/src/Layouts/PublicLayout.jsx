import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import Lenis from 'lenis';

function PublicLayout() {
  useEffect(() => {
    // Initialisation de Lenis : Le moteur de l'élégance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1, 
    });

    // Boucle d'animation (RAF : Request Animation Frame)
    // C'est ce qui rend le mouvement fluide à 60 ou 120 FPS
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Nettoyage : Une règle d'or pour éviter de saturer la RAM du visiteur
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Le Header reste fixe en haut */}
      <Header />
      
      {/* Le conteneur principal qui recevra vos pages animées */}
      <main className="flex-1 w-full">
        <Outlet /> 
      </main>
      
      {/* Le Footer en bas de page */}
      <Footer />
    </div>
  );
}

export default PublicLayout;