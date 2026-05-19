/**
 * VideoModal.jsx — Modale de lecture vidéo YouTube
 *
 * Accepte tous les formats d'URL YouTube :
 *   youtube.com/watch?v=ID
 *   youtu.be/ID
 *   youtube.com/embed/ID
 *   youtube.com/shorts/ID
 *
 * Usage :
 *   const [videoModal, setVideoModal] = useState(null); // null | { title, youtubeUrl }
 *   <VideoModal film={videoModal} onClose={() => setVideoModal(null)} />
 */

import { X, ExternalLink } from 'lucide-react';

function extractYouTubeId(url: string) {
  if (!url) return null;
  const raw = url.trim();
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    // watch?v=ID
    const v = u.searchParams.get('v');
    if (v) return v;
    // youtu.be/ID
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split(/[?&]/)[0];
    // /embed/ID  ou  /shorts/ID
    const m = u.pathname.match(/^\/(embed|shorts|v)\/([^/?&]+)/);
    if (m) return m[2];
  } catch { /* URL invalide */ }
  // Fallback regex sur l'ID brut (11 chars alphanum + - + _)
  const match = raw.match(/[?&/=]([\w-]{11})(?:[?&]|$)/);
  return match ? match[1] : null;
}

export default function VideoModal({ film, onClose }: { film: any; onClose: () => void }) {
  if (!film) return null;

  const id       = extractYouTubeId(film.youtubeUrl);
  const embedUrl = id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0`
    : null;

  // Lien direct YouTube — toujours disponible si youtubeUrl existe
  const directUrl = film.youtubeUrl?.trim() || null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)' }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="video-modal-title">
      <div
        style={{ width: '100%', maxWidth: '52rem', background: 'var(--color-bg-pure)', border: '1px solid var(--color-border)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--color-border)', gap: '1rem' }}>
          <p id="video-modal-title" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.1em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {film.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ouvrir sur YouTube"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--color-text-faint)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
              >
                <ExternalLink size={11} /> YouTube
              </a>
            )}
            <button aria-label="Fermer la modale" onClick={onClose}
              style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Corps — iframe ou fallback */}
        {embedUrl ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
            <iframe
              key={embedUrl}
              src={embedUrl}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={film.title}
            />
          </div>
        ) : (
          /* Fallback : URL non reconnue → lien direct */
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#000' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Le format de l'URL vidéo n'est pas reconnu.
            </p>
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.625rem 1.25rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
              >
                <ExternalLink size={13} /> Ouvrir sur YouTube
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
