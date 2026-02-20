import React, { useState } from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Qu’est-ce que le Festival Mars AI ?",
      answer:
        "Le Festival Mars AI est un événement annuel dédié à l’intelligence artificielle et ses applications dans l’art, la musique, la robotique et la technologie. Il propose conférences, ateliers, expositions et performances interactives.",
    },
    {
      question: "Quand et où a lieu le festival ?",
      answer:
        "Le festival se déroule chaque année au mois de mars à Parc des Expositions de Marseille. Les dates exactes sont annoncées sur le site officiel du festival.",
    },
    {
      question: "Comment acheter des billets ?",
      answer:
        "Les billets sont disponibles en ligne via le site officiel. Différents pass existent : journée, week-end ou accès complet aux conférences et ateliers. Certaines activités sont gratuites mais nécessitent une réservation.",
    },
    {
      question: "Qui peut participer ?",
      answer:
        "Le festival est ouvert à tous : professionnels, étudiants, familles et passionnés de technologie. Certaines activités pour enfants ou ateliers spécifiques peuvent avoir des restrictions d’âge.",
    },
    {
      question: "Quels types d’activités sont proposés ?",
      answer:
        "Conférences et panels avec experts en IA, Ateliers interactifs (robotique, codage, création artistique AI), Expositions immersives et démonstrations technologiques, Performances musicales et artistiques générées par IA.",
    },
    {
      question: "Est-il possible de se restaurer sur place ?",
      answer:
        "Oui, des food trucks et stands de restauration sont disponibles tout au long du festival. Il y a aussi des zones pour pique-nique.",
    },
    {
      question: "Le festival est-il accessible aux personnes à mobilité réduite ?",
      answer:
        "Oui, toutes les zones principales du festival sont accessibles. Des services d’accompagnement peuvent être demandés à l’avance via le site officiel.",
    },
    {
      question: "Puis-je proposer une conférence ou un atelier ?",
      answer:
        "Oui ! Le festival accepte les propositions de conférenciers et animateurs. Les candidatures doivent être soumises avant la date limite indiquée sur le site.",
    },
    {
      question: "Comment rester informé des dernières actualités du festival ?",
      answer:
        "Abonnez-vous à la newsletter officielle ou suivez le festival sur les réseaux sociaux pour recevoir les annonces et mises à jour.",
    },
  ];

  return (
    <div className="faq bg-black text-white p-8 rounded-lg shadow-md font-serif flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 bg-black text-white p-4 rounded text-center italic">F.A.Q - Festival Mars AI</h1>
        <p className="text-center mb-8">
          Retrouvez ici les réponses aux questions les plus fréquentes concernant le Festival Mars AI. Si vous avez d’autres interrogations, n’hésitez pas à nous contacter via notre page de contact.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-700 rounded">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-center p-4 bg-gray-800 text-gray-300 font-bold hover:bg-gray-700"
              >
                {faq.question}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-900 text-gray-300">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;