import { useState, useEffect, useCallback } from 'react';
import { Play, Eye, Loader2 } from 'lucide-react';

// Couleurs des badges par statut (schéma v2)
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

// Transitions autorisées par statut (miroir du backend)
const NEXT_STATUSES = {
  SUBMITTED: ['IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY'],
  IN_REVIEW:  ['APPROVED', 'REJECTED', 'TO_MODIFY'],
  TO_MODIFY:  ['IN_REVIEW', 'APPROVED', 'REJECTED'],
  APPROVED:   ['SELECTION', 'REJECTED'],
  SELECTION:  ['FINALIST', 'APPROVED'],
  FINALIST:   ['AWARD', 'SELECTION'],
  REJECTED:   [],
  AWARD:      [],
};

const ALL_STATUSES = ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY', 'SELECTION', 'FINALIST', 'AWARD'];

function FilmsList() {
  const [films, setFilms]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setFilter] = useState('');
  const [search, setSearch]       = useState('');
  const [updating, setUpdating]   = useState(null); // id du film en cours de mise à jour

  const token = localStorage.getItem('token');

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search)       params.set('search', search);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/films?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, token]);

  useEffect(() => { fetchFilms(); }, [fetchFilms]);

  const handleStatusChange = async (film, newStatus) => {
    setUpdating(film.id);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/films/${film.id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ status: newStatus }),
      });
      await fetchFilms();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Films Soumis</h2>
          <p className="text-white/40">Gérez les candidatures et la modération.</p>
        </div>
        <div className="bg-[#262626] px-4 py-2 rounded text-sm text-white/60">
          Total : <span className="text-white font-bold">{films.length}</span>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher titre, pays, réalisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
        />
        <select
          value={statusFilter}
          onChange={e => setFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30"
        >
          <option value="">Tous les statuts</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-white/40">
            <Loader2 size={24} className="animate-spin mr-3" />
            Chargement...
          </div>
        ) : films.length === 0 ? (
          <div className="p-16 text-center text-white/30">Aucun film trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#262626] text-white/40 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">Film / Pays</th>
                  <th className="p-4 font-medium">Réalisateur</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Changer statut</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {films.map((film) => {
                  const nextOptions = NEXT_STATUSES[film.status] ?? [];
                  return (
                    <tr key={film.id} className="hover:bg-white/5 transition-colors group">

                      {/* Badge statut */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${STATUS_STYLES[film.status] ?? ''}`}>
                          {film.status}
                        </span>
                      </td>

                      {/* Film */}
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{film.title}</div>
                        <div className="text-xs text-white/30 mt-0.5">{film.country}</div>
                      </td>

                      {/* Réalisateur (depuis relation submitter) */}
                      <td className="p-4 text-sm text-white/70">
                        <div>{film.submitter?.firstName} {film.submitter?.lastName}</div>
                        <div className="text-xs text-white/30">{film.submitter?.email}</div>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-xs text-white/40">
                        {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
                      </td>

                      {/* Changement de statut */}
                      <td className="p-4">
                        {updating === film.id ? (
                          <Loader2 size={16} className="animate-spin text-white/40" />
                        ) : nextOptions.length > 0 ? (
                          <select
                            defaultValue=""
                            onChange={e => { if (e.target.value) handleStatusChange(film, e.target.value); }}
                            className="bg-[#262626] border border-white/10 rounded px-2 py-1 text-xs text-white/70 focus:outline-none focus:border-white/30"
                          >
                            <option value="" disabled>Choisir...</option>
                            {nextOptions.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-white/20 italic">Final</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button title="Voir" className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
                            <Eye size={16} />
                          </button>
                          {film.youtubeUrl && (
                            <a href={film.youtubeUrl} target="_blank" rel="noopener noreferrer"
                               title="Voir sur YouTube"
                               className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-full text-white transition-colors">
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
    </div>
  );
}

export default FilmsList;
