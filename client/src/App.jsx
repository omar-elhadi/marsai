import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * 1. IMPORTS DES PAGES PUBLIQUES
 * Regroupés par thématique pour faciliter la localisation
 */
import Home from '@/pages/Home/Home.jsx';
import SubmissionPage from '@/pages/Submission/SubmissionPage.jsx';
import LoginAdmin from '@/pages/LoginAdmin.jsx'; 
import ConnectionPage from '@/pages/Jury/ConnectionPage.jsx';
import Newsletters from '@/pages/Newsletters.jsx';
import Gallery from '@/pages/Gallery/Gallery.jsx';
import Contact from '@/pages/Contact/Contact.jsx';
import Mention from '@/pages/Legals/Mention.jsx';
import VotesJury from '@/pages/Jury/VotesJury.jsx';
import Cookies from '@/pages/Legals/cookies.jsx';
import PolitiqueDeConfidentialite from '@/pages/Legals/politiquedeconfidentialite.jsx';
import MovieDetails from '@/pages/MovieDetails/MovieDetails.jsx';
import ConditionsUtilisations from '@/pages/Legals/conditions-utilisations.jsx';
import FAQ from '@/components/Ressources/F-A-Q.jsx';
import Calendrier from './components/Ressources/calendrier.jsx';
import ReglesConditions from './components/Ressources/regles-conditions.jsx';
import Events from '@/pages/Events/Events.jsx'; 

/**
 * 2. IMPORTS AUTHENTIFICATION & JURY
 */
import VerifyToken from "./pages/VerifyToken";
import JuryDashboard from './pages/Jury/JuryDashboard.jsx';

/**
 * 3. IMPORTS LAYOUTS (Conteneurs de structure)
 */
import AdminLayout from './Layouts/AdminLayout.jsx';
import PublicLayout from './Layouts/PublicLayout.jsx';

/**
 * 4. IMPORTS ZONE ADMIN (Accès restreint)
 */
import ProtectedRoute from './components/ProtectedRoute.jsx';
import FilmsList from './pages/Admin/FilmsList.jsx';
import DashboardHome from './pages/Admin/DashboardHome.jsx';
import { AdminDashboard } from './pages/Admin/AdminDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* GROUPE : ROUTES PUBLIQUES 
            Utilisent le PublicLayout (Header/Footer classiques)
        */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Newsletters" element={<Newsletters />} />
          <Route path="/ConnectionPage" element={<ConnectionPage />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/soumettre" element={<SubmissionPage />} />
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Mention" element={<Mention />} />
          <Route path="/VotesJury" element={<VotesJury />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/PolitiqueDeConfidentialite" element={<PolitiqueDeConfidentialite />} />
          <Route path="/conditions-utilisations" element={<ConditionsUtilisations />} />
          <Route path="/film/:id" element={<MovieDetails />} />
          <Route path="/F-A-Q" element={<FAQ />} />
          <Route path="/calendrier" element={<Calendrier />} />
          
          {/* FLUX D'INVITATION JURY :
              1. Le lien mail pointe vers /login/verify?token=...
              2. VerifyToken valide et redirige vers /jury/dashboard
          */}
          <Route path="/login/verify" element={<VerifyToken />} />
          <Route path="/jury/dashboard" element={<JuryDashboard />} />
          <Route path="/regles-conditions" element={<ReglesConditions />} />
          <Route path="/events" element={<Events />} />
        </Route>

        {/* GROUPE : ZONE ADMIN SÉCURISÉE 
            Le composant <ProtectedRoute /> vérifie le token JWT et le rôle 'ADMIN'
        */}
        <Route element={<ProtectedRoute />}> 
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Accueil Admin : /admin */}
            <Route index element={<DashboardHome />} />
            
            {/* Gestion des Films : /admin/films */}
            <Route path="films" element={<FilmsList />} />
            
            {/* Gestion Utilisateurs & Invitations : /admin/users */}
            <Route path="users" element={<AdminDashboard />} />
            
            {/* Palmarès : /admin/awards (À implémenter) */}
            <Route path="awards" element={<div className="text-white">Palmarès (À venir)</div>} />
          </Route>
        </Route>

        {/* MAINTENANCE : 
            Pour ajouter une nouvelle route jury (ex: /jury/votes), 
            il est conseillé de créer un JuryLayout similaire à l'AdminLayout 
            pour partager une barre de navigation spécifique.
        */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;