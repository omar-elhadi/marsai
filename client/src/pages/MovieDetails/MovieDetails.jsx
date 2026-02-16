import React from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import DirectorInfo from '../../components/DirectorInfo/DirectorInfo';
import Synopsis from '../../components/Synopsis/Synopsis';

const MovieDetails = () => {
  // Données temporaires pour l'exemple
  const movieData = {
    youtubeId: 'dQw4w9WgXcQ',
    director: 'Nom du Réalisateur',
    aiTools: ['ChatGPT', 'Midjourney', 'Runway'],
    socialMedia: {
      twitter: 'https://twitter.com/username',
      instagram: 'https://instagram.com/username',
      linkedin: 'https://linkedin.com/in/username'
    },
    synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };

  return (
    <div className="flex h-screen gap-5 p-5 bg-gray-900">
      {/* Partie gauche - Lecteur vidéo */}
      <VideoPlayer youtubeId={movieData.youtubeId} />

      {/* Partie droite - Informations */}
      <div className="flex-1 flex flex-col gap-5">
        <DirectorInfo 
          director={movieData.director}
          aiTools={movieData.aiTools}
          socialMedia={movieData.socialMedia}
        />
        <Synopsis synopsis={movieData.synopsis} />
      </div>
    </div>
  );
};

export default MovieDetails;