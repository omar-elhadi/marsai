import React, { useState } from "react";

const Calendrier = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const events = [
    {
      title: "Conférence : L'IA dans l'art",
      details: "Intervenants : Dr. Jane Doe, Prof. John Smith\nHoraires : 10h00 - 12h00\nLieu : Salle Alpha",
    },
    {
      title: "Atelier : Robotique pour débutants",
      details: "Intervenants : Ing. Alice Martin\nHoraires : 14h00 - 16h00\nLieu : Salle Beta",
    },
    {
      title: "Projection : Film généré par IA",
      details: "Horaires : 18h00 - 20h00\nLieu : Auditorium",
    },
  ];

  return (
    <div className="calendar-page bg-black text-white p-8 rounded-lg shadow-md font-serif italic min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Calendrier du Festival MarsAI</h1>
      <p className="text-center mb-8 max-w-3xl">
        La page Calendrier du festival MarsAI présente l’ensemble des événements programmés tout au long du festival : conférences, ateliers, performances artistiques, projections et rencontres. Les visiteurs peuvent consulter les activités par date, heure ou lieu, avec des filtres pratiques pour personnaliser leur expérience. Chaque événement dispose d’une fiche détaillée (description, intervenants, horaires et emplacement) afin de faciliter l’organisation et permettre à chacun de planifier pleinement son parcours au cœur de MarsAI.
      </p>
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Événements à venir</h2>
        <div className="space-y-4 w-full">
          {events.map((event, index) => (
            <div key={index} className="border border-gray-700 rounded">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-center p-4 bg-gray-800 text-gray-300 font-bold hover:bg-gray-700"
              >
                {event.title}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-900 text-gray-300">
                  <pre className="whitespace-pre-wrap text-center">{event.details}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendrier;