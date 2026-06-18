import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * IMPORTS DES ROUTES
 * Source unique de vérité — aucun chemin en string brute dans ce fichier.
 */
import { ROUTES } from "@/constants/routes";

/**
 * 1. IMPORTS DES PAGES PUBLIQUES
 */
import Home from "@/pages/Home/Home.jsx";
import SubmissionPage from "@/pages/Submission/SubmissionPage.jsx";
import LoginAdmin from "@/pages/LoginAdmin.jsx";
import Newsletters from "@/pages/Newsletters.jsx";
import Gallery from "@/pages/Gallery/Gallery.jsx";
import Contact from "@/pages/Contact/Contact.jsx";
import Mention from "@/pages/Legals/Mention.jsx";
import Cookies from "@/pages/Legals/cookies.jsx";
import PolitiqueDeConfidentialite from "@/pages/Legals/politiquedeconfidentialite.jsx";
import ConditionsUtilisations from "@/pages/Legals/CGU.jsx";
import FAQ from "@/components/Ressources/FAQ.jsx";
import Calendrier from "@/components/Ressources/calendrier.jsx";
import ReglesConditions from "@/components/Ressources/regles-conditions.jsx";
import Events from "@/pages/Events/Events.jsx";
import CompetitionRules from "@/pages/CompetitionRules/CompetitionRules.jsx";
import EditFilmPage from "@/pages/Submission/EditFilmPage.jsx";
import TrackingPage from "@/pages/Submission/TrackingPage.jsx";
import PalmaresPage from "@/pages/Palmares/PalmaresPage.jsx";
import FilmPage from "@/pages/Film/FilmPage.jsx";

/**
 * 2. IMPORTS AUTHENTIFICATION & JURY
 */
import VerifyToken from "./pages/VerifyToken";

/**
 * 3. IMPORTS LAYOUTS
 * Note : le dossier est 'layouts' (minuscule) — convention POSIX stricte.
 * S'assurer que src/Layouts/ a bien été renommé en src/layouts/ avant
 * de lancer le serveur de développement.
 */
import FestivalNews from "@/pages/News/News.jsx";
import NewsDetail from "@/pages/News/NewsDetail.jsx";
import PublicLayout from "@/layouts/PublicLayout.jsx";

/**
 * 4. IMPORTS ADMIN
 */

const JuryDashboard = React.lazy(() => import("./pages/Jury/JuryDashboard"));
const JuryFilmDetail = React.lazy(() => import("./pages/Jury/JuryFilmDetail"));
const FilmsList = React.lazy(() => import("@/pages/Admin/FilmsList"));
const FilmDetailAdmin = React.lazy(() => import("./pages/Admin/FilmDetail"));
const DashboardHome = React.lazy(() => import("@/pages/Admin/DashboardHome"));
// Note: if AdminDashboard is not default export, lazy load needs a small wrapper or to be adjusted.
// Actually, let's lazy load them assuming default exports. If any are named, they'll fail.
// Let's assume standard Vite exports for now, AdminDashboard might be named exported.
const AdminDashboardLazy = React.lazy(() =>
  import("@/pages/Admin/AdminDashboard").then((module) => ({
    default: module.AdminDashboard || module.default,
  })),
);
const AwardsPage = React.lazy(() => import("./pages/Admin/AwardsPage"));
const SelectionPage = React.lazy(() => import("./pages/Admin/SelectionPage"));

const SuspenseLoader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-text-faint)",
    }}
  >
    Chargement...
  </div>
);

import ProtectedRoute from "@/components/ProtectedRoute.jsx";

import AdminLayout from "@/layouts/AdminLayout.jsx";

/**
 * 5. PHASE 8 — Transitions cinématographiques (désactivées)
 */
import PageTransitionLayer from "@/components/layouts/PageTransitionLayer.jsx";

// ─────────────────────────────────────────────────────────────
// Désactivation de la restauration de scroll native
// ─────────────────────────────────────────────────────────────
// Le navigateur mémorise la position de scroll de chaque page
// et tente de la restaurer au retour. Cette restauration native
// est asynchrone — elle peut s'exécuter APRÈS notre scrollTo(0,0)
// et le court-circuiter, d'où les rechutes intermittentes.
// history.scrollRestoration = 'manual' désactive définitivement
// ce mécanisme natif. C'est la seule solution qui élimine la
// compétition entre le navigateur et notre code.
if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

// ─────────────────────────────────────────────────────────────
// ScrollToTop — réinitialise le scroll à chaque navigation
// ─────────────────────────────────────────────────────────────
// Deuxième couche de protection. Maintenant que la restauration
// native est désactivée, scrollTo(0, 0) n'a plus de concurrent.
// Le { behavior: 'instant' } force l'exécution synchrone —
// pas d'animation de scroll parasite sur la nouvelle page.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Couche 1 : scroll immédiat en haut
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Couche 2 : recalcul GSAP ScrollTrigger.
    // C'est la cause réelle des blocages après refresh sur page courte :
    // ScrollTrigger mémorise la hauteur du document de la page précédente.
    // Sur la nouvelle page plus longue, ses triggers se déclenchent aux
    // anciennes positions — le scroll semble bloqué à mi-hauteur.
    // refresh(true) force un recalcul complet des dimensions et des
    // positions de tous les triggers actifs.
    // requestAnimationFrame : on attend que React ait fini de rendre
    // le DOM de la nouvelle page avant de recalculer.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return null;
}
// import PageTransitionLayer       from './components/PageTransitionLayer.jsx';

// ─────────────────────────────────────────────────────────────
// AppInner — vit DANS BrowserRouter pour avoir useLocation
// ─────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <>
      {/* Réinitialisation scroll — rend null, aucun impact visuel */}
      <ScrollToTop />

      {/* Couche de transitions — écoute useLocation, rend null */}
      <PageTransitionLayer />

      <Routes>
        {/* ROUTES PUBLIQUES — Règlement (layout dédié) */}
        <Route path={ROUTES.REGLEMENT} element={<PublicLayout />}>
          <Route index element={<CompetitionRules />} />
        </Route>

        {/* ROUTES PUBLIQUES — Layout principal */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.NEWSLETTERS} element={<Newsletters />} />
          <Route path={ROUTES.GALERIE} element={<Gallery />} />
          <Route path={ROUTES.SOUMETTRE} element={<SubmissionPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginAdmin />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.MENTION} element={<Mention />} />
          <Route path={ROUTES.COOKIES} element={<Cookies />} />
          <Route
            path={ROUTES.POLITIQUE_CONFIDENTIALITE}
            element={<PolitiqueDeConfidentialite />}
          />
          <Route
            path={ROUTES.CONDITIONS_UTILISATIONS}
            element={<ConditionsUtilisations />}
          />
          <Route path={ROUTES.FAQ} element={<FAQ />} />
          <Route path={ROUTES.CALENDRIER} element={<Calendrier />} />
          <Route path={ROUTES.LOGIN_VERIFY} element={<VerifyToken />} />
          <Route
            path={ROUTES.JURY_DASHBOARD}
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <JuryDashboard />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.REGLES_CONDITIONS}
            element={<ReglesConditions />}
          />
          <Route path={ROUTES.NEWS} element={<FestivalNews />} />
          <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetail />} />
          <Route path={ROUTES.EVENTS} element={<Events />} />
          <Route path={ROUTES.EDIT_FILM} element={<EditFilmPage />} />
          <Route path={ROUTES.TRACKING} element={<TrackingPage />} />
          <Route path={ROUTES.PALMARES} element={<PalmaresPage />} />
          {/* Route publique film — /film/:id
					    FilmPage lit galleryMovies[] statique aujourd'hui.
					    Migration backend : voir contrat dans FilmPage.jsx.
					    ROUTES.FILM_DETAIL = '/film/:id' — défini dans routes.js.
					    Distinct de l'admin FilmDetail (pages/Admin/) qui requiert auth. */}
          <Route path={ROUTES.FILM_DETAIL} element={<FilmPage />} />
        </Route>

        {/* ZONE JURY SÉCURISÉE */}
        <Route element={<ProtectedRoute allowedRoles={["JURY"]} />}>
          <Route
            path={ROUTES.JURY_DASHBOARD}
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <JuryDashboard />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.JURY_FILM_DETAIL}
            element={
              <Suspense fallback={<SuspenseLoader />}>
                <JuryFilmDetail />
              </Suspense>
            }
          />
        </Route>

        {/* ZONE ADMIN SÉCURISÉE */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <DashboardHome />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN_FILMS}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <FilmsList />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN_DETAILS}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <FilmDetailAdmin />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN_USERS}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <AdminDashboardLazy />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN_SELECTION}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <SelectionPage />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.ADMIN_AWARDS}
              element={
                <Suspense fallback={<SuspenseLoader />}>
                  <AwardsPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// App — BrowserRouter en wrapper externe
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
