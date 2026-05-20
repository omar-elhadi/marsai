import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CSS = `
  .faq-section {
    background: #000;
    min-height: 100vh;
    padding: clamp(6rem,12vw,10rem) clamp(1.5rem,5vw,6rem);
    padding-top: clamp(4rem,6vw,5rem);
    color: #fff;
  }
  .faq-inner { max-width: 820px; margin: 0 auto; }
  .faq-header { margin-bottom: clamp(4rem,8vw,7rem); }
  .faq-overline { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
  .faq-overline-bar { display: block; width: clamp(2rem,3vw,3rem); height: 1px; background: #decba4; flex-shrink: 0; }
  .faq-titles { margin-bottom: 1.5rem; }
  .faq-title-line { overflow: hidden; line-height: 1.1; }
  .faq-title-line span { display: block; padding-bottom: 0.06em; text-transform: uppercase; font-weight: 900; font-size: clamp(2.5rem, 5vw, 4rem); }
  .faq-title-accent { color: #decba4; font-family: serif; font-weight: 300 !important; letter-spacing: 0.1em; }

  .faq-timeline { position: relative; padding-left: clamp(2.5rem,4vw,3.5rem); }
  .faq-track { position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.1); }
  .faq-progress-wrap { position: absolute; left: 1.5rem; top: 0; width: 1px; height: 100%; overflow: hidden; }
  .faq-progress { width: 1px; height: 0%; background: linear-gradient(to bottom, #decba4 0%, rgba(222,203,164,0.4) 65%, transparent 100%); }
  .faq-dot { position: absolute; left: calc(1.5rem - 6px); top: -6px; width: 13px; height: 13px; border-radius: 50%; background: #decba4; box-shadow: 0 0 15px #decba4; z-index: 4; }

  .faq-row { opacity: 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 2rem 0; background: none; border: none; cursor: pointer; text-align: left; gap: 1.5rem; }
  .faq-num { font-family: serif; italic; font-size: 0.9rem; color: #decba4; opacity: 0.5; flex-shrink: 0; }
  .faq-question { font-size: clamp(1.1rem, 1.8vw, 1.4rem); color: #ececec; transition: color 0.3s; font-weight: 300; }
  .faq-question.is-open { color: #decba4; }
  .faq-toggle { color: #decba4; font-size: 1.5rem; transition: transform 0.4s; font-weight: 200; }
  .faq-toggle.is-open { transform: rotate(45deg); }
  
  .faq-body { height: 0; opacity: 0; overflow: hidden; }
  .faq-content { padding-bottom: 2.5rem; padding-left: 2.5rem; max-width: 650px; }
  .faq-text { font-size: 1rem; color: #a0a0a0; line-height: 1.8; font-family: sans-serif; font-weight: 300; }
`;

const QUESTIONS = [
  {
    id: "q1",
    title: "Qu’est-ce que le Festival Mars AI ?",
    content:
      "Le Festival Mars AI est un événement annuel dédié à l’intelligence artificielle et ses applications dans l’art, la musique, la robotique et la technologie.",
  },
  {
    id: "q2",
    title: "Quand et où a lieu le festival ?",
    content:
      "Le festival se déroule chaque année au mois de mars au Parc des Expositions de Marseille. Les dates exactes sont annoncées sur le site officiel.",
  },
  {
    id: "q3",
    title: "Comment acheter des billets ?",
    content:
      "Les billets sont disponibles en ligne via notre billetterie sécurisée. Différents pass (journée, week-end, full access) sont proposés.",
  },
  {
    id: "q4",
    title: "Qui peut participer ?",
    content:
      "L'événement est ouvert à tous : professionnels, étudiants, familles et curieux. Certaines zones sont spécifiquement adaptées au jeune public.",
  },
  {
    id: "q5",
    title: "Types d’activités proposés ?",
    content:
      "Conférences d'experts, ateliers de code/IA, expositions d'art génératif et performances live de robots musiciens.",
  },
  {
    id: "q6",
    title: "Restauration sur place ?",
    content:
      "Un espace 'Food & Tech' avec des food trucks locaux et des options végétariennes est disponible durant toute la durée de l'événement.",
  },
  {
    id: "q7",
    title: "Accessibilité PMR ?",
    content:
      "Le site est entièrement accessible aux personnes à mobilité réduite. Des fauteuils sont disponibles sur demande à l'accueil.",
  },
];

interface Question {
  id: string;
  title: string;
  content: string;
}

interface FAQItemProps {
  item: Question;
  index: number;
  isVisible: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ item, index, isVisible, isOpen, onToggle }: FAQItemProps) {
  const rowRef = useRef(null);
  const bodyRef = useRef(null);

  useGSAP(() => {
    if (isVisible) {
      gsap.to(rowRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: index * 0.1,
      });
    }
  }, [isVisible]);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(bodyRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(bodyRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={rowRef}
      className="faq-row"
      style={{ transform: "translateX(20px)" }}
    >
      <button onClick={onToggle} className="faq-btn">
        <div className="flex items-baseline gap-4">
          <span className="faq-num">{String(index + 1).padStart(2, "0")}</span>
          <span className={`faq-question ${isOpen ? "is-open" : ""}`}>
            {item.title}
          </span>
        </div>
        <span className={`faq-toggle ${isOpen ? "is-open" : ""}`}>
          {isOpen ? "✕" : "＋"}
        </span>
      </button>
      <div ref={bodyRef} className="faq-body">
        <div className="faq-content">
          <p className="faq-text italic">{item.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const timelineRef = useRef(null);
  const progressRef = useRef(null);
  const dotRef = useRef(null);

  const [openId, setOpenId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(
    () => {
      // Animation du Header (Titre)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => setIsVisible(true),
      });

      // Animation de la barre de progression au scroll
      gsap.to(progressRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        },
      });

      gsap.to(dotRef.current, {
        top: "calc(100% - 6px)",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <>
      <style>{CSS}</style>
      <section ref={sectionRef} className="faq-section">
        <div className="faq-inner">
          <header className="faq-header">
            <div className="faq-overline">
              <span className="faq-overline-bar" />
              <span className="text-[#decba4] text-xs tracking-[0.3em] uppercase">
                Assistance & Infos
              </span>
            </div>
            <div className="faq-titles">
              <div className="faq-title-line">
                <span>Questions</span>
              </div>
              <div className="faq-title-line">
                <span className="faq-title-accent">Fréquentes</span>
              </div>
            </div>
          </header>

          <div ref={timelineRef} className="faq-timeline">
            <div className="faq-track" />
            <div className="faq-progress-wrap">
              <div ref={progressRef} className="faq-progress" />
            </div>
            <div ref={dotRef} className="faq-dot" />

            <div className="faq-list">
              {QUESTIONS.map((item, index) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  index={index}
                  isVisible={isVisible}
                  isOpen={openId === item.id}
                  onToggle={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
