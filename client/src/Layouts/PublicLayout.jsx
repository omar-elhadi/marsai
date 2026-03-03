import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header        from '@/components/layouts/Header';
import Footer        from '@/components/layouts/Footer';
import Lenis         from 'lenis';
import gsap          from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// TODO: Etape 3 Kodawari — importer ScrollProgressBar ici

function PublicLayout() {
  const lenisRef     = useRef(null);
  const { pathname } = useLocation();

  // Integration officielle Lenis + GSAP ScrollTrigger
  //
  // CAUSE RACINE ECRAN NOIR :
  // L ancienne version utilisait requestAnimationFrame manuel.
  // GSAP ScrollTrigger ecoute les evenements scroll natifs.
  // Lenis intercepte le scroll natif et applique son easing —
  // GSAP ne recevait jamais les vraies positions Lenis.
  // Les deux etaient desynchronises : pin:true se declenchait
  // au mauvais moment, creant flashes noirs et positions incorrectes.
  //
  // SOLUTION — integration officielle Lenis + GSAP :
  //
  //   gsap.ticker.add(lenisRaf)
  //     Le ticker GSAP pilote Lenis. Un seul rAF au lieu de deux.
  //
  //   lenis.on('scroll', ScrollTrigger.update)
  //     Chaque deplacement Lenis -> ScrollTrigger recalcule
  //     immediatement. Synchronisation frame-par-frame.
  //
  //   gsap.ticker.lagSmoothing(0)
  //     Desactive la compensation de lag GSAP. Sans ca, GSAP
  //     peut sauter des frames lors de pics CPU — discontinuites
  //     visuelles dans le scroll scrub.
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

  // Bridge lenis:resize
  // GSAP pin:true cree un spacer qui agrandit le document.
  // Lenis ne detecte pas ce changement seul.
  // MovieGallery dispatche lenis:resize depuis onRefresh().
  //
  // Bridge lenis:scrollTo
  // goToPage dispatche lenis:scrollTo AVANT tout changement d etat.
  // Lenis saute instantanement (immediate:true) vers la cible.
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

  // Resize Lenis a chaque navigation (PublicLayout ne se demonte jamais)
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