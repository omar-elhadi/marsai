import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Imports Pages Publiques
import Home from '@/pages/Home/Home.jsx';
import SubmissionPage from '@/pages/Submission/SubmissionPage.jsx';
import LoginAdmin from '@/pages/LoginAdmin.jsx'; 
import ConnectionPage from '@/pages/Jury/ConnectionPage.jsx';
import Newsletters from '@/pages/Newsletters.jsx';
import Gallery from '@/pages/Gallery/Gallery.jsx';
import Contact from '@/pages/Contact/Contact.jsx';

// 2. Imports Layouts
import AdminLayout from './Layouts/AdminLayout.jsx';
import PublicLayout from './Layouts/PublicLayout.jsx';

// 3. Imports Pages Admin
import FilmsList from './pages/Admin/FilmsList.jsx';
import DashboardHome from './pages/Admin/DashboardHome.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ZONE PUBLIQUE --- */}
        <Route element={<PublicLayout />}>
         <Route path="/Newsletters" element={<Newsletters />} />
          <Route path="/ConnectionPage" element={<ConnectionPage />} />
           <Route path="/" element={<Home />} />
           <Route path="/galerie" element={<Gallery />} />
           <Route path="/soumettre" element={<SubmissionPage />} />
           <Route path="/login" element={<LoginAdmin />} />
           <Route path="/contact" element={<Contact />} />
        </Route>

        {/* --- ZONE ADMIN --- */}
        <Route path="/admin" element={<AdminLayout />}>
          
          {/* Vue d'ensemble (Stats) */}
          <Route index element={<DashboardHome />} />
          
          {/* Liste des films */}
          <Route path="films" element={<FilmsList />} />
          
          <Route path="users" element={<div className="text-white">Gestion Jury (À venir)</div>} />
          <Route path="awards" element={<div className="text-white">Palmarès (À venir)</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}


export default App;