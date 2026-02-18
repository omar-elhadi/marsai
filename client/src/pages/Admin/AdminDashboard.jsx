import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Edit, UserPlus, Shield, User as UserIcon, Loader2 } from 'lucide-react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // LOGIQUE DE TRI : On place les ADMINS à la fin du tableau
      const sortedUsers = data.sort((a, b) => {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return 1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return -1;
        return 0;
      });

      setUsers(sortedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement users:", error);
      setLoading(false);
    }
  };

  const handleSendInvite = async (user) => {
    setInviteLoading(user.id);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert(`📧 Invitation envoyée à ${user.email}`);
      } else {
        alert("❌ Erreur lors de l'envoi");
      }
    } catch (error) {
      alert("Erreur réseau");
    } finally {
      setInviteLoading(null);
    }
  };

  if (loading) return <div className="p-8 text-white">Chargement des membres...</div>;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold italic tracking-tighter">GESTION_MEMBRES</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
            {users.length} Utilisateurs enregistrés
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm">
          <UserPlus size={16} />
          AJOUTER
        </button>
      </div>

      {/* TABLEAU */}
      <div className="bg-[#0f1115] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Identité / Email</th>
              <th className="px-8 py-5">Rôle</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                      {user.role === 'ADMIN' ? <Shield size={18} /> : <UserIcon size={18} />}
                    </div>
                    <div>
                      <div className="font-bold text-base tracking-tight">
                        {user.firstName} <span className="uppercase opacity-70">{user.lastName}</span>
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black px-2 py-1 rounded border ${
                    user.role === 'ADMIN' 
                    ? 'border-red-500/50 text-red-500 bg-red-500/5' 
                    : 'border-indigo-500/50 text-indigo-400 bg-indigo-500/5'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end items-center gap-4">
                    
                    {/* BOUTON ENVELOPPE (Masqué pour l'Admin lui-même) */}
                    {user.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handleSendInvite(user)}
                        disabled={inviteLoading === user.id}
                        className="text-gray-500 hover:text-white transition-colors disabled:opacity-20"
                        title="Envoyer le lien d'accès"
                      >
                        {inviteLoading === user.id ? 
                          <Loader2 size={18} className="animate-spin text-indigo-500" /> : 
                          <Mail size={18} />
                        }
                      </button>
                    )}

                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Edit size={18} />
                    </button>

                    {user.role !== 'ADMIN' ? (
                      <button className="text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <div className="w-[18px]"></div> // Espace vide pour l'alignement
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;