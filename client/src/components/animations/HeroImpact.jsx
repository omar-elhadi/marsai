import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const VIDEO_MACHINE = "https://cdn.pixabay.com/video/2020/05/25/40141-424856417_large.mp4"; 
const VIDEO_ORGANIC = "https://cdn.pixabay.com/video/2021/08/11/84687-586735160_large.mp4"; 

const SHARDS = [
  { id: "tl", text: "M4RS41", x: "-55vw", y: "-55vh", color: "#FF003C" },
  { id: "t",  text: "SYST3M", x: "0vw",   y: "-60vh", color: "#00FF66" },
  { id: "tr", text: "011011", x: "55vw",  y: "-55vh", color: "#00E5FF" },
  { id: "r",  text: "F4T4L_", x: "60vw",  y: "0vh",   color: "#FFB300" },
  { id: "br", text: "ERROR_", x: "55vw",  y: "55vh",  color: "#FF003C" },
  { id: "b",  text: "C0R3",   x: "0vw",   y: "60vh",  color: "#00FF66" },
  { id: "bl", text: "D4T4",   x: "-55vw", y: "55vh",  color: "#00E5FF" },
  { id: "l",  text: "N3TW0RK",x: "-60vw", y: "0vh",   color: "#FFB300" },
];

const VideoTextMask = ({ text, videoSrc, innerClass }) => (
  <div className="relative w-full h-full mix-blend-screen">
    <video 
      src={videoSrc} 
      autoPlay muted loop playsInline 
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black mix-blend-multiply flex items-center justify-center">
      <h2 className={`text-[8vw] md:text-[5vw] font-black uppercase tracking-tighter leading-none whitespace-nowrap ${innerClass}`}>
        {text}
      </h2>
    </div>
  </div>
);

// CORRECTION 1 : Augmentation significative de la taille des particules
const ImpactParticles = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
    {Array.from({ length: 150 }).map((_, i) => (
      <div
        key={i}
        // Ombres portées plus larges pour accentuer l'effet de halo
        className={`impact-particle absolute rounded-full mix-blend-screen ${i % 3 === 0 ? 'bg-amber-300 shadow-[0_0_12px_#f59e0b]' : 'bg-white shadow-[0_0_15px_#ffffff]'}`}
        style={{
          // Passage de 2-6px à 4-10px de diamètre
          width: Math.random() * 6 + 4 + 'px', 
          height: Math.random() * 6 + 4 + 'px',
          opacity: 0,
        }}
      />
    ))}
  </div>
);

export default function HeroImpact() {
  const containerRef = useRef(null);
  const centralTextRef = useRef(null);
  const shockwaveRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    gsap.set(containerRef.current, { visibility: "visible" });
    const tl = gsap.timeline({ delay: 0.2 }); 
    const particles = gsap.utils.toArray('.impact-particle');

    // 1. Placement
    SHARDS.forEach((shard) => {
      gsap.set(`.shard-${shard.id}`, { 
        x: shard.x, y: shard.y, scale: 0.3, opacity: 0, rotation: Math.random() * 30 - 15 
      });
      gsap.set(`.shard-text-${shard.id}`, { color: shard.color });
    });

    // 2. Convergence
    tl.addLabel("converge")
      .to('.shard-container', {
        x: "0vw", y: "0vh", rotation: 0, scale: 1, opacity: 1, duration: 2.2, ease: "power3.in",
      }, "converge");

    // 3. Surchauffe
    tl.to('.shard-text', { color: "#FFFFFF", duration: 1.0, ease: "power2.in" }, "converge+=1.2");

    // 4. L'IMPACT
    tl.addLabel("impact");

    tl.fromTo(shockwaveRef.current, 
      { opacity: 1, scale: 0.1 }, 
      { opacity: 0, scale: 6, duration: 0.7, ease: "expo.out" }, "impact"
    );

    tl.fromTo(centralTextRef.current,
      { scale: 2, opacity: 0, filter: "blur(20px)" },
      { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "back.out(1.2)" }, "impact"
    );

    tl.fromTo(containerRef.current,
      { x: -20 }, { x: 0, duration: 0.2, yoyo: true, repeat: 5 }, "impact" 
    );

    // 5. DISSIPATION DES FANTÔMES (Inchangé, c'était déjà parfait)
    SHARDS.forEach((shard) => {
      tl.fromTo(`.shard-${shard.id}`, 
        { scale: 1, opacity: 1, filter: "blur(0px)" }, 
        {
          x: `+=${Math.random() > 0.5 ? 40 : -40}vw`, 
          y: `+=${Math.random() > 0.5 ? 40 : -40}vh`, 
          scale: 2, 
          rotation: Math.random() * 90 - 45, 
          opacity: 0, 
          filter: "blur(30px)", 
          duration: 1.8,
          ease: "power4.out"
        }, "impact" 
      );
    });

    // CORRECTION 2 : Adoucissement drastique de l'explosion des particules
    particles.forEach((p) => {
      const angle = Math.random() * Math.PI * 2; 
      // Distance légèrement réduite pour que les particules restent plus longtemps à l'écran
      const radius = window.innerWidth * (Math.random() * 0.6 + 0.3); 
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;

      tl.fromTo(p, 
        // Départ un peu plus gros pour un impact visuel fort
        { x: 0, y: 0, opacity: 1, scale: 2 }, 
        {
          x: targetX,
          y: targetY,
          opacity: 0,
          // Ne rétrécit plus jusqu'à 0, reste visible plus longtemps comme des braises
          scale: 0.5, 
          // Durée doublée : de 1.5-3.5s à 3-6s. C'est la clé de la douceur.
          duration: Math.random() * 3 + 3, 
          // Courbe beaucoup plus douce, quasi linéaire sur la fin
          ease: "power2.out", 
        },
        "impact"
      );
    });

    // 7. Signature
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "impact+=0.5"
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center invisible">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {SHARDS.map((shard) => (
          <div key={shard.id} className={`shard-container shard-${shard.id} absolute w-[60vw] md:w-[40vw] h-[20vh] md:h-[30vh]`}>
            <VideoTextMask text={shard.text} videoSrc={VIDEO_MACHINE} innerClass={`shard-text shard-text-${shard.id}`} />
          </div>
        ))}
      </div>
      <div ref={shockwaveRef} className="absolute inset-0 bg-white mix-blend-screen opacity-0 pointer-events-none z-20 rounded-full"></div>
      <div ref={centralTextRef} className="relative z-30 w-full max-w-7xl h-[30vh] flex items-center justify-center opacity-0">
        <VideoTextMask text="MARSAI" videoSrc={VIDEO_ORGANIC} innerClass="text-white" />
      </div>
      <ImpactParticles />
    </div>
  );
}