import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

/**
 * 1. IMPORTS DES PAGES PUBLIQUES
 */
import Home                      from '@/pages/Home/Home.jsx';
import SubmissionPage            from '@/pages/Submission/SubmissionPage.jsx';
import LoginAdmin                from '@/pages/LoginAdmin.jsx';
import ConnectionPage            from '@/pages/Jury/ConnectionPage.jsx';
import Newsletters               from '@/pages/Newsletters.jsx';
import Gallery                   from '@/pages/Gallery/Gallery.jsx';
import Contact                   from '@/pages/Contact/Contact.jsx';
import Mention                   from '@/pages/Legals/Mention.jsx';
import VotesJury                 from '@/pages/Jury/VotesJury.jsx';
import Cookies                   from '@/pages/Legals/cookies.jsx';
import PolitiqueDeConfidentialite from '@/pages/Legals/politiquedeconfidentialite.jsx';
import MovieDetails              from '@/pages/MovieDetails/MovieDetails.jsx';
import ConditionsUtilisations    from '@/pages/Legals/conditions-utilisations.jsx';
import FAQ                       from '@/components/Ressources/FAQ.jsx';
import Calendrier                from './components/Ressources/calendrier.jsx';
import ReglesConditions          from './components/Ressources/regles-conditions.jsx';
import Events                    from '@/pages/Events/Events.jsx';
import CompetitionRules          from '@/pages/CompetitionRules/CompetitionRules.jsx';
import EditFilmPage              from '@/pages/Submission/EditFilmPage.jsx';

/**
 * 2. IMPORTS AUTHENTIFICATION & JURY
 */
import VerifyToken               from './pages/VerifyToken';
import JuryDashboard             from './pages/Jury/JuryDashboard.jsx';

/**
 * 3. IMPORTS LAYOUTS
 */
import FestivalNews              from './pages/News/News.jsx';
import AdminLayout               from './Layouts/AdminLayout.jsx';
import PublicLayout              from './Layouts/PublicLayout.jsx';

/**
 * 4. IMPORTS ADMIN
 */
import ProtectedRoute            from './components/ProtectedRoute.jsx';
import FilmsList                 from './pages/Admin/FilmsList.jsx';
import FilmDetail                from './pages/Admin/FilmDetail.jsx';
import DashboardHome             from './pages/Admin/DashboardHome.jsx';
import { AdminDashboard }        from './pages/Admin/AdminDashboard.jsx';

/**
 * 5. PHASE 8 — Transitions cinématographiques
 */
import PageTransitionLayer       from './components/PageTransitionLayer.jsx';
import { LoaderContext }   from './context/LoaderContext';

// ─────────────────────────────────────────────────────────────
// AppInner — vit DANS BrowserRouter pour avoir useLocation
// ─────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <LoaderContext.Provider value={{ loaderReady: true }}>
      {/* Couche de transitions — écoute useLocation, rend null */}
      <PageTransitionLayer />

      <Routes>
        {/* ROUTES PUBLIQUES */}
        <Route path="/reglement" element={<PublicLayout />}>
          <Route index element={<CompetitionRules />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/"                          element={<Home />} />
          <Route path="/Newsletters"               element={<Newsletters />} />
          <Route path="/ConnectionPage"            element={<ConnectionPage />} />
          <Route path="/galerie"                   element={<Gallery />} />
          <Route path="/soumettre"                 element={<SubmissionPage />} />
          <Route path="/login"                     element={<LoginAdmin />} />
          <Route path="/contact"                   element={<Contact />} />
          <Route path="/Mention"                   element={<Mention />} />
          <Route path="/VotesJury"                 element={<VotesJury />} />
          <Route path="/cookies"                   element={<Cookies />} />
          <Route path="/PolitiqueDeConfidentialite" element={<PolitiqueDeConfidentialite />} />
          <Route path="/conditions-utilisations"   element={<ConditionsUtilisations />} />
          <Route path="/film/:id"                  element={<MovieDetails />} />
          <Route path="/FAQ"                       element={<FAQ />} />
          <Route path="/calendrier"                element={<Calendrier />} />
          <Route path="/login/verify"              element={<VerifyToken />} />
          <Route path="/jury/dashboard"            element={<JuryDashboard />} />
          <Route path="/regles-conditions"         element={<ReglesConditions />} />
          <Route path="/news"                      element={<FestivalNews />} />
          <Route path="/events"                    element={<Events />} />
          <Route path="/edit-film/:token"          element={<EditFilmPage />} />
        </Route>

        {/* ZONE ADMIN SÉCURISÉE — ADMIN + MODERATOR uniquement */}
        <Route element={<ProtectedRoute requiredRole={["ADMIN", "MODERATOR"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index           element={<DashboardHome />} />
            <Route path="films/:id" element={<FilmDetail />} />
            <Route path="films/*"   element={<FilmsList />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="awards" element={<div className="text-white">Palmarès (À venir)</div>} />
          </Route>
        </Route>
      </Routes>
    </LoaderContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// App — BrowserRouter en wrapper externe
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;