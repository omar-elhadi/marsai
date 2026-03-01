import { useState, useEffect, useCallback } from 'react';
import { Play, Eye, Loader2, Users, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Couleurs des badges et chips par statut — conservées (information visuelle métier)
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

const FILTER_ORDER = ['SUBMITTED', 'IN_REVIEW', 'TO_MODIFY', 'APPROVED', 'REJECTED', 'SELECTION', 'FINALIST', 'AWARD'];

function FilmsList() {
  const [films, setFilms]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [stats, setStats]               = useState({ total: 0, byStatus: {}, suggestions: 0 });
  const [statusFilter, setFilter]       = useState('');
  const [hasSuggestions, setSuggestions]= useState(false);
  const [search, setSearch]             = useState('');
  const [updating, setUpdating]         = useState(null);
  const [assigning, setAssigning]       = useState(null);
  const [juryUsers, setJuryUsers]       = useState([]);
  const [assignPopup, setAssignPopup]   = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/films/stats`, { credentials: 'include' });
      const data = await res.json();
      setStats(data);
    } catch { /* silencieux */ }
  }, [API]);

  const fetchFilms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter)   params.set('status', statusFilter);
      if (search)         params.set('search', search);
      if (hasSuggestions) params.set('hasSuggestions', 'true');
      const res  = await fetch(`${API}/films?${params}`, { credentials: 'include' });
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } catch {
      setFilms([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, hasSuggestions, API]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchFilms(); }, [fetchFilms]);

  useEffect(() => {
    const fetchJury = async () => {
      try {
        const res  = await fetch(`${API}/users`, { credentials: 'include' });
        const data = await res.json();
        setJuryUsers(Array.isArray(data) ? data.filter(u => u.role === 'JURY') : []);
      } catch { setJuryUsers([]); }
    };
    fetchJury();
  }, [API]);

  const selectFilter = (status) => {
    setSuggestions(false);
    setFilter(status === statusFilter ? '' : status);
  };

  const handleStatusChange = async (film, newStatus) => {
    setUpdating(film.id);
    try {
      await fetch(`${API}/films/${film.id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:    JSON.stringify({ status: newStatus }),
      });
      await Promise.all([fetchFilms(), fetchStats()]);
    } finally {
      setUpdating(null);
    }
  };

  const openAssignPopup = (film) => {
    setAssignPopup({ filmId: film.id, selectedIds: (film.assignedUsers ?? []).map(u => u.id) });
  };

  const handleAssign = async () => {
    if (!assignPopup) return;
    setAssigning(assignPopup.filmId);
    try {
      await fetch(`${API}/films/${assignPopup.filmId}/assign`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

      {/* ── Header éditorial ── */}
      <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
              <span className="label-overline">Modération</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--color-text)', lineHeight: 1, marginBottom: '0.5rem' }}>
              Films reçus
            </h1>
            <p className="body-meta">Gérez les candidatures et la modération.</p>
          </div>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Total : <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>{stats.total}</span>
          </div>
        </div>
      </header>

      {/* ── Chips de filtre ── */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div className="flex flex-wrap gap-2 items-center">

          {/* ALL */}
          <button
            onClick={() => { setFilter(''); setSuggestions(false); }}
            className="px-3 py-1.5 text-xs font-black uppercase tracking-widest border transition-all"
            style={{
              background: !statusFilter ? 'var(--color-surface-high)' : 'transparent',
              color:      !statusFilter ? 'var(--color-text)' : 'var(--color-text-muted)',
              border:     `1px solid ${!statusFilter ? 'var(--color-border-hover)' : 'var(--color-border)'}`,
            }}
          >
            All <span style={{ opacity: 0.6, marginLeft: '0.25rem' }}>{stats.total}</span>
          </button>

          {/* Chips par statut — gardent leurs couleurs Tailwind */}
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

        {/* Sous-filtre Suggestions */}
        {statusFilter === 'IN_REVIEW' && (
          <div style={{ marginTop: '0.5rem', marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '0.75rem', height: '1px', background: 'var(--color-border)' }} />
            <button
              onClick={() => setSuggestions(prev => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-widest border transition-all
                ${hasSuggestions
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-orange-500/5 text-orange-400/60 border-orange-500/15 hover:opacity-100'}`}
            >
              <AlertTriangle size={10} />
              Suggestions jurys
              <span style={{ opacity: 0.6 }}>{stats.suggestions ?? 0}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Recherche ── */}
      <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher titre, pays, réalisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 placeholder:text-text-faint"
          style={{
            background:  'var(--color-surface)',
            border:      '1px solid var(--color-border)',
            padding:     '0.5rem 1rem',
            fontSize:    '0.875rem',
            color:       'var(--color-text)',
            outline:     'none',
            transition:  'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-border-hover)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* ── Tableau ── */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
            <Loader2 size={24} className="animate-spin" style={{ marginRight: '0.75rem' }} />Chargement...
          </div>
        ) : films.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Aucun film trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: '720px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-high)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Statut', 'Film / Pays', 'Réalisateur', 'Date', 'Jurys', 'Changer statut', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className="label-overline"
                      style={{ padding: '1rem', textAlign: i === 6 ? 'right' : 'left' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {films.map((film) => {
                  const nextOptions   = NEXT_STATUSES[film.status] ?? [];
                  const assignedJurys = film.assignedUsers ?? [];

                  return (
                    <tr
                      key={film.id}
                      style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <span className={`text-xs font-bold uppercase px-2 py-1 border ${STATUS_STYLES[film.status] ?? ''}`}>
                          {film.status}
                        </span>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.875rem' }}>{film.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>{film.country}</div>
                      </td>

                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        <div>{film.submitter?.firstName} {film.submitter?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{film.submitter?.email}</div>
                      </td>

                      <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
                        {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
                      </td>

                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                          {assignedJurys.length > 0 ? assignedJurys.map(u => (
                            <span key={u.id} className="text-[11px] uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5">
                              {u.firstName}
                            </span>
                          )) : (
                            <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem', fontStyle: 'italic' }}>—</span>
                          )}
                          <button
                            onClick={() => openAssignPopup(film)}
                            title="Gérer les jurys"
                            className="ml-1 p-1 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                            style={{ color: 'var(--color-text-faint)' }}
                          >
                            <Users size={13} />
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '1rem' }}>
                        {updating === film.id ? (
                          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-text-muted)' }} />
                        ) : nextOptions.length > 0 ? (
                          <select
                            defaultValue=""
                            onChange={e => { if (e.target.value) handleStatusChange(film, e.target.value); }}
                            style={{ background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-text)', outline: 'none' }}
                          >
                            <option value="" disabled>Choisir...</option>
                            {nextOptions.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>Final</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Link
                            to={`/admin/films/${film.id}`}
                            title="Voir le détail"
                            className="p-2 hover:bg-surface-high hover:text-text transition-colors inline-flex"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            <Eye size={16} />
                          </Link>
                          {film.youtubeUrl && (
                            <a
                              href={film.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Voir sur YouTube"
                              className="p-2 hover:bg-indigo-500/20 hover:text-indigo-400 transition-colors"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
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

      {/* ── Popup assignation ── */}
      {assignPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setAssignPopup(null)}
        >
          <div
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '1.5rem', width: '100%', maxWidth: '24rem' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <p className="label-overline">Assigner des jurys</p>
              <button onClick={() => setAssignPopup(null)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {juryUsers.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>Aucun jury disponible.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '15rem', overflowY: 'auto' }}>
                {juryUsers.map(user => (
                  <label
                    key={user.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <input
                      type="checkbox"
                      checked={assignPopup.selectedIds.includes(user.id)}
                      onChange={() => toggleJury(user.id)}
                      className="accent-indigo-500 w-4 h-4"
                    />
                    <div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>{user.firstName} {user.lastName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                onClick={() => setAssignPopup(null)}
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', background: 'none', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-border-hover)'; e.currentTarget.style.color = 'var(--color-text)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
              >
                Annuler
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning === assignPopup?.filmId}
                className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                style={{ padding: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer' }}
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
