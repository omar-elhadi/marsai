const EventCard = ({ event, isVisible }) => {
  return (
    <li
      className={[
        "relative",
        "transition-all duration-500 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      ].join(" ")}
    >
      <span className="absolute left-6 top-7 -translate-x-1/2">
        <span
          className={[
            "block h-3 w-3 rounded-full",
            isVisible
              ? "bg-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.85)]"
              : "bg-white/20 shadow-none",
          ].join(" ")}
        />
        {isVisible ? (
          <span className="absolute inset-0 rounded-full bg-cyan-400/25 blur-md" />
        ) : null}
      </span>

      <span className="pointer-events-none absolute left-6 top-7 h-px w-8 bg-gradient-to-r from-cyan-200/40 to-transparent" />

      <div className="ml-14">
        <div
          className={[
            "group relative overflow-hidden rounded-2xl p-5",
            "border border-white/10 bg-white/5 backdrop-blur-xl",
            "shadow-[0_0_30px_rgba(0,0,0,0.6)]",
            "transition-all duration-500 ease-out",
            "hover:-translate-y-1 hover:border-indigo-400/40",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -inset-32 bg-gradient-to-r from-indigo-500/20 via-cyan-400/20 to-purple-500/20 blur-3xl" />
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-indigo-400/30 transition" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-white tracking-wide">
                {event.title}
              </h4>
              {event.place ? (
                <p className="mt-1 text-sm text-white/60">{event.place}</p>
              ) : null}
            </div>

            <div className="shrink-0 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200">
              {event.time}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default EventCard;
