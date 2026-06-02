import { useState, useEffect } from "react";
import {
  Film,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trophy,
  Star,
} from "lucide-react";

function DashboardHome() {
  const [stats, setStats] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/films/stats`, {
          credentials: "include",
        });
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Carte de statistique — fond et bordure via CSS variables, icône garde sa couleur Tailwind
  const StatCard = ({
    title,
    count,
    icon,
    color,
  }: {
    title: string;
    count: number | null;
    icon: React.ReactNode;
    color: { bg: string; text: string };
  }) => (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "4px",
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div className={`p-3 bg-opacity-10 ${color.bg} ${color.text} shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="label-overline" style={{ marginBottom: "0.25rem" }}>
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "var(--color-text)",
            lineHeight: 1,
          }}
        >
          {loading ? (
            <Loader2
              size={20}
              className="animate-spin"
              style={{ color: "var(--color-text-muted)" }}
            />
          ) : (
            (count ?? 0)
          )}
        </p>
      </div>
    </div>
  );

  // Raccourci vers byStatus (évite les undefined)
  const by = stats?.byStatus ?? {};

  return (
    <div>
      {/* ── Header éditorial ── */}
      <header
        style={{
          marginBottom: "2.5rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              width: "clamp(2rem, 3vw, 3rem)",
              height: "1px",
              background: "var(--color-accent)",
              flexShrink: 0,
            }}
          />
          <span className="label-overline">Tableau de bord</span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--color-text)",
            lineHeight: 1,
          }}
        >
          Vue d'ensemble
        </h1>
      </header>

      {/* ── Grille des statistiques ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        style={{
          gap: "clamp(1rem, 2vw, 1.5rem)",
          marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <StatCard
          title="Total Films"
          count={stats?.total}
          icon={<Film size={24} />}
          color={{ bg: "bg-indigo-500", text: "text-indigo-400" }}
        />
        <StatCard
          title="En attente"
          count={(by.SUBMITTED ?? 0) + (by.IN_REVIEW ?? 0)}
          icon={<Clock size={24} />}
          color={{ bg: "bg-yellow-500", text: "text-yellow-400" }}
        />
        <StatCard
          title="Acceptés"
          count={
            (by.APPROVED ?? 0) +
            (by.SELECTION ?? 0) +
            (by.FINALIST ?? 0) +
            (by.AWARD ?? 0)
          }
          icon={<CheckCircle size={24} />}
          color={{ bg: "bg-green-500", text: "text-green-400" }}
        />
        <StatCard
          title="Refusés"
          count={by.REJECTED ?? 0}
          icon={<XCircle size={24} />}
          color={{ bg: "bg-red-500", text: "text-red-400" }}
        />
        <StatCard
          title="Sélectionnés"
          count={by.SELECTION ?? 0}
          icon={<Star size={24} />}
          color={{ bg: "bg-indigo-500", text: "text-indigo-400" }}
        />
        <StatCard
          title="Finalistes"
          count={by.FINALIST ?? 0}
          icon={<Star size={24} />}
          color={{ bg: "bg-purple-500", text: "text-purple-400" }}
        />
        <StatCard
          title="Primés"
          count={by.AWARD ?? 0}
          icon={<Trophy size={24} />}
          color={{ bg: "bg-amber-500", text: "text-amber-400" }}
        />
        <StatCard
          title="À modifier"
          count={by.TO_MODIFY ?? 0}
          icon={<Clock size={24} />}
          color={{ bg: "bg-orange-500", text: "text-orange-400" }}
        />
      </div>

      {/* ── Zone future (graphiques / activité récente) ── */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-text-faint)",
          height: "16rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.875rem",
        }}
      >
        Zone pour les graphiques futurs ou les activités récentes
      </div>
    </div>
  );
}

export default DashboardHome;
