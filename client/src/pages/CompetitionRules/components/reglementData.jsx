import React from "react";

/**
 * Données du règlement du concours
 */
export const REGLEMENT_TITLE = "Règlement du Concours – Festival MarsAI";

export const REGLEMENT = [
  {
    id: "article-1",
    title: "Article 1 — Objet du concours",
    tags: ["Général"],
    content: (
      <div className="space-y-3">
        <p>
          Le présent concours est organisé dans le cadre du Festival de Films MarsAI. Il a pour objectif de valoriser la
          créativité audiovisuelle intégrant l'usage d'outils d'intelligence artificielle.
        </p>
        <p>La participation au concours implique l'acceptation pleine et entière du présent règlement.</p>
      </div>
    ),
  },
  {
    id: "article-2",
    title: "Article 2 — Conditions de participation",
    tags: ["Participation"],
    content: (
      <div className="space-y-3">
        <p>
          Le concours est ouvert à toute personne physique ou morale, sans limite d'âge (les mineurs doivent obtenir
          l'autorisation d'un représentant légal).
        </p>
        <p>
          Chaque participant peut soumettre une ou plusieurs œuvres, sous réserve qu'elles respectent l'ensemble des
          règles définies dans ce règlement.
        </p>
      </div>
    ),
  },
  {
    id: "article-3",
    title: "Article 3 — Caractéristiques des films",
    tags: ["Création", "Durée", "Thème"],
    content: (
      <div className="space-y-3">
        <p>Les films soumis doivent respecter les critères suivants :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Durée recommandée : environ 60 secondes</li>
          <li>Œuvre originale créée directement par le réalisateur</li>
          <li>Le film doit obligatoirement intégrer l'usage d'une ou plusieurs intelligences artificielles</li>
          <li>Les films peuvent contenir des prises de vues réelles, en complément des éléments générés par IA</li>
          <li>Le film doit respecter la thématique de l'édition en cours du festival</li>
        </ul>
        <p>Toute œuvre ne respectant pas ces critères pourra être refusée sans justification.</p>
      </div>
    ),
  },
  {
    id: "article-4",
    title: "Article 4 — Originalité et droits d'auteur",
    tags: ["Droits"],
    content: (
      <div className="space-y-3">
        <p>Le participant certifie être l'auteur de l'œuvre soumise et garantit qu'elle est originale.</p>
        <p>
          Il s'engage à ne pas utiliser de contenus protégés par des droits d'auteur sans autorisation (musique, images,
          vidéos, voix, etc.).
        </p>
        <p>
          Le participant est seul responsable en cas de litige lié aux droits d'exploitation des éléments utilisés dans
          son film.
        </p>
      </div>
    ),
  },
  {
    id: "article-5",
    title: "Article 5 — Utilisation de l'intelligence artificielle",
    tags: ["IA", "Transparence"],
    content: (
      <div className="space-y-3">
        <p>Le participant doit obligatoirement :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mentionner les intelligences artificielles utilisées (génération d'image, vidéo, voix, montage, etc.)</li>
          <li>Garantir une utilisation éthique et légale des outils IA</li>
          <li>Ne pas soumettre une œuvre entièrement générée sans intervention créative du réalisateur</li>
        </ul>
      </div>
    ),
  },
  {
    id: "article-6",
    title: "Article 6 — Contenu autorisé",
    tags: ["Contenu", "Légal"],
    content: (
      <div className="space-y-3">
        <p>Les œuvres soumises doivent respecter la législation en vigueur et les règles de diffusion publique.</p>
        <p className="font-medium">Sont strictement interdits :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Les contenus offensants, discriminatoires, haineux ou violents</li>
          <li>Les contenus illicites ou contraires à l'ordre public</li>
          <li>Les contenus à caractère pornographique ou choquant</li>
          <li>Toute atteinte aux droits d'une tierce personne</li>
        </ul>
        <p>Toute œuvre jugée inappropriée par l'organisation sera automatiquement disqualifiée.</p>
      </div>
    ),
  },
  {
    id: "article-7",
    title: "Article 7 — Droits de diffusion",
    tags: ["Droits", "Diffusion"],
    content: (
      <div className="space-y-3">
        <p>
          En participant au festival, le réalisateur cède à titre non exclusif et temporaire les droits de diffusion de
          son film au festival, pour toute la durée de l'événement et sa promotion (site web, réseaux sociaux,
          projections publiques, supports de communication).
        </p>
        <p>Le réalisateur conserve l'intégralité des droits d'auteur sur son œuvre.</p>
      </div>
    ),
  },
  {
    id: "article-8",
    title: "Article 8 — Format technique des vidéos",
    tags: ["Technique"],
    content: (
      <div className="space-y-4">
        <p>
          Afin de garantir une diffusion optimale pendant le festival, les films soumis doivent respecter les
          spécifications techniques suivantes :
        </p>

        <div className="space-y-2">
          <p className="font-medium">8.1 Formats de fichiers acceptés</p>
          <p>Les vidéos doivent être envoyées dans l'un des formats suivants (types MIME acceptés) :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>video/mp4 (MP4)</li>
            <li>video/quicktime (MOV)</li>
            <li>video/x-msvideo (AVI)</li>
            <li>video/webm (WEBM)</li>
            <li>video/x-matroska (MKV)</li>
            <li>video/x-flv (FLV)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-medium">8.2 Extensions autorisées</p>
          <p>Les fichiers doivent posséder l'une des extensions suivantes :</p>
          <p className="text-sm text-white/80">.mp4, .mov, .avi, .webm, .mkv, .flv</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">8.3 Contraintes techniques obligatoires</p>
          <p>Les œuvres soumises doivent impérativement respecter les critères suivants :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Durée maximale : 60 secondes</li>
            <li>Taille maximale du fichier : 100 Mo</li>
            <li>Résolution minimale : 720p (1280 × 720)</li>
            <li>Vidéo finalisée (aucune version brouillon ou incomplète)</li>
            <li>Son synchronisé et exploitable (si audio présent)</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-medium">8.4 Codecs vidéo supportés</p>
          <p>Les codecs compatibles avec la plateforme du festival sont :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>H.264</li>
            <li>H.265 / HEVC</li>
            <li>VP8</li>
            <li>VP9</li>
            <li>AV1</li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-medium">8.5 Recommandations techniques (fortement conseillées)</p>
          <p>Pour une qualité de diffusion optimale, il est recommandé de :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exporter en MP4 (H.264)</li>
            <li>Utiliser une résolution en 1080p (1920 × 1080)</li>
            <li>Maintenir un ratio standard 16:9 ou 9:16</li>
            <li>Vérifier la lisibilité du fichier avant envoi</li>
          </ul>
        </div>

        <p className="text-sm text-white/80">
          Tout fichier ne respectant pas les contraintes techniques (format, durée, poids, résolution ou codec) pourra
          être refusé automatiquement par la plateforme de soumission et ne pas être pris en compte dans la sélection
          officielle.
        </p>

        <div className="pt-2 border-t border-white/10" />

        <div className="space-y-2">
          <p className="font-medium">8.6 Sous-titres (obligatoires)</p>
          <p>
            Afin de garantir l'accessibilité et la compréhension des œuvres par tous les publics et le jury, chaque film
            doit être accompagné d'un fichier de sous-titres séparé.
          </p>

          <p className="font-medium">Format du fichier de sous-titres</p>
          <p>Les formats acceptés sont :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>.srt (recommandé)</li>
            <li>.vtt</li>
          </ul>
          <p>Le fichier de sous-titres doit être fourni séparément du fichier vidéo (et non incrusté uniquement dans la vidéo).</p>

          <p className="font-medium">Règles de nommage</p>
          <p>Le fichier de sous-titres doit porter le même nom que la vidéo, par exemple :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>film.mp4</li>
            <li>film.srt</li>
          </ul>

          <p className="font-medium">Langue des sous-titres</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Les sous-titres doivent être fournis au minimum dans la langue originale du film</li>
            <li>
              Des sous-titres en français ou en anglais sont fortement recommandés pour la sélection et la diffusion
              publique
            </li>
          </ul>

          <p className="font-medium">Synchronisation et qualité</p>
          <p>Les sous-titres doivent :</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Être correctement synchronisés avec la vidéo</li>
            <li>Être lisibles et fidèles aux dialogues ou au contenu audio</li>
            <li>Inclure les éléments narratifs importants (voix off, dialogues, textes essentiels)</li>
          </ul>

          <p className="text-sm text-white/80">
            L'absence de fichier de sous-titres conforme pourra entraîner un refus technique du film ou sa non-sélection
            pour la diffusion officielle du festival.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "article-9",
    title: "Article 9 — Sélection et jury",
    tags: ["Jury", "Sélection"],
    content: (
      <div className="space-y-3">
        <p>La sélection officielle sera effectuée par le comité d'organisation du festival.</p>
        <p>Les œuvres seront évaluées selon plusieurs critères :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Créativité et originalité</li>
          <li>Qualité artistique</li>
          <li>Intégration pertinente de l'intelligence artificielle</li>
          <li>Respect du thème</li>
          <li>Impact narratif et visuel</li>
        </ul>
        <p>Les décisions du jury sont souveraines et sans appel.</p>
      </div>
    ),
  },
  {
    id: "article-10",
    title: "Article 10 — Calendrier",
    tags: ["Délais"],
    content: (
      <div className="space-y-3">
        <p>
          Les dates d'ouverture des inscriptions, de clôture et de diffusion des films sont communiquées sur le site
          officiel du festival.
        </p>
        <p>Il appartient au réalisateur de s'assurer que :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Le fichier vidéo est correctement téléversé</li>
          <li>Le fichier de sous-titres est fourni</li>
          <li>Toutes les informations demandées sont complètes</li>
          <li>La soumission est finalisée avant la date limite</li>
        </ul>
        <p>
          Toute soumission incomplète, non finalisée ou envoyée hors délai ne pourra pas être prise en compte dans la
          sélection officielle du festival.
        </p>
      </div>
    ),
  },
  {
    id: "article-11",
    title: "Article 11 — Responsabilité",
    tags: ["Responsabilité"],
    content: (
      <div className="space-y-3">
        <p>L'organisation du festival ne saurait être tenue responsable en cas :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>De problème technique lors de la soumission</li>
          <li>D'incompatibilité de format</li>
          <li>De litige entre participants et tiers concernant les droits d'exploitation</li>
        </ul>
      </div>
    ),
  },
  {
    id: "article-12",
    title: "Article 12 — Acceptation du règlement",
    tags: ["Règlement"],
    content: (
      <div className="space-y-3">
        <p>La soumission d'un film au concours vaut acceptation complète du présent règlement.</p>
        <p>
          L'organisation se réserve le droit de modifier le règlement si nécessaire, afin d'assurer le bon déroulement du
          festival.
        </p>
      </div>
    ),
  },
  {
    id: "article-13",
    title: "Article 13 — Demande de modifications exceptionnelles",
    tags: ["Modifications", "Sélection"],
    content: (
      <div className="space-y-3">
        <p>
          Dans le cas où un film suscite un fort intérêt de la part du jury ou du comité de sélection, mais ne respecte
          pas totalement le présent règlement (contraintes techniques, sous-titres, durée, format, mentions des IA, etc.),
          l'organisation du festival se réserve le droit de contacter le réalisateur par courrier électronique afin de
          demander des modifications.
        </p>

        <p className="font-medium">Les modifications demandées pourront notamment concerner :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Le respect de la durée maximale</li>
          <li>La conformité technique (format, résolution, codec, poids du fichier)</li>
          <li>L'ajout ou la correction des sous-titres</li>
          <li>La mention des intelligences artificielles utilisées</li>
          <li>La conformité au thème ou aux règles de contenu</li>
        </ul>

        <p>Le réalisateur disposera alors d'un délai communiqué par l'organisation pour effectuer les ajustements nécessaires.</p>

        <p>
          Une fois les modifications réalisées, le film devra être soumis à nouveau via la plateforme officielle du
          festival, en suivant exactement le même processus que lors de la première soumission.
        </p>

        <p>
          Aucune sélection définitive ne pourra être validée tant que la version modifiée et conforme n'aura pas été reçue
          et vérifiée par l'organisation.
        </p>

        <p>
          L'organisation se réserve le droit de refuser définitivement une œuvre en cas de non-respect des modifications
          demandées ou de non-réponse dans les délais impartis.
        </p>
      </div>
    ),
  },
];

/**
 * Utilitaire pour concaténer des classes CSS
 */
export function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}
