import CategoryHeader from "./CategoryHeader";
import EventCard from "./EventCard";

const CategorySection = ({ category, startIndex, visibleCount }) => {
  const catOn = visibleCount >= startIndex + 1;

  return (
    <div className="space-y-6">
      <div className="relative">
        <span className="absolute left-6 top-10 -translate-x-1/2">
          <span
            className={[
              "block h-5 w-5 rounded-full",
              catOn
                ? "bg-indigo-200 shadow-[0_0_28px_rgba(99,102,241,0.95)]"
                : "bg-white/20 shadow-none",
            ].join(" ")}
          />
          {catOn ? (
            <span className="absolute inset-0 rounded-full bg-indigo-400/30 blur-lg" />
          ) : null}
        </span>

        <span className="pointer-events-none absolute left-6 top-10 h-px w-8 bg-gradient-to-r from-indigo-300/50 to-transparent" />

        <CategoryHeader
          title={category.title}
          subtitle={category.subtitle}
          image={category.image}
        />
      </div>

      <ul className="relative space-y-4">
        {category.items.map((event, index) => {
          const globalIndex = startIndex + index;
          const isVisible = globalIndex < visibleCount;

          return <EventCard key={event.id} event={event} isVisible={isVisible} />;
        })}
      </ul>
    </div>
  );
};

export default CategorySection;
