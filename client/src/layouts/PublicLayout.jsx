import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header        from '@/components/layouts/Header';
import Footer        from '@/components/layouts/Footer';
import Lenis         from 'lenis';

// ─────────────────────────────────────────────────────────────
// TODO · Étape 3 du Plan Kodawari
// ─────────────────────────────────────────────────────────────
// Importer et monter ScrollProgressBar une fois l'étape 3 lancée :
//
//   import ScrollProgressBar from '@/components/common/ScrollProgressBar';
//   → Placer <ScrollProgressBar /> juste avant le <Header />
//
// Ne pas anticiper cette intégration avant que l'Étape 2
// (réorganisation de components/) soit validée.
// ─────────────────────────────────────────────────────────────

function PublicLayout() {
  const lenisRef          = useRef(null);
  const { pathname }      = useLocation();
  const rafHandleRef      = useRef(null);

  // ── Initialisation Lenis — une seule fois au montage ─────
  useEffect(() => {
    const lenis = new Lenis({
      duration:      1.2,
      easing:        (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:   true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      rafHandleRef.current = requestAnimationFrame(raf);
    }
    rafHandleRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafHandleRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Resize Lenis à chaque navigation ─────────────────────
  //
  // CAUSE RACINE DU BUG DE SCROLL :
  // Lenis mesure la hauteur scrollable du document à son
  // initialisation et la mémorise. PublicLayout ne se démonte
  // jamais entre les navigations — Lenis conserve donc la hauteur
  // de la page précédente comme limite. Une page plus longue est
  // rendue dans le DOM mais Lenis l'ignore : le scroll s'arrête
  // à l'ancienne hauteur.
  //
  // lenis.resize() force Lenis à recalculer les dimensions réelles
  // du document après que React a rendu le nouveau contenu.
  // requestAnimationFrame garantit que le DOM est peint avant
  // le recalcul — sans ça, Lenis mesure le contenu en cours
  // de rendu et peut obtenir une hauteur partielle.
  useEffect(() => {
    if (!lenisRef.current) return;

    const raf = requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Le Header reste fixe en haut */}
      <Header />

      {/* Le conteneur principal qui reçoit les pages */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Le Footer en bas de page */}
      <Footer />
    </div>
  );
}

export default PublicLayout;