const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
      <div className="relative overflow-hidden">
        <img 
          src={movie.imageUrl} 
          alt={movie.title}
          className="w-full h-[160px] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3 text-center">
        <h3 className="text-sm font-bold text-gray-900 mb-1">{movie.title}</h3>
        <p className="text-xs text-gray-600">{movie.director}</p>
      </div>
    </div>
  );
};

export default MovieCard;
