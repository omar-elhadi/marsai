import { Outlet } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
// Si tu as un composant Navbar ou Header, importe-le ici plus tard
// import Navbar from '../components/Navbar'; 

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
    <Header />
      
      <main className="flex-1 w-full">
        <Outlet /> {/* C'est ici que Home ou SubmissionPage s'affichera */}
      </main>
      
      <Footer />
    </div>
  );
}

export default PublicLayout;