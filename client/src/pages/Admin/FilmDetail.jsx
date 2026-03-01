import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, Loader2, Users, Globe, Calendar, Cpu, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';

// "12 jan. 2026 · 14h37"
const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d    = new Date(dateStr);
  const date = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
};

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

  const token = localStorage.getItem('token');
  const API   = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFilm = async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API}/films/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFilm(data);
      } catch {
        setFilm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id, token, API]);

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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
      <div className="flex items-center justify-center h-64 text-white/40">
        <Loader2 size={24} className="animate-spin mr-3" /> Chargement...
      </div>
    );
  }

  if (!film) {
    return (
      <div className="text-center py-24 text-white/30">
        Film introuvable.
        <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-white/50 hover:text-white underline text-sm">
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
    <div className="animate-fade-in max-w-5xl mx-auto">

      {/* ── MODAL TO_MODIFY ─────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1a1a1a] border border-orange-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-orange-400 mb-1">
              Demander des modifications
            </h3>
            <p className="text-xs text-white/40 mb-4">
              Ce message sera envoyé par email au réalisateur avec un lien valable 7 jours.
            </p>

            <textarea
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 resize-none transition-colors"
              rows={5}
              placeholder="Décrivez précisément les modifications attendues…"
              value={modalMessage}
              onChange={e => setModalMessage(e.target.value)}
              autoFocus
            />

            {modalError && (
              <p className="text-xs text-red-400 mt-2">{modalError}</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={modalLoading}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmModification}
                disabled={modalLoading || !modalMessage.trim()}
                className="flex-1 rounded-lg bg-orange-500 py-2.5 text-xs font-black uppercase tracking-widest text-black hover:bg-orange-400 transition-colors disabled:opacity-40"
              >
                {modalLoading ? 'Envoi…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ─────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 p-2 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-white truncate">{film.title}</h2>
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border flex-shrink-0 ${STATUS_STYLES[film.status] ?? ''}`}>
              {film.status}
            </span>
          </div>
          <p className="text-white/40 text-sm mt-1">
            {film.country}{film.language ? ` · ${film.language}` : ''} · soumis le {new Date(film.submittedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Changement de statut inline */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {updating ? (
            <Loader2 size={16} className="animate-spin text-white/40" />
          ) : nextOptions.length > 0 ? (
            <select
              defaultValue=""
              onChange={e => { if (e.target.value) handleStatusChange(e.target.value); }}
              className="bg-[#262626] border border-white/10 rounded px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-white/30"
            >
              <option value="" disabled>Changer statut...</option>
              {nextOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <span className="text-xs text-white/20 italic">Statut final</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── COLONNE PRINCIPALE ─────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Vidéo YouTube */}
          {youtubeId && (
            <div className="bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
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
          <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Description</h3>
            <p className="text-white/80 text-sm leading-relaxed">{film.description}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><Globe size={12} />{film.country}</span>
              {film.language && <span>{film.language}</span>}
              <span className="flex items-center gap-1.5"><Cpu size={12} />{film.aiToolsUsed}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} />{new Date(film.submittedAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Stats votes */}
          {film.totalVotes > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Résultat jury</h3>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{film.totalLikes}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mt-1">LIKE</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{film.totalDislikes}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mt-1">DISLIKE</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{film.totalVotes}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/30 mt-1">TOTAL</div>
                </div>
                {film.avgRating != null && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{Number(film.avgRating).toFixed(1)}</div>
                    <div className="text-[10px] uppercase tracking-wider text-white/30 mt-1">MOY.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Votes détaillés */}
          {votes.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">
                Votes jury <span className="ml-1 opacity-50">{votes.length}</span>
              </h3>
              <div className="space-y-3">
                {votes.map(vote => (
                  <div key={vote.id} className="flex items-start gap-3 p-3 rounded bg-white/3 border border-white/5">

                    {/* Sentiment */}
                    <div className={`flex-shrink-0 p-1.5 rounded ${vote.sentiment === 'LIKE' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {vote.sentiment === 'LIKE' ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">
                          {vote.user?.firstName} {vote.user?.lastName}
                        </span>
                        {/* Note 1-10 */}
                        {vote.rating != null && (
                          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                            {vote.rating}/10
                          </span>
                        )}
                        {vote.suggestModification && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded">
                            <AlertTriangle size={9} /> Modification suggérée
                          </span>
                        )}
                        <span className="text-[10px] text-white/30 ml-auto">
                          {new Date(vote.votedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Commentaires jury */}
                      {vote.comments?.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {[...vote.comments]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(c => (
                              <div key={c.id} className={`rounded px-3 py-2 border
                                ${c.isInternal
                                  ? 'bg-white/3 border-white/5'
                                  : 'bg-orange-500/5 border-orange-500/15'}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider
                                    ${c.isInternal ? 'text-white/25' : 'text-orange-400/70'}`}>
                                    {c.isInternal ? '● Commentaire' : '● Suggestion modification'}
                                  </span>
                                  {c.createdAt && (
                                    <span className="text-[9px] font-mono text-white/20">
                                      {formatDateTime(c.createdAt)}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-xs leading-relaxed
                                  ${c.isInternal ? 'text-white/55' : 'text-orange-300/70'}`}>
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
          <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Réalisateur</h3>
            <p className="text-white font-bold">{film.submitter?.firstName} {film.submitter?.lastName}</p>
            <a href={`mailto:${film.submitter?.email}`} className="text-xs text-white/40 hover:text-white/70 transition-colors mt-0.5 block">
              {film.submitter?.email}
            </a>
            {film.submitter?.instagram && (
              <p className="text-xs text-white/30 mt-2">@{film.submitter.instagram}</p>
            )}
            {film.submitter?.bio && (
              <p className="text-xs text-white/50 mt-3 leading-relaxed border-t border-white/5 pt-3">{film.submitter.bio}</p>
            )}
          </div>

          {/* Jurys assignés */}
          <div className="bg-[#1a1a1a] rounded-lg border border-white/5 p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Users size={11} /> Jurys assignés
            </h3>
            {assignedJurys.length === 0 ? (
              <p className="text-xs text-white/20 italic">Aucun jury assigné.</p>
            ) : (
              <div className="space-y-2">
                {assignedJurys.map(u => (
                  <div key={u.id} className="flex flex-col">
                    <span className="text-sm text-white">{u.firstName} {u.lastName}</span>
                    <span className="text-xs text-white/30">{u.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TO_MODIFY — panneau de review complet */}
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
              <div className="rounded-lg border border-orange-500/20 overflow-hidden">

                {/* En-tête */}
                <div className="bg-orange-500/8 px-5 pt-5 pb-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-400/70 mb-3 flex items-center gap-2">
                    <AlertTriangle size={11} /> Demande de modification
                  </h3>
                  <p className="text-xs text-orange-300/80 leading-relaxed whitespace-pre-wrap">
                    {film.modificationRequest}
                  </p>
                  {film.modificationRequestedAt && (
                    <p className="text-[10px] text-orange-400/40 mt-2">
                      Envoyée le {new Date(film.modificationRequestedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                {/* Statut de réponse */}
                <div className={`px-5 py-3 flex items-center gap-2 border-t border-orange-500/15 ${submitterResponded ? 'bg-green-500/5' : 'bg-white/2'}`}>
                  {submitterResponded ? (
                    <>
                      <CheckCircle size={11} className="text-green-400 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                        Réalisateur a répondu le {new Date(lastVersion.archivedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={11} className="text-orange-400/50 flex-shrink-0 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400/50">
                        En attente de réponse
                      </span>
                    </>
                  )}
                </div>

                {/* Diff avant/après (si répondu) */}
                {submitterResponded && changedFields.length > 0 && (
                  <div className="border-t border-white/5 px-5 py-4 space-y-4 bg-black/20">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/30">Modifications apportées</p>
                    {changedFields.map(({ key, label }) => (
                      <div key={key}>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/25 mb-1.5">{label}</p>
                        {/* Avant */}
                        <div className="bg-red-500/5 border border-red-500/15 rounded px-2.5 py-2 mb-1">
                          <span className="text-[9px] font-bold text-red-400/60 uppercase block mb-0.5">Avant</span>
                          <p className="text-[11px] text-red-300/70 leading-relaxed break-words line-clamp-3">
                            {lastVersion[key] || <em className="opacity-40">vide</em>}
                          </p>
                        </div>
                        {/* Après */}
                        <div className="bg-green-500/5 border border-green-500/15 rounded px-2.5 py-2">
                          <span className="text-[9px] font-bold text-green-400/60 uppercase block mb-0.5">Après</span>
                          <p className="text-[11px] text-green-300/70 leading-relaxed break-words line-clamp-3">
                            {film[key] || <em className="opacity-40">vide</em>}
                          </p>
                        </div>
                      </div>
                    ))}
                    {changedFields.length === 0 && (
                      <p className="text-xs text-white/25 italic">Aucun champ modifié.</p>
                    )}
                  </div>
                )}

                {/* Boutons de décision */}
                <div className="border-t border-white/5 px-5 py-4 space-y-2 bg-black/10">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/25 mb-3">Décision</p>
                  <button
                    onClick={() => handleStatusChange('APPROVED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 rounded bg-green-500/15 border border-green-500/20 py-2 text-[10px] font-black uppercase tracking-wider text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle size={11} /> Approuver
                  </button>
                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 rounded bg-red-500/15 border border-red-500/20 py-2 text-[10px] font-black uppercase tracking-wider text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-40"
                  >
                    <XCircle size={11} /> Rejeter
                  </button>
                  <button
                    onClick={() => handleStatusChange('TO_MODIFY')}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 rounded bg-orange-500/10 border border-orange-500/15 py-2 text-[10px] font-black uppercase tracking-wider text-orange-400/70 hover:bg-orange-500/20 transition-colors disabled:opacity-40"
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
