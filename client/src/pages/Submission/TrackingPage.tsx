/**
 * TrackingPage.jsx — MARSAI Festival
 * Page publique de suivi d'un film pour le réalisateur.
 *
 * Layout 2 colonnes :
 *  Gauche — statut courant + timeline parcours de sélection
 *  Droite — informations du film (champs formulaire) + message TO_MODIFY
 */

import { useState, useEffect }  from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, Loader2,
  Film, XCircle, Star, Trophy, Eye,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  SUBMITTED: {
    label:       'Soumission reçue',
    description: 'Votre film est enregistré et sera examiné prochainement.',
    icon:        Film,
    color:       '#6b7280',
    bg:          'rgba(107,114,128,0.08)',
    border:      'rgba(107,114,128,0.25)',
  },
  IN_REVIEW: {
    label:       'En cours d\'évaluation',
    description: 'Votre film est examiné par les membres du jury MARSAI.',
    icon:        Eye,
    color:       '#3b82f6',
    bg:          'rgba(59,130,246,0.08)',
    border:      'rgba(59,130,246,0.25)',
  },
  TO_MODIFY: {
    label:       'Modifications demandées',
    description: 'Un email contenant le lien de modification vous a été envoyé.',
    icon:        AlertTriangle,
    color:       '#f97316',
    bg:          'rgba(249,115,22,0.08)',
    border:      'rgba(249,115,22,0.3)',
  },
  APPROVED: {
    label:       'Film approuvé',
    description: 'Félicitations ! Votre film a été approuvé par l\'équipe MARSAI.',
    icon:        CheckCircle,
    color:       '#22c55e',
    bg:          'rgba(34,197,94,0.08)',
    border:      'rgba(34,197,94,0.25)',
  },
  SELECTION: {
    label:       'Sélection officielle',
    description: 'Votre film fait partie de la sélection officielle MARSAI 2026.',
    icon:        Star,
    color:       '#a855f7',
    bg:          'rgba(168,85,247,0.08)',
    border:      'rgba(168,85,247,0.25)',
  },
  FINALIST: {
    label:       'Finaliste',
    description: 'Votre film est finaliste ! Résultats lors de la cérémonie.',
    icon:        Star,
    color:       '#eab308',
    bg:          'rgba(234,179,8,0.08)',
    border:      'rgba(234,179,8,0.3)',
  },
  AWARD: {
    label:       'Primé',
    description: 'Votre film a remporté un prix au festival MARSAI 2026 !',
    icon:        Trophy,
    color:       '#f59e0b',
    bg:          'rgba(245,158,11,0.1)',
    border:      'rgba(245,158,11,0.4)',
  },
  REJECTED: {
    label:       'Non retenu',
    description: 'Votre film n\'a pas été retenu cette année. Merci pour votre participation.',
    icon:        XCircle,
    color:       '#ef4444',
    bg:          'rgba(239,68,68,0.06)',
    border:      'rgba(239,68,68,0.2)',
  },
};

const TIMELINE_STEPS = ['SUBMITTED', 'IN_REVIEW', 'APPROVED', 'SELECTION', 'FINALIST', 'AWARD'];

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Composant Timeline ──────────────────────────────────────────────────────

function Timeline({ filmStatus }) {
  const isToModify         = filmStatus === 'TO_MODIFY';
  const isTerminalRejected = filmStatus === 'REJECTED';
  const effectiveStep      = isToModify
    ? TIMELINE_STEPS.indexOf('IN_REVIEW')
    : TIMELINE_STEPS.indexOf(filmStatus);

  if (isTerminalRejected) {
    return (
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        Nous espérons vous retrouver lors des prochaines éditions du festival.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {TIMELINE_STEPS.map((step, index) => {
        const stepConfig = STATUS_CONFIG[step];
        const isDone     = index < effectiveStep;
        const isCurrent  = index === effectiveStep;
        const isFuture   = index > effectiveStep;

        const dotColor = isDone ? '#22c55e' : isCurrent ? stepConfig.color : 'var(--color-border)';

        return (
          <div key={step} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            {/* Indicateur vertical */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18px', flexShrink: 0 }}>
              <div style={{
                width:          '18px',
                height:         '18px',
                borderRadius:   '50%',
                border:         `2px solid ${dotColor}`,
                background:     isDone ? '#22c55e' : isCurrent ? stepConfig.color : 'transparent',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
              }}>
                {isDone    && <CheckCircle size={10} style={{ color: '#fff' }} />}
                {isCurrent && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
              </div>
              {index < TIMELINE_STEPS.length - 1 && (
                <div style={{
                  width:      '2px',
                  height:     '2rem',
                  background: isDone ? '#22c55e' : 'var(--color-border)',
                  margin:     '2px 0',
                }} />
              )}
            </div>

            {/* Label étape */}
            <div style={{ paddingBottom: index < TIMELINE_STEPS.length - 1 ? '0.25rem' : 0 }}>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: isCurrent ? 700 : 400,
                fontSize:   '0.875rem',
                color:      isFuture ? 'var(--color-text-muted)' : 'var(--color-text)',
                opacity:    isFuture ? 0.4 : 1,
                lineHeight: 1.3,
              }}>
                {isToModify && step === 'IN_REVIEW' ? 'Modifications demandées' : stepConfig.label}
              </p>
              {isCurrent && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: stepConfig.color, marginTop: '0.15rem' }}>
                  Étape en cours
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Composant InfoRow ───────────────────────────────────────────────────────

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{
        fontFamily:    'var(--font-sans)',
        fontWeight:    800,
        fontSize:      '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color:         'var(--color-text-muted)',
      }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
        {value}
      </span>
    </div>
  );
}

// ── Page principale ─────────────────────────────────────────────────────────

export default function TrackingPage() {
  const [searchParams]          = useSearchParams();
  const token                   = searchParams.get('token');
  const [status, setStatus]     = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [film, setFilm]         = useState(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg('Aucun token de suivi fourni. Vérifiez le lien reçu par email.');
      setStatus('error');
      return;
    }
    const load = async () => {
      try {
        const res  = await fetch(`${API}/films/track/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Film introuvable.');
        setFilm(data);
        setStatus('ready');
      } catch (err) {
        setErrorMsg(err.message);
        setStatus('error');
      }
    };
    load();
  }, [token]);

  // ── Chargement ──────────────────────────────────────────────────────────

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-pure)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Loader2 size={20} className="animate-spin" />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>Chargement du suivi…</span>
        </div>
      </div>
    );
  }

  // ── Erreur ──────────────────────────────────────────────────────────────

  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-bg-pure)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <AlertTriangle size={40} style={{ color: 'var(--color-accent)', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
            Film introuvable
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            {errorMsg}
          </p>
          <Link to="/soumettre" style={{ display: 'inline-block', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-bg-pure)', background: 'var(--color-text)', padding: '0.75rem 2rem', borderRadius: '2px', textDecoration: 'none' }}>
            Soumettre un film
          </Link>
        </div>
      </div>
    );
  }

  // ── Succès ──────────────────────────────────────────────────────────────

  const filmStatus = film.status;
  const config     = STATUS_CONFIG[filmStatus] ?? STATUS_CONFIG.SUBMITTED;
  const StatusIcon = config.icon;
  const isToModify = filmStatus === 'TO_MODIFY';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-pure)', paddingTop: 'clamp(6rem,10vw,8rem)' }}>

      {/* ── Hero pleine largeur ── */}
      <section style={{
        padding:      'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,6rem)',
        borderBottom: '1px solid var(--color-border)',
        maxWidth:     '1100px',
        margin:       '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ display: 'block', width: 'clamp(2rem,3vw,3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Suivi de candidature</span>
        </div>
        <h1 style={{
          fontFamily:    'var(--font-display)',
          fontWeight:    900,
          fontSize:      'clamp(2rem,5vw,4rem)',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color:         'var(--color-text)',
          lineHeight:    1,
          marginBottom:  '0.5rem',
        }}>
          {film.title}
        </h1>
        <p className="body-meta">
          {film.submitter?.firstName} {film.submitter?.lastName}
          {film.country && <> &mdash; {film.country}</>}
        </p>
      </section>

      {/* ── Corps 2 colonnes ── */}
      <section style={{
        padding:   'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,6rem)',
        maxWidth:  '1100px',
        margin:    '0 auto',
        display:   'flex',
        flexWrap:  'wrap',
        gap:       'clamp(2rem,4vw,4rem)',
        alignItems: 'flex-start',
      }}>

        {/* ── Colonne gauche : statut + timeline ── */}
        <div style={{ flex: '1', minWidth: '260px', maxWidth: '360px' }}>

          {/* Bandeau statut */}
          <div style={{
            background:   config.bg,
            border:       `1px solid ${config.border}`,
            borderRadius: '4px',
            padding:      '1.25rem 1.5rem',
            marginBottom: '2rem',
            display:      'flex',
            gap:          '0.875rem',
            alignItems:   'flex-start',
          }}>
            <StatusIcon size={18} style={{ color: config.color, flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: config.color, marginBottom: '0.3rem' }}>
                {config.label}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {config.description}
              </p>
            </div>
          </div>

          {/* Titre section timeline */}
          <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Parcours de sélection
          </p>

          <Timeline filmStatus={filmStatus} />
        </div>

        {/* ── Colonne droite : infos film + modifications ── */}
        <div style={{ flex: '2', minWidth: '300px' }}>

          {/* Infos film */}
          <div style={{
            border:       '1px solid var(--color-border)',
            borderRadius: '4px',
            padding:      'clamp(1.5rem,3vw,2rem)',
            marginBottom: isToModify && film.modificationRequest ? '1.5rem' : 0,
            display:      'flex',
            flexDirection: 'column',
            gap:          '1.25rem',
          }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              Informations du film
            </p>

            <InfoRow label="Réalisateur" value={[film.submitter?.firstName, film.submitter?.lastName].filter(Boolean).join(' ')} />
            <InfoRow label="Pays"        value={film.country} />
            <InfoRow label="Langue"      value={film.language} />
            <InfoRow label="Soumis le"   value={formatDate(film.submittedAt)} />
            <InfoRow label="Outils IA"   value={film.aiToolsUsed} />

            {film.description && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Description
                </span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {film.description}
                </p>
              </div>
            )}

            {film.youtubeUrl && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Lien YouTube
                </span>
                <a
                  href={film.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-text)', wordBreak: 'break-all' }}
                >
                  {film.youtubeUrl}
                </a>
              </div>
            )}
          </div>

          {/* Message TO_MODIFY */}
          {isToModify && film.modificationRequest && (
            <div style={{
              background:   'rgba(249,115,22,0.05)',
              border:       '1px solid rgba(249,115,22,0.2)',
              borderRadius: '4px',
              padding:      'clamp(1.2rem,2.5vw,1.8rem)',
            }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f97316', marginBottom: '0.75rem' }}>
                Message de l'équipe MARSAI
                {film.modificationRequestedAt && (
                  <span style={{ fontWeight: 400, marginLeft: '0.75rem', opacity: 0.7 }}>
                    {formatDate(film.modificationRequestedAt)}
                  </span>
                )}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'rgba(249,115,22,0.85)', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                {film.modificationRequest}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-muted)', paddingTop: '1rem', borderTop: '1px solid rgba(249,115,22,0.15)', lineHeight: 1.5 }}>
                Un email contenant le lien de modification vous a été envoyé. Vérifiez votre boîte de réception.
              </p>
            </div>
          )}

          {/* Pied de page */}
          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Pour toute question, contactez-nous à{' '}
              <a href="mailto:festival@marsai.fr" style={{ color: 'var(--color-text)', textDecoration: 'underline' }}>
                festival@marsai.fr
              </a>
            </p>
            <Link to="/" style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              ← Retour au site
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
