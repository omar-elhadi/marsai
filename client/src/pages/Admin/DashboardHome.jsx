import { useState, useEffect } from 'react';
import { Film, Clock, CheckCircle, XCircle, Loader2, Trophy, Star } from 'lucide-react';

function DashboardHome() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/films/stats`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [token]);

  // Petite fonction pour générer une carte de stat
  const StatCard = ({ title, count, icon, color }) => (
    <div className="bg-white/5 p-6 border border-white/15 flex items-center gap-4">
      <div className={`p-3 bg-opacity-10 ${color.bg} ${color.text}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</p>
        <p className="text-3xl font-black text-white">
          {loading ? <Loader2 size={20} className="animate-spin text-white/40" /> : (count ?? 0)}
        </p>
      </div>
    </div>
  );

  // Raccourci vers byStatus (évite les undefined)
  const by = stats?.byStatus ?? {};

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">Vue d'ensemble</h2>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Films"
          count={stats?.total}
          icon={<Film size={24} />}
          color={{ bg: 'bg-indigo-500', text: 'text-indigo-400' }}
        />
        <StatCard
          title="En attente"
          count={(by.SUBMITTED ?? 0) + (by.IN_REVIEW ?? 0)}
          icon={<Clock size={24} />}
          color={{ bg: 'bg-yellow-500', text: 'text-yellow-400' }}
        />
        <StatCard
          title="Acceptés"
          count={(by.APPROVED ?? 0) + (by.SELECTION ?? 0) + (by.FINALIST ?? 0) + (by.AWARD ?? 0)}
          icon={<CheckCircle size={24} />}
          color={{ bg: 'bg-green-500', text: 'text-green-400' }}
        />
        <StatCard
          title="Refusés"
          count={by.REJECTED ?? 0}
          icon={<XCircle size={24} />}
          color={{ bg: 'bg-red-500', text: 'text-red-400' }}
        />
        <StatCard
          title="Sélectionnés"
          count={by.SELECTION ?? 0}
          icon={<Star size={24} />}
          color={{ bg: 'bg-indigo-500', text: 'text-indigo-400' }}
        />
        <StatCard
          title="Finalistes"
          count={by.FINALIST ?? 0}
          icon={<Star size={24} />}
          color={{ bg: 'bg-purple-500', text: 'text-purple-400' }}
        />
        <StatCard
          title="Primés"
          count={by.AWARD ?? 0}
          icon={<Trophy size={24} />}
          color={{ bg: 'bg-amber-500', text: 'text-amber-400' }}
        />
        <StatCard
          title="À modifier"
          count={by.TO_MODIFY ?? 0}
          icon={<Clock size={24} />}
          color={{ bg: 'bg-orange-500', text: 'text-orange-400' }}
        />
      </div>

      {/* Section vide pour l'instant (Graphiques ou Derniers ajouts) */}
      <div className="bg-white/5 border border-white/15 p-8 text-center text-white/50 h-64 flex items-center justify-center">
        Zone pour les graphiques futurs ou les activités récentes
      </div>
    </div>
  );
}

export default DashboardHome;