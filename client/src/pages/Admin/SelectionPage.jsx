/**
 * SelectionPage.jsx — Sélection des films pour la compétition
 *
 * Phase 2 du cycle festival : les films APPROVED (évalués par le jury)
 * sont sélectionnés ici pour entrer en compétition (→ SELECTION).
 * Les films SELECTION peuvent ensuite être nominés dans Palmarès.
 */

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Loader2, Trophy, ExternalLink, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import VideoModal from '../../components/VideoModal.jsx';

const API = import.meta.env.VITE_API_URL;

const STATUS_BG = {
  APPROVED:  'bg-green-500/10 border-green-500/20 text-green-400',
  SELECTION: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
};

const STATUS_LABELS = {
  APPROVED:  'Approuvé',
  SELECTION: 'En sélection',
};

const TABS = [
  { key: 'all',       label: 'Tous' },
  { key: 'approved',  label: 'Approuvés' },
  { key: 'selection', label: 'En sélection' },
];

export default function SelectionPage() {
  const [films, setFilms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [videoModal, setVideoModal] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/awards/selection`, { credentials: 'include' });
      const data = await res.json();
      // On n'affiche que APPROVED et SELECTION — FINALIST/AWARD sont gérés dans Palmarès
      setFilms(Array.isArray(data) ? data.filter(f => ['APPROVED', 'SELECTION'].includes(f.status)) : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (filmId, newStatus) => {
    setUpdating(filmId);
    try {
      await fetch(`${API}/films/${filmId}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:    JSON.stringify({ status: newStatus }),
      });
      await load();
    } finally {
      setUpdating(null);
    }
  };

  const approved    = films.filter(f => f.status === 'APPROVED');
  const inSelection = films.filter(f => f.status === 'SELECTION');

  const visibleFilms = activeTab === 'approved'
    ? approved
    : activeTab === 'selection'
      ? inSelection
      : films;

  return (
    <div className="animate-fade-in" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>

      {/* ── Header éditorial ── */}
      <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Films</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', color: 'var(--color-text)', lineHeight: 1, marginBottom: '0.5rem' }}>
              Sélection
            </h1>
            <p className="body-meta">Films approuvés par le jury — à sélectionner pour la compétition.</p>
          </div>

          {/* Pont vers Palmarès — visible quand des films sont prêts à être nominés */}
          {inSelection.length > 0 && (
            <Link
              to={`${ROUTES.ADMIN}/${ROUTES.ADMIN_AWARDS}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '0.5rem 0.875rem', transition: 'background 0.15s, border-color 0.15s', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.15)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'; }}
            >
              <Trophy size={12} />
              {inSelection.length} film{inSelection.length > 1 ? 's' : ''} prêt{inSelection.length > 1 ? 's' : ''} à nominer → Palmarès
            </Link>
          )}
        </div>
      </header>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black" style={{ color: 'var(--color-text)' }}>{films.length}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Tous</p>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black text-green-400">{approved.length}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Approuvés</p>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black text-indigo-400">{inSelection.length}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>En sélection</p>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0' }}>
        {TABS.map(tab => {
          const count = tab.key === 'all' ? films.length : tab.key === 'approved' ? approved.length : inSelection.length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                color: isActive ? '#818cf8' : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
              <span style={{ marginLeft: '0.4rem', opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── Tableau ── */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ marginRight: '0.75rem' }} /> Chargement...
        </div>
      ) : visibleFilms.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', fontSize: '0.875rem' }}>
          {activeTab === 'selection'
            ? 'Aucun film en sélection pour le moment.'
            : activeTab === 'approved'
              ? 'Aucun film approuvé à sélectionner.'
              : 'Aucun film approuvé disponible pour la sélection.'}
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: '640px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-high)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Statut', 'Film · Pays', 'Réalisateur', 'Note moy.', 'Action', ''].map((h, i) => (
                    <th key={i} className="label-overline" style={{ padding: '1rem', textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleFilms.map(film => (
                  <tr
                    key={film.id}
                    onClick={() => navigate(`/admin/films/${film.id}`)}
                    style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <span className={`text-[11px] px-2 py-0.5 border font-bold uppercase tracking-wider ${STATUS_BG[film.status] ?? ''}`}>
                        {STATUS_LABELS[film.status] ?? film.status}
                      </span>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.875rem' }}>{film.title}</span>
                        <ExternalLink size={11} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>{film.country}</div>
                    </td>

                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      <div>{film.submitter?.firstName} {film.submitter?.lastName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{film.submitter?.email}</div>
                    </td>

                    <td style={{ padding: '1rem' }}>
                      {film.avgRating != null ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-text)' }}>
                          {Number(film.avgRating).toFixed(1)}
                          <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}> / {film.totalVotes}v</span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem' }} onClick={e => e.stopPropagation()}>
                      {updating === film.id ? (
                        <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} />
                      ) : film.status === 'APPROVED' ? (
                        <button
                          onClick={() => changeStatus(film.id, 'SELECTION')}
                          style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.375rem 0.75rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                        >
                          → Sélectionner
                        </button>
                      ) : film.status === 'SELECTION' ? (
                        <button
                          onClick={() => changeStatus(film.id, 'APPROVED')}
                          style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.375rem 0.75rem', background: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                        >
                          <RotateCcw size={10} /> Retirer
                        </button>
                      ) : null}
                    </td>

                    {/* Vidéo — stopPropagation */}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modale vidéo ── */}
      <VideoModal film={videoModal} onClose={() => setVideoModal(null)} />
    </div>
  );
}