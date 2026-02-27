import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, AlertTriangle, Loader2, Users, Globe, Calendar, Cpu } from 'lucide-react';

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
                        {vote.suggestModification && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded">
                            <AlertTriangle size={9} /> Modification suggérée
                          </span>
                        )}
                        <span className="text-[10px] text-white/30 ml-auto">
                          {new Date(vote.votedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Commentaires ReviewComment */}
                      {vote.comments?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {vote.comments.map(c => (
                            <p key={c.id} className="text-xs text-white/50 bg-white/5 rounded px-2 py-1">
                              {c.isInternal && <span className="text-orange-400/70 mr-1">[interne]</span>}
                              {c.content}
                            </p>
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

          {/* TO_MODIFY — note de modification */}
          {film.modificationRequest && (
            <div className="bg-orange-500/5 rounded-lg border border-orange-500/20 p-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-400/70 mb-3 flex items-center gap-2">
                <AlertTriangle size={11} /> Demande de modification
              </h3>
              <p className="text-xs text-orange-300/80 leading-relaxed">{film.modificationRequest}</p>
              {film.modificationRequestedAt && (
                <p className="text-[10px] text-orange-400/40 mt-2">
                  {new Date(film.modificationRequestedAt).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilmDetail;
