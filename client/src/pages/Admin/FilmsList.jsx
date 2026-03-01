import { useState, useEffect, useCallback } from 'react';
import { Play, Eye, Loader2, Users, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Couleurs des badges et chips par statut
const STATUS_STYLES = {
  SUBMITTED:  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  IN_REVIEW:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  APPROVED:   'bg-green-500/10 text-green-400 border-green-500/20',
  REJECTED:   'bg-red-500/10 text-red-400 border-red-500/20',
  TO_MODIFY:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SELECTION:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  FINALIST:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  AWARD:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const STATUS_CHIP_ACTIVE = {
  SUBMITTED:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  IN_REVIEW:  'bg-blue-500/20 text-blue-300 border-blue-500/40',
  APPROVED:   'bg-green-500/20 text-green-300 border-green-500/40',
  REJECTED:   'bg-red-500/20 text-red-300 border-red-500/40',
  TO_MODIFY:  'bg-orange-500/20 text-orange-300 border-orange-500/40',
  SELECTION:  'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  FINALIST:   'bg-purple-500/20 text-purple-300 border-purple-500/40',
  AWARD:      'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

// Transitions autorisées (miroir du backend)
const NEXT_STATUSES = {
  SUBMITTED: ['IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY'],
  IN_REVIEW:  ['APPROVED', 'REJECTED', 'TO_MODIFY'],
  TO_MODIFY:  ['IN_REVIEW', 'APPROVED', 'REJECTED'],
  APPROVED:   ['SELECTION', 'REJECTED', 'TO_MODIFY'],
  SELECTION:  ['FINALIST', 'APPROVED'],
  FINALIST:   ['AWARD', 'SELECTION'],
  REJECTED:   [],
  AWARD:      [],
};

// Ordre d'affichage dans la barre de filtres (suit le workflow)
const FILTER_ORDER = ['SUBMITTED', 'IN_REVIEW', 'TO_MODIFY', 'APPROVED', 'REJECTED', 'SELECTION', 'FINALIST', 'AWARD'];

function FilmsList() {
  const [films, setFilms]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({ total: 0, byStatus: {}, suggestions: 0 });
  const [statusFilter, setFilter]     = useState('');
  const [hasSuggestions, setSuggestions] = useState(false);
  const [search, setSearch]           = useState('');
  const [updating, setUpdating]       = useState(null);
  const [assigning, setAssigning]     = useState(null);
  const [juryUsers, setJuryUsers]     = useState([]);
  const [assignPopup, setAssignPopup] = useState(null);

  const token = localStorage.getItem('token');
  const API   = import.meta.env.VITE_API_URL;

  // --- Chargement des stats (compteurs pour les chips) ---
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/films/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setStats(data);
    } catch { /* silencieux */ }
  }, [token, API]);

  // --- Chargement des films ---
  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter)   params.set('status', statusFilter);
      if (search)         params.set('search', search);
      if (hasSuggestions) params.set('hasSuggestions', 'true');
      const res  = await fetch(`${API}/films?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, hasSuggestions, token, API]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchFilms(); }, [fetchFilms]);

  // --- Chargement des jurys ---
  useEffect(() => {
    const fetchJury = async () => {
      try {
        const res  = await fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setJuryUsers(Array.isArray(data) ? data.filter(u => u.role === 'JURY') : []);
      } catch { setJuryUsers([]); }
    };
    fetchJury();
  }, [token, API]);

  // --- Sélection d'un filtre chip ---
  const selectFilter = (status) => {
    setSuggestions(false);
    setFilter(status === statusFilter ? '' : status); // toggle
  };

  // --- Changement de statut ---
  const handleStatusChange = async (film, newStatus) => {
    setUpdating(film.id);
    try {
      await fetch(`${API}/films/${film.id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: newStatus }),
      });
      await Promise.all([fetchFilms(), fetchStats()]);
    } finally {
      setUpdating(null);
    }
  };

  // --- Popup assignation ---
  const openAssignPopup = (film) => {
    setAssignPopup({ filmId: film.id, selectedIds: (film.assignedUsers ?? []).map(u => u.id) });
  };

  const handleAssign = async () => {
    if (!assignPopup) return;
    setAssigning(assignPopup.filmId);
    try {
      await fetch(`${API}/films/${assignPopup.filmId}/assign`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ userIds: assignPopup.selectedIds }),
      });
      await Promise.all([fetchFilms(), fetchStats()]);
      setAssignPopup(null);
    } finally {
      setAssigning(null);
    }
  };

  const toggleJury = (userId) => {
    setAssignPopup(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(userId)
        ? prev.selectedIds.filter(id => id !== userId)
        : [...prev.selectedIds, userId],
    }));
  };

  return (
    <div className="animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Films Soumis</h2>
          <p className="text-white/50">Gérez les candidatures et la modération.</p>
        </div>
        <div className="bg-white/8 px-4 py-2 text-sm text-white/60">
          Total : <span className="text-white font-bold">{stats.total}</span>
        </div>
      </div>

      {/* ── BARRE DE FILTRES CHIP ───────────────────────── */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-2 items-center">

          {/* ALL */}
          <button
            onClick={() => { setFilter(''); setSuggestions(false); }}
            className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest border transition-all
              ${!statusFilter
                ? 'bg-white/10 text-white border-white/30'
                : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'}`}
          >
            All <span className="ml-1 opacity-60">{stats.total}</span>
          </button>

          {/* Chips par statut */}
          {FILTER_ORDER.map(status => {
            const count    = stats.byStatus?.[status] ?? 0;
            const isActive = statusFilter === status && !hasSuggestions;
            return (
              <button
                key={status}
                onClick={() => selectFilter(status)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-widest border transition-all
                  ${isActive
                    ? STATUS_CHIP_ACTIVE[status]
                    : `${STATUS_STYLES[status]} opacity-70 hover:opacity-100`}`}
              >
                {status} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sous-filtre Suggestions — visible uniquement quand IN_REVIEW actif */}
        {statusFilter === 'IN_REVIEW' && (
          <div className="mt-2 ml-2 flex items-center gap-2">
            <div className="w-3 h-px bg-white/20" />
            <button
              onClick={() => setSuggestions(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-widest border transition-all
                ${hasSuggestions
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-orange-500/5 text-orange-400/60 border-orange-500/15 hover:opacity-100'}`}
            >
              <AlertTriangle size={10} />
              Suggestions jurys
              <span className="opacity-60">{stats.suggestions ?? 0}</span>
            </button>
          </div>
        )}
      </div>

      {/* Recherche */}
      <div className="mb-6 mt-4">
        <input
          type="text"
          placeholder="Rechercher titre, pays, réalisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 bg-white/5 border border-white/15 px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white/5 border border-white/15 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-white/40">
            <Loader2 size={24} className="animate-spin mr-3" />Chargement...
          </div>
        ) : films.length === 0 ? (
          <div className="p-16 text-center text-white/40">Aucun film trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-262.5">
              <thead>
                <tr className="bg-white/8 text-white/50 text-[11px] uppercase tracking-wider border-b border-white/15">
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">Film / Pays</th>
                  <th className="p-4 font-medium">Réalisateur</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Jurys</th>
                  <th className="p-4 font-medium">Changer statut</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {films.map((film) => {
                  const nextOptions   = NEXT_STATUSES[film.status] ?? [];
                  const assignedJurys = film.assignedUsers ?? [];

                  return (
                    <tr key={film.id} className="hover:bg-white/5 transition-colors group">

                      <td className="p-4">
                        <span className={`text-xs font-bold uppercase px-2 py-1 border ${STATUS_STYLES[film.status] ?? ''}`}>
                          {film.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{film.title}</div>
                        <div className="text-xs text-white/50 mt-0.5">{film.country}</div>
                      </td>

                      <td className="p-4 text-sm text-white/70">
                        <div>{film.submitter?.firstName} {film.submitter?.lastName}</div>
                        <div className="text-xs text-white/50">{film.submitter?.email}</div>
                      </td>

                      <td className="p-4 text-xs text-white/40">
                        {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
                      </td>

                      {/* Jurys assignés */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 items-center">
                          {assignedJurys.length > 0 ? assignedJurys.map(u => (
                            <span key={u.id} className="text-[11px] uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5">
                              {u.firstName}
                            </span>
                          )) : (
                            <span className="text-white/40 text-xs italic">—</span>
                          )}
                          <button
                            onClick={() => openAssignPopup(film)}
                            title="Gérer les jurys"
                            className="ml-1 p-1 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                          >
                            <Users size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Changement de statut */}
                      <td className="p-4">
                        {updating === film.id ? (
                          <Loader2 size={16} className="animate-spin text-white/40" />
                        ) : nextOptions.length > 0 ? (
                          <select
                            defaultValue=""
                            onChange={e => { if (e.target.value) handleStatusChange(film, e.target.value); }}
                            className="bg-white/8 border border-white/15 px-2 py-1 text-xs text-white/70 focus:outline-none focus:border-white/30"
                          >
                            <option value="" disabled>Choisir...</option>
                            {nextOptions.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-white/40 italic">Final</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/films/${film.id}`} title="Voir le détail"
                            className="p-2 hover:bg-white/10 text-white/60 hover:text-white transition-colors inline-flex">
                            <Eye size={16} />
                          </Link>
                          {film.youtubeUrl && (
                            <a href={film.youtubeUrl} target="_blank" rel="noopener noreferrer"
                               title="Voir sur YouTube"
                               className="p-2 hover:bg-indigo-500/20 text-white/60 hover:text-indigo-400 transition-colors">
                              <Play size={16} />
                            </a>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── POPUP ASSIGNATION ─────────────────────────────── */}
      {assignPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setAssignPopup(null)}
        >
          <div
            className="bg-[#111827] border border-white/15 p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Assigner des jurys</h3>
              <button onClick={() => setAssignPopup(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {juryUsers.length === 0 ? (
              <p className="text-white/40 text-sm italic">Aucun jury disponible.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {juryUsers.map(user => (
                  <label key={user.id} className="flex items-center gap-3 p-2 hover:bg-white/5 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={assignPopup.selectedIds.includes(user.id)}
                      onChange={() => toggleJury(user.id)}
                      className="accent-indigo-500 w-4 h-4"
                    />
                    <div>
                      <p className="text-sm text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-white/50">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setAssignPopup(null)}
                className="flex-1 py-2 text-xs uppercase tracking-widest text-white/40 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning === assignPopup?.filmId}
                className="flex-1 py-2 text-xs uppercase tracking-widest font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {assigning === assignPopup?.filmId ? <Loader2 size={14} className="animate-spin" /> : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FilmsList;
