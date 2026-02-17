import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la modale et le formulaire (Mis à jour avec firstName/lastName)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'JURY' 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('marsai_token') || localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadUsers();
  }, [token, navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll(token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401')) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Appel au service register avec les nouveaux champs
      const newUser = await userService.register(formData, token); 
      setUsers([...users, newUser]); 
      setIsModalOpen(false); 
      // Reset du formulaire
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'JURY' }); 
    } catch (err) {
      alert("Erreur lors de la création : " + err.message);
    }
  };

  const handleDelete = async (id, lastName) => {
    if (window.confirm(`Supprimer définitivement le jury ${lastName} ?`)) {
      try {
        await userService.delete(id, token);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-white animate-pulse text-center">Chargement...</div>;

  return (
    <div className="p-6 text-white relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Jurys</h1>
          <p className="text-gray-400 mt-2">{users.length} membres actifs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          + Ajouter un Jury
        </button>
      </header>

      {/* TABLEAU */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 uppercase text-xs tracking-widest">
              <th className="p-4">Membre</th>
              <th className="p-4">Rôle</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  {/* Affichage Prénom + NOM */}
                  <div className="font-medium text-gray-100">
                    {user.firstName} <span className="uppercase">{user.lastName}</span>
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4 italic text-sm text-indigo-400">{user.role}</td>
                <td className="p-4 text-right">
                  {user.role !== 'ADMIN' && (
                    <button 
                      onClick={() => handleDelete(user.id, user.lastName)} 
                      className="text-red-500 hover:text-red-400 text-xs font-bold px-3 py-1 bg-red-500/10 rounded-lg"
                    >
                      SUPPRIMER
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE D'AJOUT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Nouveau Jury</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Prénom</label>
                  <input 
                    type="text" required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom</label>
                  <input 
                    type="text" required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input 
                  type="email" required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Mot de passe temporaire</label>
                <input 
                  type="password" required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};