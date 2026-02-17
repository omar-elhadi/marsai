import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Création, objet = Édition
  
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

  // --- Ouvre la modale en mode édition avec les données pré-remplies ---
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Vide par défaut pour l'update
      role: user.role
    });
    setIsModalOpen(true);
  };

  // --- LOGIQUE DE SOUMISSION UNIQUE (Création OU Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Préparation du payload (données à envoyer)
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // 2. On n'ajoute le password que s'il est rempli (évite l'erreur Zod)
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      if (editingUser) {
        // Cas MISE À JOUR
        const updatedUser = await userService.update(editingUser.id, payload, token);
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      } else {
        // Cas CRÉATION (ici le password est requis par le formulaire)
        const newUser = await userService.register(formData, token); 
        setUsers([...users, newUser]); 
      }
      
      closeModal();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'JURY' });
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
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
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
                  <div className="font-medium text-gray-100">
                    {user.firstName} <span className="uppercase">{user.lastName}</span>
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4 italic text-sm text-indigo-400">{user.role}</td>
                <td className="p-4 text-right">
                  {user.role !== 'ADMIN' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)} 
                        className="text-indigo-400 hover:text-indigo-300 text-xs font-bold px-3 py-1 bg-indigo-500/10 rounded-lg"
                      >
                        MODIFIER
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.lastName)} 
                        className="text-red-500 hover:text-red-400 text-xs font-bold px-3 py-1 bg-red-500/10 rounded-lg"
                      >
                        SUPPRIMER
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE UNIQUE (AJOUT OU MODIF) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingUser ? `Modifier ${editingUser.firstName}` : 'Nouveau Jury'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm text-gray-400 mb-1">
                  {editingUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe temporaire'}
                </label>
                <input 
                  type="password" 
                  required={!editingUser} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold">
                  {editingUser ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};