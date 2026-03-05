import { useState, useRef } from 'react';
import gsap        from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CSS = `
  .faq-section {
    background:  var(--color-bg-pure);
    border-top:  1px solid var(--color-border);
    min-height:  100vh;
    padding:     clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,6rem);
    padding-top: clamp(4rem,6vw,5rem);
  }
  .faq-inner { max-width: 820px; margin: 0 auto; }

  /* ── Header ── */
  .faq-header { margin-bottom: clamp(4rem,8vw,7rem); }
  .faq-overline { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
  .faq-overline-bar { display: block; width: clamp(2rem,3vw,3rem); height: 1px; background: var(--color-accent); flex-shrink: 0; }
  .faq-titles { margin-bottom: 1.5rem; }
  .faq-title-line { overflow: hidden; line-height: 1; }
  .faq-title-line span { display: block; padding-bottom: 0.06em; }
  .faq-title-accent { color: var(--color-accent); }

  /* ── Liste de questions ── */
  .faq-list { display: flex; flex-direction: column; }

  /* ── Item ── */
  .faq-row { border-bottom: 1px solid var(--color-border); opacity: 0; }
  .faq-row.is-visible { opacity: 1; }

  .faq-btn {
    width: 100%; display: flex; align-items: center;
    justify-content: space-between;
    padding: 1.3rem 0; background: none; border: none;
    cursor: pointer; text-align: left; gap: 1rem;
  }
  .faq-btn-left { display: flex; align-items: baseline; gap: 1rem; }
  .faq-num {
    font-family: var(--font-display); font-style: italic;
    font-weight: 900; font-size: clamp(0.8rem,1.2vw,1rem);
    color: var(--color-accent); opacity: 0.45;
    line-height: 1; flex-shrink: 0;
  }
  .faq-question {
    font-family: var(--font-sans); font-weight: 500;
    font-size: clamp(0.95rem,1.4vw,1.05rem);
    color: var(--color-text-muted);
    transition: color 240ms var(--ease-out);
  }
  .faq-question.is-open { color: var(--color-text); }
  .faq-toggle {
    font-family: var(--font-sans); font-size: 1.2rem;
    font-weight: 300; color: var(--color-accent);
    flex-shrink: 0; opacity: 0.45;
    transition: opacity 240ms;
  }
  .faq-toggle.is-open { opacity: 1; }

  /* ── Body accordéon ── */
  .faq-body { height: 0; opacity: 0; overflow: hidden; }
  .faq-answer {
    padding-bottom: 1.6rem;
    padding-left:   2.2rem;
    font-family:    var(--font-sans);
    font-weight:    300;
    font-size:      clamp(0.85rem,1.1vw,0.95rem);
    line-height:    1.75;
    color:          var(--color-text-muted);
    border-left:    2px solid rgba(226,209,195,0.18);
    margin-left:    0.1rem;
  }
`;

const faqData = [
  {
    id:       'f1',
    question: "Comment puis-je soumettre mon film ?",
    answer:   "Les soumissions sont ouvertes via notre plateforme dédiée. Vous trouverez un lien « SOUMETTRE » dans le menu principal qui vous guidera tout au long du processus.",
  },
  {
    id:       'f2',
    question: "Quels sont les critères de sélection ?",
    answer:   "Nous recherchons des œuvres narratives qui explorent l'utilisation créative et éthique de l'IA générative dans leur processus de production.",
  },
  {
    id:       'f3',
    question: "Le festival est-il ouvert au public ?",
    answer:   "Certaines projections et conférences seront ouvertes au public sur billetterie. Les détails seront annoncés prochainement.",
  },
  {
    id:       'f4',
    question: "Quels formats de fichiers sont acceptés pour la soumission ?",
    answer:   "Nous acceptons les formats ProRes 4444, H.264 et H.265 en résolution minimale 1080p. Les fichiers doivent être déposés via notre interface de téléversement sécurisée, avec un poids maximum de 20 Go par œuvre.",
  },
  {
    id:       'f5',
    question: "Y a-t-il des frais d'inscription ?",
    answer:   "La soumission est gratuite pour les œuvres réalisées dans le cadre d'un projet étudiant ou associatif. Un frais de dossier de 30 € s'applique aux productions professionnelles et commerciales.",
  },
  {
    id:       'f6',
    question: "Quelle part d'IA est requise dans la production ?",
    answer:   "Il n'existe pas de seuil minimal fixé. Nous évaluons la cohérence artistique entre l'intention humaine et l'apport de l'IA — qu'il s'agisse de génération d'images, d'écriture de scénario, de composition musicale ou de montage assisté.",
  },
  {
    id:       'f7',
    question: "Les films étrangers sont-ils acceptés ?",
    answer:   "Oui, le festival est ouvert aux soumissions internationales. Les œuvres non francophones devront être sous-titrées en français ou en anglais. Une version sous-titrée dans les deux langues est fortement recommandée.",
  },
  {
    id:       'f8',
    question: "Comment se déroule la cérémonie de remise des prix ?",
    answer:   "La soirée de clôture se tient le 22 juin 2026 à la Grande Salle. Elle réunit le jury, les cinéastes sélectionnés et les partenaires du festival. Trois prix seront décernés : Meilleur Film IA, Prix de la Narration Hybride et Prix de l'Innovation Technique.",
  },
  {
    id:       'f9',
    question: "Comment contacter l'équipe du festival ?",
    answer:   "Vous pouvez nous joindre via le formulaire de contact disponible sur le site, ou directement à l'adresse contact@marsai-festival.fr. L'équipe s'engage à répondre sous 72 heures ouvrées.",
  },
];

function FaqRow({ item, index, isVisible, isOpen, onToggle }) {
  const rowRef  = useRef(null);
  const bodyRef = useRef(null);

  useGSAP(() => {
    if (!rowRef.current) return;
    gsap.to(rowRef.current, {
      opacity:  isVisible ? 1 : 0,
      x:        isVisible ? 0 : 18,
      duration: 0.45,
      ease:     'power2.out',
    });
  }, [isVisible]);

  useGSAP(() => {
    if (!bodyRef.current) return;
    if (isOpen) {
      gsap.to(bodyRef.current, { height: 'auto', opacity: 1, duration: 0.38, ease: 'power2.out' });
    } else {
      gsap.to(bodyRef.current, { height: 0,      opacity: 0, duration: 0.28, ease: 'power2.in'  });
    }
  }, [isOpen]);

  return (
    <div ref={rowRef} className="faq-row">
      <button onClick={onToggle} className="faq-btn">
        <div className="faq-btn-left">
          <span className="faq-num">{String(index + 1).padStart(2, '0')}</span>
          <span className={'faq-question' + (isOpen ? ' is-open' : '')}>{item.question}</span>
        </div>
        <span className={'faq-toggle' + (isOpen ? ' is-open' : '')}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div ref={bodyRef} className="faq-body">
        <p className="faq-answer">{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef  = useRef(null);
  const overlineRef = useRef(null);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);
  const subtitleRef = useRef(null);

  const [openId,       setOpenId]       = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useGSAP(() => {
    gsap.set(overlineRef.current,                  { opacity: 0, y: 12  });
    gsap.set([line1Ref.current, line2Ref.current], { yPercent: 110       });
    gsap.set(subtitleRef.current,                  { opacity: 0, y: 18  });

    ScrollTrigger.create({
      trigger: sectionRef.current, start: 'top 75%', once: true,
      onEnter() {
        const tl = gsap.timeline();
        tl.to(overlineRef.current,
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' });
        tl.to([line1Ref.current, line2Ref.current],
          { yPercent: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }, 0.15);
        tl.to(subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.50);

        // stagger items
        let current = 0;
        const id = setInterval(() => {
          current++;
          setVisibleCount(current);
          if (current >= faqData.length) clearInterval(id);
        }, 280);
      },
    });
  }, { scope: sectionRef });

  return (
    <>
      <style>{CSS}</style>

      <section ref={sectionRef} id="faq" className="faq-section">
        <div className="faq-inner">

          {/* ── Header ── */}
          <div className="faq-header">
            <div ref={overlineRef} className="faq-overline">
              <span className="faq-overline-bar" />
              <span className="label-overline">Protocol Assistance · Marsai 2026</span>
            </div>

            <div className="faq-titles">
              <div className="faq-title-line">
                <span ref={line1Ref} className="title-section">Questions</span>
              </div>
              <div className="faq-title-line">
                <span ref={line2Ref} className="title-section faq-title-accent">fréquentes</span>
              </div>
            </div>

            <p ref={subtitleRef} className="body-editorial">
              Retrouvez ici les réponses aux interrogations les plus courantes
              sur le processus de soumission, les critères de sélection et l'accès au festival.
            </p>
          </div>

          {/* ── Accordéon ── */}
          <div className="faq-list">
            {faqData.map((item, i) => (
              <FaqRow
                key={item.id}
                item={item}
                index={i}
                isVisible={visibleCount > i}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}