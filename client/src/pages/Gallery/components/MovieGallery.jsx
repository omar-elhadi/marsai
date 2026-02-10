import { useState } from 'react';
import MovieCard from './MovieCard';
import { movies } from '../../../data/movies';

const MovieGallery = () => {
  const [visibleCount, setVisibleCount] = useState(9);
  const moviesPerPage = 9;

  const displayedMovies = movies.slice(0, visibleCount);
  const hasMore = visibleCount < movies.length;
  const canShowLess = visibleCount > moviesPerPage;

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + moviesPerPage, movies.length));
  };

  const showLess = () => {
    setVisibleCount(moviesPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Titre */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
        Galerie de Films
      </h1>
      
      {/* Grille de films */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[3px] gap-y-6 mb-12">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Boutons Afficher Plus / Moins */}
      <div className="flex justify-center items-center gap-4 mt-12">
        {canShowLess && (
          <button
            onClick={showLess}
            className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-200 hover:border-gray-400 transition-all duration-300 hover:-translate-y-0.5"
          >
            ↑ Afficher moins
          </button>
        )}
        
        {hasMore && (
          <button
            onClick={showMore}
            className="px-6 py-3 bg-indigo-600 text-white border border-indigo-600 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
          >
            ↓ Afficher plus
          </button>
        )}
      </div>

      {/* Compteur */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Affichage de {displayedMovies.length} sur {movies.length} films
      </p>
    </div>
  );
};

export default MovieGallery;
