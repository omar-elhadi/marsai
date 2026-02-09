import Header from '../../components/layouts/Header.jsx';
import Footer from '../../components/layouts/Footer.jsx';
function Home() {
  return (
    <>
      {/* HERO */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-black to-gray-900 text-white px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-wide">
          MARSAI
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          L'apogée du cinéma génératif
        </p>
      </div>

      {/* DESCRIPTION */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Description de l'événement
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Festival dédié à la créativité et à l'innovation réunissant participants,
          jury et partenaires.
        </p>
      </section>

      {/* JURY */}
      <section id="jury" className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Le Jury</h2>
          <ul className="space-y-3">
            <li>
              <strong>Jury 1 :</strong> Alice Dupont - Experte en innovation
            </li>
            <li>
              <strong>Jury 2 :</strong> Marc Leroy - Designer et entrepreneur
            </li>
            <li>
              <strong>Jury 3 :</strong> Sophie Martin - Responsable R&D
            </li>
          </ul>
        </div>
      </section>

      {/* LIEU */}
      <section id="lieu" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Lieu de l'événement</h2>
        <p className="text-gray-700 mb-6">
          Le festival se tiendra au <strong>Palais des Congrès de Paris</strong>,
          situé au cœur de la ville avec un accès facile en transports en commun.
          Parking disponible sur place.
        </p>

        <div className="rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Plan du lieu"
            src="https://www.google.com/maps?q=Palais%20des%20Congres%20Paris&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* RÈGLES */}
      <section id="regles" className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Règles de l'événement</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Tous les participants doivent respecter le règlement.</li>
            <li>La participation peut se faire individuellement ou en équipe.</li>
            <li>Les décisions du jury sont finales et sans appel.</li>
            <li>Tout comportement contraire à l'éthique entraînera disqualification.</li>
          </ol>
        </div>
      </section>

      {/* RÉCOMPENSES */}
      <section id="recompenses" className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Récompenses des Participants
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Trophées pour les 3 premiers</li>
          <li>Prix en espèces et bons cadeaux</li>
          <li>Opportunités de networking avec les partenaires</li>
          <li>Certificat de participation pour tous</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">Envie de participer ?</h2>
        <a href="#inscription">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            S’inscrire
          </button>
        </a>
      </section>

      {/* AGENDA */}
      <section id="agenda" className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Agenda du Festival</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Jour 1 :</strong> Ouverture et accueil des participants</li>
          <li><strong>Jour 2 :</strong> Compétitions et ateliers</li>
          <li><strong>Jour 3 :</strong> Remise des prix et clôture</li>
        </ul>
      </section>

      {/* PARTENAIRES */}
      <section id="partenaires" className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Nos Partenaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <img src="https://via.placeholder.com/150x80?text=Partenaire+1" alt="Partenaire 1" />
            <img src="https://via.placeholder.com/150x80?text=Partenaire+2" alt="Partenaire 2" />
            <img src="https://via.placeholder.com/150x80?text=Partenaire+3" alt="Partenaire 3" />
            <img src="https://via.placeholder.com/150x80?text=Partenaire+4" alt="Partenaire 4" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
