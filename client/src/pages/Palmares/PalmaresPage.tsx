/**
 * PalmaresPage.jsx — MARSAI Festival
 * Page publique du palmarès, par édition et par catégorie.
 * Accessible sans authentification.
 */

import { useState, useEffect } from 'react';
import { Trophy, Star, Crown, Loader2, Film } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;
const DEFAULT_EDITION = new Date().getFullYear();

function formatEdition(year) {
  return `Édition ${year}`;
}

function FilmCard({ nomination }) {
  const { film, isWinner } = nomination;

  return (
    <div style={{
      display:      'flex',
      alignItems:   'flex-start',
      gap:          '1rem',
      padding:      '1rem 1.25rem',
      border:       `1px solid ${isWinner ? 'rgba(245,158,11,0.3)' : 'var(--color-border)'}`,
      background:   isWinner ? 'rgba(245,158,11,0.05)' : 'transparent',
      marginBottom: '0.5rem',
    }}>
      {/* Icône */}
      <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>
        {isWinner
          ? <Crown size={16} style={{ color: '#f59e0b' }} />
          : <Film  size={16} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
        }
      </div>

      {/* Infos film */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: isWinner ? 700 : 400,
          fontSize:   '0.95rem',
          color:      isWinner ? '#fbbf24' : 'var(--color-text)',
          marginBottom: '0.2rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {film.title}
          {isWinner && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b' }}>
              — Gagnant
            </span>
          )}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {film.submitter?.firstName} {film.submitter?.lastName}
          {film.country && <> &mdash; {film.country}</>}
        </p>
      </div>

      {/* Lien YouTube */}
      {film.youtubeUrl && (
        <a
          href={film.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            flexShrink:     0,
            fontFamily:     'var(--font-sans)',
            fontWeight:     800,
            fontSize:       '0.65rem',
            letterSpacing:  '0.1em',
            textTransform:  'uppercase',
            color:          'var(--color-text-muted)',
            textDecoration: 'none',
            border:         '1px solid var(--color-border)',
            padding:        '0.35rem 0.75rem',
            whiteSpace:     'nowrap',
          }}
        >
          ▶ Voir
        </a>
      )}
    </div>
  );
}

export default function PalmaresPage() {
  const [editions, setEditions]     = useState([]);
  const [edition, setEdition]       = useState(DEFAULT_EDITION);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Charger les éditions disponibles
  useEffect(() => {
    fetch(`${API}/awards/editions`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEditions(data);
          setEdition(data[0]); // édition la plus récente
        }
      })
      .catch(() => {});
  }, []);

  // Charger le palmarès de l'édition sélectionnée
  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/awards/palmares?edition=${edition}`)
      .then(r => r.json())
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Impossible de charger le palmarès.');
        setLoading(false);
      });
  }, [edition]);

  const hasContent = categories.some(c => c.nominations.length > 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-pure)', paddingTop: 'clamp(6rem,10vw,8rem)' }}>

      {/* ── Hero ── */}
      <section style={{
        padding:      'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)',
        borderBottom: '1px solid var(--color-border)',
        maxWidth:     '900px',
        margin:       '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'block', width: 'clamp(2rem,3vw,3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Festival MARSAI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontWeight:    900,
            fontSize:      'clamp(2.5rem,6vw,5rem)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color:         'var(--color-text)',
            lineHeight:    1,
          }}>
            Palmarès
          </h1>

          {/* Sélecteur d'édition */}
          {editions.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {editions.map(y => (
                <button
                  key={y}
                  onClick={() => setEdition(y)}
                  style={{
                    fontFamily:    'var(--font-sans)',
                    fontWeight:    800,
                    fontSize:      '0.7rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding:       '0.5rem 1rem',
                    border:        `1px solid ${y === edition ? 'var(--color-text)' : 'var(--color-border)'}`,
                    background:    y === edition ? 'var(--color-text)' : 'transparent',
                    color:         y === edition ? 'var(--color-bg-pure)' : 'var(--color-text-muted)',
                    cursor:        'pointer',
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="body-meta" style={{ marginTop: '0.75rem' }}>
          {formatEdition(edition)} — Films d'une minute générés par IA
        </p>
      </section>

      {/* ── Corps ── */}
      <section style={{
        padding:  'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)',
        maxWidth: '900px',
        margin:   '0 auto',
      }}>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-text-muted)' }} />
          </div>
        )}

        {error && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '4rem 0' }}>
            {error}
          </p>
        )}

        {!loading && !error && !hasContent && (
          <div style={{ textAlign: 'center', padding: 'clamp(4rem,8vw,8rem) 0' }}>
            <Trophy size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.2, margin: '0 auto 1.5rem' }} />
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Le palmarès {edition} sera annoncé lors de la cérémonie de remise des prix.<br />
              Rendez-vous le 12-13 juin 2026, Marseille.
            </p>
          </div>
        )}

        {!loading && !error && hasContent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem,5vw,4rem)' }}>
            {categories
              .filter(cat => cat.nominations.length > 0)
              .map(cat => {
                const winner  = cat.nominations.find(n => n.isWinner);
                const others  = cat.nominations.filter(n => !n.isWinner);
                // Gagnant en premier, puis les autres
                const ordered = [
                  ...(winner ? [winner] : []),
                  ...others,
                ];

                return (
                  <div key={cat.id}>
                    {/* Titre catégorie */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <Star size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <h2 style={{
                        fontFamily:    'var(--font-sans)',
                        fontWeight:    800,
                        fontSize:      '0.75rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color:         'var(--color-text)',
                      }}>
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          — {cat.description}
                        </span>
                      )}
                    </div>

                    {/* Films */}
                    <div>
                      {ordered.map(nom => (
                        <FilmCard key={nom.id} nomination={nom} />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
