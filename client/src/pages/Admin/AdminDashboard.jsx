import React, { useState, useEffect, useRef } from 'react';
import { Mail, Trash2, Edit, UserPlus, Loader2 } from 'lucide-react';

/**
 * ADMIN DASHBOARD - GESTION DU JURY
 * Style : Brutaliste / Dark Cinema
 * État : Nettoyé (Le menu burger est géré par le Layout parent)
 */
export const AdminDashboard = () => {
  // --- ÉTATS : DATA & INTERFACE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'JURY' });
  
  // Logs d'activité (Interface Terminal - Hauteur Fixe pour stabilité)
  const logCounter = useRef(2); // commence à 2, le log initial a l'id 1
  const [logs, setLogs] = useState([{
    id: 1,
    msg: "SYSTÈME MARSAI PRÊT. CONNEXION SÉCURISÉE.",
    time: new Date().toLocaleTimeString()
  }]);

  // --- SYNCHRONISATION ---
  useEffect(() => { fetchUsers(); }, []);

  /** Ajoute une ligne de log sans décaler la liste des jurys */
  const addLog = (msg) => {
    const newLog = { id: logCounter.current++, msg: msg.toUpperCase(), time: new Date().toLocaleTimeString() };
    setLogs(prev => [newLog, ...prev].slice(0, 3));
  };

  /** Récupère les membres depuis l'API */
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      // Tri : ADMIN en premier
      setUsers(data.sort((a, b) => (a.role === 'ADMIN' ? -1 : 1)));
      setLoading(false);
    } catch (error) { 
      addLog("ERREUR_SYNC : SERVEUR INJOIGNABLE");
      setLoading(false); 
    }
  };

  /** CRUD : Créer ou Modifier un utilisateur */
  const handleAction = async (e) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${import.meta.env.VITE_API_URL}/users/${editingUser.id}` : `${import.meta.env.VITE_API_URL}/users`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData)
    });
    if(response.ok) {
      addLog(`${editingUser ? 'MODIF' : 'CRÉATION'}_NODE : ${formData.firstName}`);
      setIsModalOpen(false);
      fetchUsers();
    }
  };

  /** CRUD : Supprimer un utilisateur */
  const handleDelete = async (user) => {
    if (!window.confirm(`CONFIRMER LA SUPPRESSION DE ${user.firstName.toUpperCase()} ?`)) return;
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if(response.ok) { addLog(`RÉVOCATION_ACCÈS : ${user.firstName}`); fetchUsers(); }
  };

  /** ACTION : Envoyer l'invitation par mail */
  const handleSendInvite = async (user) => {
    setInviteLoading(user.id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/invite`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      addLog(`INVITATION_TRANSMISE : ${user.email}`);
    } catch (err) { addLog(`ERREUR_MAIL : ÉCHEC`); } finally { setInviteLoading(null); fetchUsers(); }
  };

  /** Logique des pastilles de statut */
  const getStatus = (user) => {
    if (user.role === 'ADMIN') return { color: 'text-white', bg: 'bg-white', label: 'SYSTÈME' };
    if (user.lastLogin) return { color: 'text-indigo-500', bg: 'bg-indigo-500', label: 'ACTIF' };
    if (user.loginToken) return { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'INVITATION ENVOYÉE' };
    return { color: 'text-red-600', bg: 'bg-red-600', label: 'NON INVITÉ' };
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-white font-mono text-[10px] tracking-[0.5em]">SYNC_IN_PROGRESS_</div>;

  return (
    <div className="animate-fade-in text-white font-sans selection:bg-indigo-500">
      <div>
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 border-b border-white/5 pb-8 gap-8">
          <div className="space-y-6 w-full lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic leading-none">
              GESTION <span className="text-indigo-500">JURY</span>
            </h1>
            
            {/* TERMINAL LOGS : Stabilité visuelle fixée à 80px */}
            <div className="h-[80px] font-mono text-[9px] uppercase tracking-wider bg-white/[0.02] p-3 border-l-2 border-indigo-500 overflow-hidden shadow-inner">
              <p className="text-indigo-500 font-bold mb-1 tracking-[0.2em]">Live_Activity_Logs</p>
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 opacity-60 italic truncate">
                  <span className="text-indigo-500 shrink-0">[{log.time}]</span>
                  <span className="text-gray-400 truncate">&gt; {log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOUTON NOUVEAU JURY */}
          <button 
            onClick={() => { setEditingUser(null); setFormData({firstName:'', lastName:'', email:'', role:'JURY'}); setIsModalOpen(true); }}
            className="group w-full lg:w-auto flex items-center justify-center gap-3 bg-transparent border-2 border-indigo-500 text-white px-6 py-4 lg:py-3 rounded-sm font-black hover:bg-indigo-500 transition-all shrink-0"
          >
            <UserPlus size={16} strokeWidth={3} className="text-indigo-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] tracking-widest uppercase">Nouveau Jury</span>
          </button>
        </div>

        {/* --- LISTE DES MEMBRES --- */}
        <div className="space-y-4 sm:space-y-3">
          {users.map((user, index) => {
            const status = getStatus(user);
            return (
              <div key={user.id} className={`flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-4 sm:px-6 py-5 border border-transparent hover:border-white/10 transition-all duration-300 ${index % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-transparent'}`}>
                {/* IDENTITÉ */}
                <div className="col-span-5 w-full">
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight uppercase truncate">{user.firstName} <span className="text-gray-500 font-normal">{user.lastName}</span></span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.bg}`} />
                      <span className="text-[10px] font-mono text-gray-600 truncate">{user.email}</span>
                      <span className={`text-[9px] italic font-medium ${status.color} opacity-80 ml-1 uppercase tracking-tighter shrink-0`}>// {status.label}</span>
                    </div>
                  </div>
                </div>
                {/* RÔLE */}
                <div className="col-span-3 w-full md:text-center flex md:justify-center">
                  <span className={`px-4 py-1 text-[9px] font-black tracking-[0.2em] uppercase border ${user.role === 'ADMIN' ? 'border-red-900/30 text-red-600 bg-red-900/5' : 'border-indigo-500/30 text-indigo-500 bg-indigo-500/5'}`}>{user.role}</span>
                </div>
                {/* ACTIONS */}
                <div className="col-span-4 w-full flex flex-row justify-end gap-2 sm:gap-1.5 mt-2 md:mt-0">
                  {user.role !== 'ADMIN' ? (
                    <>
                      <button onClick={() => handleSendInvite(user)} className="flex-1 md:flex-none flex justify-center items-center p-4 md:p-2.5 bg-white/5 hover:bg-emerald-600 text-gray-500 hover:text-white transition-all">
                        {inviteLoading === user.id ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                      </button>
                      <button onClick={() => { setEditingUser(user); setFormData({...user}); setIsModalOpen(true); }} className="flex-1 md:flex-none flex justify-center items-center p-4 md:p-2.5 bg-white/5 hover:bg-orange-500 text-gray-500 hover:text-white transition-all"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(user)} className="flex-1 md:flex-none flex justify-center items-center p-4 md:p-2.5 bg-white/5 hover:bg-red-600 text-gray-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </>
                  ) : <div className="text-gray-600 font-mono font-bold text-[9px] tracking-[0.3em] uppercase py-2 w-full text-right opacity-30">SYSTEM_ROOT_ACCESS</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MODALE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6" onClick={() => setIsModalOpen(false)}>
          <form onSubmit={handleAction} onClick={e => e.stopPropagation()} className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-10 md:p-12 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-black italic uppercase mb-10 text-white tracking-tighter">
              {editingUser ? 'MODIFIER' : 'NOUVEAU'} <span className="text-indigo-500">JURY</span>
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Prénom</label>
                  <input required className="w-full bg-white/5 border-b border-white/20 p-2 text-sm outline-none focus:border-indigo-500 text-white transition-colors" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Nom</label>
                  <input required className="w-full bg-white/5 border-b border-white/20 p-2 text-sm outline-none focus:border-indigo-500 text-white transition-colors" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-white tracking-[0.2em]">Email Réseau</label>
                <input required type="email" className="w-full bg-white/5 border-b border-white/20 p-2 text-sm outline-none focus:border-indigo-500 text-white font-mono transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-12">
              <button type="submit" className="bg-white text-black py-4 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg">Valider Configuration</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 font-bold text-[9px] uppercase hover:text-white transition-all py-2">[ Annuler ]</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;