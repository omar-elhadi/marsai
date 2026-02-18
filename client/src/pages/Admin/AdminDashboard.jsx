import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';

/**
 * COMPOSANT : AdminDashboard
 * RÔLE : Gestion du CRUD des utilisateurs (Jurys & Admins).
 * MAINTENANCE : 
 * - Pour modifier les champs validés, voir aussi 'user.controller.js' (Zod).
 * - Le système Magic Link repose sur la possibilité de créer un utilisateur sans mot de passe.
 */
export const AdminDashboard = () => {
  // --- ÉTATS ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modale : gère à la fois l'ajout et l'édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Création, {obj} = Édition
  
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'JURY' 
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('marsai_token') || localStorage.getItem('token');

  // --- CYCLE DE VIE ---
  useEffect(() => {
    if (!token) { 
      navigate('/login'); 
      return; 
    }
    loadUsers();
  }, [token, navigate]);

  // Chargement de la liste des membres
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

  // --- ACTIONS ---

  // Prépare la modale pour l'édition
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // On laisse vide pour ne pas écraser l'ancien mdp par erreur
      role: user.role
    });
    setIsModalOpen(true);
  };

  /**
   * SOUMISSION DU FORMULAIRE
   * Gère intelligemment le cas "Magic Link" : si le password est vide,
   * on ne l'envoie pas au backend pour laisser Prisma mettre NULL.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Construction du payload de base (Champs toujours requis)
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role
      };

      // 2. Gestion conditionnelle du mot de passe
      // On ne l'ajoute que s'il y a une saisie réelle (évite d'envoyer une chaîne vide "")
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      if (editingUser) {
        // Mode ÉDITION
        const updatedUser = await userService.update(editingUser.id, payload, token);
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      } else {
        // Mode CRÉATION (Compatible Magic Link si password absent du payload)
        const newUser = await userService.register(payload, token); 
        setUsers([...users, newUser]); 
      }
      
      closeModal();
    } catch (err) {
      alert("Erreur de validation : " + err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'JURY' });
  };

  const handleDelete = async (id, lastName) => {
    if (window.confirm(`Supprimer définitivement le membre ${lastName} ?`)) {
      try {
        await userService.delete(id, token);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  // --- RENDU ---
  if (loading) return <div className="p-8 text-white animate-pulse text-center">Synchronisation avec la base...</div>;

  return (
    <div className="p-6 text-white relative">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Membres</h1>
          <p className="text-gray-400 mt-2">Accès Admin & Jurys ({users.length})</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          + Nouveau Membre
        </button>
      </header>

      {/* LISTE DES UTILISATEURS */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/30 text-gray-400 uppercase text-[10px] tracking-widest font-black">
              <th className="p-4">Identité</th>
              <th className="p-4">Rôle</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-gray-800">
  {users.map((user) => (
    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
      <td className="p-4">
        <div className="font-medium text-gray-100 text-sm">
          {user.firstName} <span className="uppercase font-bold">{user.lastName}</span>
        </div>
        <div className="text-[12px] text-gray-500">{user.email}</div>
      </td>
      <td className="p-4">
        <span className={`text-[10px] px-2 py-1 rounded font-bold ${
          user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400' : 'bg-indigo-500/10 text-indigo-400'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="p-4 text-right">
        {/* SÉCURITÉ : L'ADMIN est géré par le système, pas par le dashboard */}
        {user.role === 'ADMIN' ? (
          <span className="text-[10px] font-black text-gray-600 bg-gray-800/30 px-3 py-1.5 rounded-lg tracking-widest border border-gray-800">
            SYSTEM_LOCKED
          </span>
        ) : (
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => handleEditClick(user)} 
              className="text-gray-400 hover:text-white text-[11px] font-bold px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              ÉDITER
            </button>
            <button 
              onClick={() => handleDelete(user.id, user.lastName)} 
              className="text-red-500 hover:text-red-400 text-[11px] font-bold px-3 py-1 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-all"
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

      {/* MODALE DE GESTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md p-8 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-4">
              {editingUser ? `Modifier ${editingUser.firstName}` : 'Création de compte'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Prénom</label>
                  <input 
                    type="text" required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nom</label>
                  <input 
                    type="text" required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Email professionnel</label>
                <input 
                  type="email" required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  {editingUser ? 'Changer le mot de passe (optionnel)' : 'Sécurité (Magic Link par défaut)'}
                </label>
                <input 
                  type="password" 
                  // NOTE: Le "required" est supprimé pour permettre le Magic Link
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-600"
                  placeholder={!editingUser ? "Laisser vide pour envoyer un lien..." : "Inchangé si vide"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {!editingUser && (
                  <p className="text-[10px] text-indigo-400 mt-2 italic leading-relaxed">
                    * Si laissé vide, l'utilisateur recevra une invitation par email pour se connecter sans mot de passe.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-sm transition-colors">
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all">
                  {editingUser ? 'Sauvegarder' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};