import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header           from '@/components/layouts/Header';
import Footer           from '@/components/layouts/Footer';
import Lenis            from 'lenis';
import gsap             from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// TODO: Étape 3 Kodawari — importer ScrollProgressBar ici

function PublicLayout() {
  const lenisRef     = useRef(null);
  const { pathname } = useLocation();

  // ── Intégration officielle Lenis + GSAP ScrollTrigger ────
  //
  // L'ancienne version pilotait Lenis via requestAnimationFrame
  // manuel. GSAP ScrollTrigger écoutait les événements scroll
  // natifs — que Lenis intercepte et remplace par son propre
  // easing. GSAP recevait donc les positions natives incorrectes,
  // pas les positions réelles de Lenis. Désynchronisation totale.
  //
  //   gsap.ticker.add(lenisRaf)
  //     Le ticker GSAP pilote Lenis. Un seul RAF, une seule horloge.
  //
  //   lenis.on('scroll', ScrollTrigger.update)
  //     Chaque déplacement Lenis notifie ScrollTrigger immédiatement.
  //     Synchronisation frame-par-frame garantie.
  //
  //   gsap.ticker.lagSmoothing(0)
  //     Désactive la compensation de lag. Sans ça, GSAP peut sauter
  //     des frames lors de pics CPU — discontinuités dans le scrub.
  useEffect(() => {
    const lenis = new Lenis({
      duration:        1.2,
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:     true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const lenisRaf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenisRaf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Bridge lenis:resize ───────────────────────────────────
  // MovieGallery dispatche 'lenis:resize' depuis init() après
  // que trackOuter.height est posé. Lenis recalcule la hauteur
  // scrollable du document avec les nouvelles dimensions.
  //
  // ── Bridge lenis:scrollTo ─────────────────────────────────
  // goToPage et handleFilterChange dispatchent 'lenis:scrollTo'
  // AVANT tout changement d'état React. Lenis saute instantanément
  // en haut (immediate:true) avant que GSAP re-mesure.
  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(() => lenisRef.current?.resize());
    };

    const onScrollTo = (e) => {
      const target = e.detail?.target;
      if (!target || !lenisRef.current) return;
      lenisRef.current.scrollTo(target, { immediate: true, offset: 0 });
    };

    window.addEventListener('lenis:resize',   onResize);
    window.addEventListener('lenis:scrollTo', onScrollTo);

    return () => {
      window.removeEventListener('lenis:resize',   onResize);
      window.removeEventListener('lenis:scrollTo', onScrollTo);
    };
  }, []);

  // ── Resize Lenis à chaque navigation ─────────────────────
  // PublicLayout ne se démonte jamais entre les pages.
  // Lenis conserve la hauteur de la page précédente sans ce reset.
  useEffect(() => {
    if (!lenisRef.current) return;
    const raf = requestAnimationFrame(() => lenisRef.current?.resize());
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;