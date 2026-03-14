// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Play, Loader2, Users, X, AlertTriangle, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VideoModal from '../../components/VideoModal.jsx';

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

// Transitions disponibles depuis la phase Évaluation uniquement.
// APPROVED → SELECTION se fait depuis la page Sélection (séparation des phases).
const NEXT_STATUSES = {
  SUBMITTED: ['IN_REVIEW', 'APPROVED', 'REJECTED', 'TO_MODIFY'],
  IN_REVIEW:  ['APPROVED', 'REJECTED', 'TO_MODIFY'],
  TO_MODIFY:  ['IN_REVIEW', 'APPROVED', 'REJECTED'],
  APPROVED:   ['REJECTED', 'TO_MODIFY'],
  REJECTED:   [],
};


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
  const [assignError, setAssignError]   = useState('');
  const [videoModal, setVideoModal]     = useState(null);

  const navigate = useNavigate();
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
      // On exclut les films de la phase compétition (Sélection / Palmarès)
      const EVAL_STATUSES = new Set(['SUBMITTED', 'IN_REVIEW', 'TO_MODIFY', 'APPROVED', 'REJECTED']);
      setFilms(Array.isArray(data) ? data.filter(f => EVAL_STATUSES.has(f.status)) : []);
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
    setAssignError('');
    setAssignPopup({
      filmId:     film.id,
      filmTitle:  film.title,
      filmStatus: film.status,
      selectedIds: (film.assignedUsers ?? []).map(u => u.id),
    });
  };

  const handleAssign = async () => {
    if (!assignPopup) return;
    setAssigning(assignPopup.filmId);
    setAssignError('');
    try {
      const res = await fetch(`${API}/films/${assignPopup.filmId}/assign`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:    JSON.stringify({ userIds: assignPopup.selectedIds }),
      });
      if (!res.ok) {
        const err = await res.json();
        setAssignError(err.error || 'Erreur lors de l\'assignation');
        return;
      }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Modération</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--color-text)', lineHeight: 1, marginBottom: '0.5rem' }}>
              Évaluation
            </h1>
            <p className="body-meta">Réception, assignation et modération des films soumis.</p>
          </div>

          {/* Lien contextuel → Sélection quand des films sont prêts */}
          {(stats.byStatus?.APPROVED ?? 0) > 0 && (
            <Link
              to="/admin/selection"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '0.5rem 0.875rem', transition: 'background 0.15s, border-color 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.15)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'; }}
            >
              <Star size={12} />
              {stats.byStatus.APPROVED} film{stats.byStatus.APPROVED > 1 ? 's' : ''} approuvé{stats.byStatus.APPROVED > 1 ? 's' : ''} prêt{stats.byStatus.APPROVED > 1 ? 's' : ''} → Sélection
            </Link>
          )}
        </div>
      </header>

      {/* ── KPIs par statut ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(80px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.875rem' }}>
          <p className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>{stats.total ?? 0}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Tous</p>
        </div>
        {[
          { status: 'SUBMITTED', label: 'Soumis',     color: '#fbbf24' },
          { status: 'IN_REVIEW', label: 'En éval.',   color: '#60a5fa' },
          { status: 'TO_MODIFY', label: 'À corriger', color: '#fb923c' },
          { status: 'APPROVED',  label: 'Approuvés',  color: '#4ade80' },
          { status: 'REJECTED',  label: 'Rejetés',    color: '#f87171' },
        ].map(({ status, label, color }) => (
          <div key={status} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.875rem' }}>
            <p className="text-2xl font-black" style={{ color }}>{stats.byStatus?.[status] ?? 0}</p>
            <p className="label-overline" style={{ marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Onglets de filtre ── */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0' }}>
        <button
          onClick={() => { setFilter(''); setSuggestions(false); }}
          style={{
            padding: '0.5rem 1rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            background: 'none', border: 'none',
            borderBottom: !statusFilter ? '2px solid #6366f1' : '2px solid transparent',
            color: !statusFilter ? '#818cf8' : 'var(--color-text-muted)',
            cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s', marginBottom: '-1px',
          }}
        >
          Tous <span style={{ marginLeft: '0.4rem', opacity: 0.6 }}>({stats.total})</span>
        </button>

        {[
          { status: 'SUBMITTED', label: 'Soumis'     },
          { status: 'IN_REVIEW', label: 'En éval.'   },
          { status: 'TO_MODIFY', label: 'À corriger' },
          { status: 'APPROVED',  label: 'Approuvés'  },
          { status: 'REJECTED',  label: 'Rejetés'    },
        ].map(({ status, label }) => {
          const isActive = statusFilter === status && !hasSuggestions;
          return (
            <button
              key={status}
              onClick={() => selectFilter(status)}
              style={{
                padding: '0.5rem 1rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                background: 'none', border: 'none',
                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                color: isActive ? '#818cf8' : 'var(--color-text-muted)',
                cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s', marginBottom: '-1px',
              }}
            >
              {label} <span style={{ marginLeft: '0.4rem', opacity: 0.6 }}>({stats.byStatus?.[status] ?? 0})</span>
            </button>
          );
        })}
      </div>

      {/* Sous-filtre Suggestions — affiché sous les onglets si IN_REVIEW actif */}
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
                      onClick={() => navigate(`/admin/films/${film.id}`)}
                      style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Statut */}
                      <td style={{ padding: '1rem' }}>
                        <span className={`text-[11px] px-2 py-0.5 border font-bold uppercase tracking-wider ${STATUS_STYLES[film.status] ?? ''}`}>
                          {film.status}
                        </span>
                      </td>

                      {/* Film · Pays */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.875rem' }}>{film.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>{film.country}</div>
                      </td>

                      {/* Réalisateur */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{film.submitter?.firstName} {film.submitter?.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '0.125rem' }}>{film.submitter?.email}</div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '1rem', fontSize: '0.75rem', color: 'var(--color-text-faint)', whiteSpace: 'nowrap' }}>
                        {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
                      </td>

                      {/* Jurys — stopPropagation pour ne pas naviguer */}
                      <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                        {assignedJurys.length === 0 ? (
                          <button
                            onClick={() => openAssignPopup(film)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#818cf8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '0.375rem 0.625rem', cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                          >
                            <Users size={11} /> + Assigner
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                            {assignedJurys.map(u => (
                              <span key={u.id} style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', padding: '0.125rem 0.5rem' }}>
                                {u.firstName}
                              </span>
                            ))}
                            <button
                              onClick={() => openAssignPopup(film)}
                              title="Modifier les jurys"
                              style={{ marginLeft: '0.125rem', padding: '0.25rem', color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', display: 'flex' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                            >
                              <Users size={12} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Changer statut — stopPropagation */}
                      <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
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

                      {/* Actions — stopPropagation + bouton play modale */}
                      <td style={{ padding: '1rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        {film.youtubeUrl && (
                          <button
                            onClick={() => setVideoModal(film)}
                            title="Voir la vidéo"
                            style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem', transition: 'color 0.15s', display: 'inline-flex', alignItems: 'center' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                          >
                            <Play size={16} />
                          </button>
                        )}
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
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', width: '100%', maxWidth: '26rem', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ minWidth: 0 }}>
                <p className="label-overline" style={{ marginBottom: '0.25rem' }}>Assigner des jurys</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {assignPopup.filmTitle}
                </p>
              </div>
              <button onClick={() => setAssignPopup(null)} style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '0.125rem' }}>
                <X size={16} />
              </button>
            </div>

            {/* Alerte contextuelle — transition de statut */}
            {assignPopup.filmStatus === 'SUBMITTED' && assignPopup.selectedIds.length > 0 && (
              <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(99,102,241,0.07)', borderBottom: '1px solid rgba(99,102,241,0.15)', fontSize: '0.6875rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                → Film passera en <strong style={{ marginLeft: '0.25rem' }}>IN_REVIEW</strong>
              </div>
            )}
            {assignPopup.filmStatus === 'IN_REVIEW' && assignPopup.selectedIds.length === 0 && (
              <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(234,179,8,0.07)', borderBottom: '1px solid rgba(234,179,8,0.15)', fontSize: '0.6875rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                ⚠ Sans jury, le film repassera en <strong style={{ marginLeft: '0.25rem' }}>SUBMITTED</strong>
              </div>
            )}

            {/* Liste jurys */}
            <div style={{ maxHeight: '16rem', overflowY: 'auto', padding: '0.5rem' }}>
              {juryUsers.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic', padding: '1rem' }}>Aucun jury disponible.</p>
              ) : juryUsers.map(user => {
                const isSelected = assignPopup.selectedIds.includes(user.id);
                const initials   = `${user.firstName?.[0] ?? '?'}${user.lastName?.[0] ?? ''}`.toUpperCase();
                return (
                  <label
                    key={user.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', cursor: 'pointer', transition: 'background 0.15s', background: isSelected ? 'rgba(99,102,241,0.1)' : 'transparent', borderLeft: `2px solid ${isSelected ? '#6366f1' : 'transparent'}` }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-surface)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Avatar initiales */}
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: isSelected ? '#6366f1' : 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem', fontWeight: 900, color: isSelected ? '#fff' : 'var(--color-text-muted)', flexShrink: 0, transition: 'background 0.15s, color 0.15s', letterSpacing: '0.05em' }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.875rem', color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)', fontWeight: isSelected ? 600 : 400, transition: 'color 0.15s' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJury(user.id)}
                      className="accent-indigo-500 w-4 h-4 shrink-0"
                    />
                  </label>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
              {/* Résumé + erreur */}
              <p style={{ fontSize: '0.6875rem', color: assignError ? '#f87171' : 'var(--color-text-faint)', textAlign: 'center', marginBottom: '0.75rem', minHeight: '1rem' }}>
                {assignError
                  ? assignError
                  : assignPopup.selectedIds.length === 0
                    ? 'Aucun jury sélectionné'
                    : `${assignPopup.selectedIds.length} jury${assignPopup.selectedIds.length > 1 ? 's' : ''} sélectionné${assignPopup.selectedIds.length > 1 ? 's' : ''}`
                }
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: assigning === assignPopup?.filmId ? 0.5 : 1, transition: 'opacity 0.2s' }}
                >
                  {assigning === assignPopup?.filmId ? <Loader2 size={14} className="animate-spin" /> : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modale vidéo ── */}
      <VideoModal film={videoModal} onClose={() => setVideoModal(null)} />

    </div>
  );
}

export default FilmsList;
