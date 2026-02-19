const CategoryHeader = ({ title, subtitle, image }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <img
        src={image}
        alt={title}
        className="h-64 w-full object-cover md:h-80"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-3xl font-bold text-white tracking-wider">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-white/70 text-sm md:text-base">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryHeader;
