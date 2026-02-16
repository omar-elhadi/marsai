import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('marsai_token') || localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAll(token);
        setUsers(data);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('401') || err.message.includes('expiré')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, navigate]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer définitivement le jury ${name} ?`)) {
      try {
        await userService.delete(id, token);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression : " + err.message);
      }
    }
  };

  if (loading) return <div className="p-8 text-white animate-pulse">Chargement des jurys...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-100/10 rounded-lg m-6">⚠️ {error}</div>;

  return (
    <div className="p-6 text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          Gestion des Jurys
        </h1>
        <p className="text-gray-400 mt-2">
          {users.length} membres habilités à voter pour cette édition.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/30">
              <th className="p-4 font-semibold text-gray-300">Membre</th>
              <th className="p-4 font-semibold text-gray-300">Rôle</th>
              <th className="p-4 font-semibold text-gray-300">Inscrit le</th>
              <th className="p-4 font-semibold text-right text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-gray-100">{user.name}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === 'ADMIN' 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400 font-mono">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="p-4 text-right">
                  {/* PROTECTION : Pas de suppression pour les ADMINS */}
                  {user.role !== 'ADMIN' ? (
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg transition-all text-xs font-bold border border-red-500/20 shadow-lg shadow-red-500/5"
                    >
                      SUPPRIMER
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest opacity-50">
                      Systeme
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};