import { formatDateTime } from "../../utils/format";
// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, Loader2, Users, Globe, Calendar, Cpu, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';

// "12 jan. 2026 · 14h37"

const STATUS_STYLES = {
  SUBMITTED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  IN_REVIEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  APPROVED:  'bg-green-500/10 text-green-400 border-green-500/20',
  REJECTED:  'bg-red-500/10 text-red-400 border-red-500/20',
  TO_MODIFY: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  SELECTION: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  FINALIST:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  AWARD:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
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

// Extrait l'ID YouTube depuis une URL standard ou embed
const getYoutubeId = (url) => {
  if (!url) return null;
  const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
};

function FilmDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [film, setFilm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Modal TO_MODIFY
  const [showModal, setShowModal]       = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError]     = useState('');

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFilm = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/films/${id}`, { credentials: 'include' });
        const data = await res.json();
        setFilm(data);
      } catch {
        setFilm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id, API]);

  const handleStatusChange = async (newStatus) => {
    // TO_MODIFY passe par la modale — jamais en appel direct
    if (newStatus === 'TO_MODIFY') {
      setModalMessage('');
      setModalError('');
      setShowModal(true);
      return;
    }
    setUpdating(true);
    try {
      const res  = await fetch(`${API}/films/${id}/status`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:    JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setFilm(prev => ({ ...prev, status: updated.status }));
    } finally {
      setUpdating(false);
    }
  };

  // Confirmer la demande de modification (backend gère le status TO_MODIFY)
  const handleConfirmModification = async () => {
    if (!modalMessage.trim()) {
      setModalError('Le message est obligatoire.');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const res  = await fetch(`${API}/films/${id}/request-modification`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:    JSON.stringify({ message: modalMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setFilm(prev => ({
        ...prev,
        status:                  data.status,
        modificationRequest:     data.modificationRequest,
        modificationRequestedAt: data.modificationRequestedAt,
      }));
      setShowModal(false);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'var(--color-text-faint)', fontFamily: 'var(--font-sans)' }}>
        <Loader2 size={24} className="animate-spin" style={{ marginRight: '0.75rem' }} /> Chargement...
      </div>
    );
  }

  if (!film) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--color-text-muted)' }}>
        Film introuvable.
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'block', margin: '1rem auto 0', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
        >
          Retour
        </button>
      </div>
    );
  }

  const youtubeId     = getYoutubeId(film.youtubeUrl);
  const nextOptions   = NEXT_STATUSES[film.status] ?? [];
  const assignedJurys = film.assignedUsers ?? [];
  const votes         = film.votes ?? [];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '72rem', margin: '0 auto', fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>

      {/* ── MODAL TO_MODIFY ─────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--color-bg)', border: '1px solid rgba(249,115,22,0.3)', padding: 'clamp(1.5rem, 4vw, 2rem)', width: '100%', maxWidth: '28rem' }}
          >
            <h3 style={{ fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fb923c', marginBottom: '0.25rem' }}>
              Demander des modifications
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Ce message sera envoyé par email au réalisateur avec un lien valable 7 jours.
            </p>

            <textarea
              style={{ width: '100%', background: 'transparent', border: '1px solid var(--color-border)', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text)', outline: 'none', resize: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              rows={5}
              placeholder="Décrivez précisément les modifications attendues…"
              value={modalMessage}
              onChange={e => setModalMessage(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              autoFocus
            />

            {modalError && (
              <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.5rem' }}>{modalError}</p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={() => setShowModal(false)}
                disabled={modalLoading}
                style={{ flex: 1, border: '1px solid var(--color-border)', padding: '0.625rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'none', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmModification}
                disabled={modalLoading || !modalMessage.trim()}
                className="flex-1 bg-orange-500 hover:bg-orange-400 transition-colors disabled:opacity-40"
                style={{ padding: '0.625rem', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000', border: 'none', cursor: 'pointer' }}
              >
                {modalLoading ? 'Envoi…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER éditorial ─────────────────────── */}
      <header style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
          >
            <ArrowLeft size={16} />
          </button>
          <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Fiche film</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1 }}>
                {film.title}
              </h1>
              <span className={`text-xs font-black uppercase px-2 py-1 border shrink-0 ${STATUS_STYLES[film.status] ?? ''}`}>
                {film.status}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {film.country}{film.language ? ` · ${film.language}` : ''} · soumis le {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Changement de statut inline */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {updating ? (
              <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} />
            ) : nextOptions.length > 0 ? (
              <select
                defaultValue=""
                onChange={e => { if (e.target.value) handleStatusChange(e.target.value); }}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', outline: 'none', cursor: 'pointer' }}
              >
                <option value="" disabled>Changer statut...</option>
                {nextOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>Statut final</span>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── COLONNE PRINCIPALE ─────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Vidéo YouTube */}
          {youtubeId && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={film.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
            <p className="label-overline" style={{ marginBottom: '0.75rem' }}>Description</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.75 }}>{film.description}</p>

            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
                <Globe size={12} />{film.country}
              </span>
              {film.language && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{film.language}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
                <Cpu size={12} />{film.aiToolsUsed}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>
                <Calendar size={12} />{new Date(film.submittedAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Stats votes */}
          {film.totalVotes > 0 && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              <p className="label-overline" style={{ marginBottom: '1rem' }}>Résultat jury</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="text-2xl font-bold text-green-400">{film.totalLikes}</div>
                  <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>LIKE</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="text-2xl font-bold text-red-400">{film.totalDislikes}</div>
                  <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>DISLIKE</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{film.totalVotes}</div>
                  <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>TOTAL</div>
                </div>
                {film.avgRating != null && (
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-2xl font-bold text-amber-400">{Number(film.avgRating).toFixed(1)}</div>
                    <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>MOY.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Votes détaillés */}
          {votes.length > 0 && (
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              <p className="label-overline" style={{ marginBottom: '1rem' }}>
                Votes jury <span style={{ color: 'var(--color-text-faint)', fontStyle: 'normal' }}>{votes.length}</span>
              </p>
              <div className="space-y-3">
                {votes.map(vote => (
                  <div key={vote.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-surface-high)', border: '1px solid var(--color-border)' }}>

                    {/* Sentiment */}
                    <div className={`flex-shrink-0 p-1.5 ${vote.sentiment === 'LIKE' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {vote.sentiment === 'LIKE' ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                          {vote.user?.firstName} {vote.user?.lastName}
                        </span>
                        {/* Note 1-10 */}
                        {vote.rating != null && (
                          <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5">
                            {vote.rating}/10
                          </span>
                        )}
                        {vote.suggestModification && (
                          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5">
                            <AlertTriangle size={9} /> Modification suggérée
                          </span>
                        )}
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)', fontFamily: 'monospace', marginLeft: 'auto' }}>
                          {new Date(vote.votedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Commentaires jury */}
                      {vote.comments?.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }} className="space-y-2">
                          {[...vote.comments]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map(c => (
                              <div key={c.id}
                                className={`px-3 py-2 border ${!c.isInternal ? 'bg-orange-500/5 border-orange-500/15' : ''}`}
                                style={c.isInternal ? { background: 'var(--color-surface)', borderColor: 'var(--color-border)' } : {}}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                  <span
                                    className={`text-xs font-bold uppercase tracking-wider ${!c.isInternal ? 'text-orange-400' : ''}`}
                                    style={c.isInternal ? { color: 'var(--color-text-muted)' } : {}}>
                                    {c.isInternal ? '● Commentaire' : '● Suggestion modification'}
                                  </span>
                                  {c.createdAt && (
                                    <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: 'var(--color-text-faint)' }}>
                                      {formatDateTime(c.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-sm leading-relaxed ${!c.isInternal ? 'text-orange-300' : ''}`}
                                  style={c.isInternal ? { color: 'var(--color-text)' } : {}}>
                                  {c.content}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── COLONNE LATÉRALE ───────────────────────── */}
        <div className="space-y-6">

          {/* Réalisateur */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
            <p className="label-overline" style={{ marginBottom: '1rem' }}>Réalisateur</p>
            <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{film.submitter?.firstName} {film.submitter?.lastName}</p>
            <a
              href={`mailto:${film.submitter?.email}`}
              style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {film.submitter?.email}
            </a>
            {film.submitter?.instagram && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '0.5rem' }}>@{film.submitter.instagram}</p>
            )}
            {film.submitter?.bio && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem', lineHeight: 1.75, borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                {film.submitter.bio}
              </p>
            )}
          </div>

          {/* Jurys assignés */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
            <p className="label-overline" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Users size={11} /> Jurys assignés
            </p>
            {assignedJurys.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>Aucun jury assigné.</p>
            ) : (
              <div className="space-y-2">
                {assignedJurys.map(u => (
                  <div key={u.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>{u.firstName} {u.lastName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO_MODIFY — panneau de review complet (couleurs sémantiques conservées) */}
          {film.modificationRequest && (() => {
            const versions = film.versions ?? [];
            // La version la plus récente est celle créée par applyFilmEdit (snapshot avant edit du submitter)
            const lastVersion = versions[0] ?? null;
            const submitterResponded = lastVersion
              && film.modificationRequestedAt
              && new Date(lastVersion.archivedAt) > new Date(film.modificationRequestedAt);

            // Champs à comparer pour le diff
            const DIFF_FIELDS = [
              { key: 'title',       label: 'Titre' },
              { key: 'description', label: 'Description' },
              { key: 'aiToolsUsed', label: 'Outils IA' },
              { key: 'youtubeUrl',  label: 'Lien YouTube' },
            ];
            const changedFields = submitterResponded
              ? DIFF_FIELDS.filter(f => lastVersion[f.key] !== film[f.key])
              : [];

            return (
              <div style={{ border: '1px solid rgba(249,115,22,0.2)', overflow: 'hidden' }}>

                {/* En-tête */}
                <div style={{ background: 'rgba(249,115,22,0.05)', padding: '1.25rem 1.25rem 0.75rem' }}>
                  <p className="label-overline" style={{ color: '#fb923c', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <AlertTriangle size={11} /> Demande de modification
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#fdba74', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                    {film.modificationRequest}
                  </p>
                  {film.modificationRequestedAt && (
                    <p style={{ fontSize: '0.6875rem', color: 'rgba(251,146,60,0.7)', marginTop: '0.5rem' }}>
                      Envoyée le {new Date(film.modificationRequestedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                {/* Statut de réponse */}
                <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid rgba(249,115,22,0.15)', background: submitterResponded ? 'rgba(34,197,94,0.05)' : 'rgba(249,115,22,0.05)' }}>
                  {submitterResponded ? (
                    <>
                      <CheckCircle size={11} className="text-green-400 shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-green-400">
                        Réalisateur a répondu le {new Date(lastVersion.archivedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={11} className="text-orange-400 shrink-0 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                        En attente de réponse
                      </span>
                    </>
                  )}
                </div>

                {/* Diff avant/après (si répondu) */}
                {submitterResponded && changedFields.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.2)' }} className="space-y-4">
                    <p className="label-overline">Modifications apportées</p>
                    {changedFields.map(({ key, label }) => (
                      <div key={key}>
                        <p className="label-overline" style={{ marginBottom: '0.375rem' }}>{label}</p>
                        {/* Avant */}
                        <div className="bg-red-500/5 border border-red-500/15 px-2.5 py-2 mb-1">
                          <span className="text-xs font-bold text-red-400 uppercase block mb-0.5">Avant</span>
                          <p className="text-xs text-red-300 leading-relaxed wrap-break-word line-clamp-3">
                            {lastVersion[key] || <em className="opacity-40">vide</em>}
                          </p>
                        </div>
                        {/* Après */}
                        <div className="bg-green-500/5 border border-green-500/15 px-2.5 py-2">
                          <span className="text-xs font-bold text-green-400 uppercase block mb-0.5">Après</span>
                          <p className="text-xs text-green-300 leading-relaxed wrap-break-word line-clamp-3">
                            {film[key] || <em className="opacity-40">vide</em>}
                          </p>
                        </div>
                      </div>
                    ))}
                    {changedFields.length === 0 && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', fontStyle: 'italic' }}>Aucun champ modifié.</p>
                    )}
                  </div>
                )}

                {/* Boutons de décision */}
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.1)' }} className="space-y-2">
                  <p className="label-overline" style={{ marginBottom: '0.75rem' }}>Décision</p>
                  <button
                    onClick={() => handleStatusChange('APPROVED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-green-500/15 border border-green-500/20 py-2.5 text-xs font-black uppercase tracking-wider text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle size={11} /> Approuver
                  </button>
                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/15 border border-red-500/20 py-2.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-40"
                  >
                    <XCircle size={11} /> Rejeter
                  </button>
                  <button
                    onClick={() => handleStatusChange('TO_MODIFY')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/15 py-2.5 text-xs font-black uppercase tracking-wider text-orange-400 hover:bg-orange-500/20 transition-colors disabled:opacity-40"
                  >
                    <RotateCcw size={11} /> Nouvelle demande
                  </button>
                </div>

              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default FilmDetail;
