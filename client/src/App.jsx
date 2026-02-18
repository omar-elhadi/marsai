import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Imports Pages Publiques
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
import VerifyToken from "./pages/VerifyToken";

// 2. Imports Layouts
import AdminLayout from './Layouts/AdminLayout.jsx';
import PublicLayout from './Layouts/PublicLayout.jsx';

// 3. Imports Pages Admin
import ProtectedRoute from './components/ProtectedRoute.jsx';
import FilmsList from './pages/Admin/FilmsList.jsx';
import DashboardHome from './pages/Admin/DashboardHome.jsx';
// Import du nouveau composant de gestion des utilisateurs
import { AdminDashboard } from './pages/Admin/AdminDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ZONE PUBLIQUE --- */}
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
          <Route path="/login/verify" element={<VerifyToken />} />
        </Route>

    {/* --- ZONE ADMIN SÉCURISÉE --- */}
        <Route element={<ProtectedRoute />}> {/* <-- Le verrou est ICI */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* http://localhost:5173/admin */}
            <Route index element={<DashboardHome />} />
            
            {/* http://localhost:5173/admin/films */}
            <Route path="films" element={<FilmsList />} />
            
            {/* http://localhost:5173/admin/users */}
            <Route path="users" element={<AdminDashboard />} />
            
            <Route path="awards" element={<div className="text-white">Palmarès (À venir)</div>} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;