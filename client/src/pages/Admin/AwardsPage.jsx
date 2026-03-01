/**
 * AwardsPage.jsx — Dashboard admin Palmarès
 *
 * 4 onglets :
 *  1. Sélection   — films APPROVED triés par note → passer en SELECTION
 *  2. Catégories  — CRUD des catégories par édition (ADMIN only)
 *  3. Nominations — nominer films SELECTION dans une catégorie → FINALIST
 *  4. Gagnants    — désigner le gagnant par catégorie → AWARD
 */

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Film, Plus, Trash2, Crown, X, ChevronDown, Loader2, RotateCcw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const CURRENT_EDITION = new Date().getFullYear();

// ── Helpers ──────────────────────────────────────────────────────────────────

function authHeader() {
  const token = localStorage.getItem('marsai_token') || localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

const STATUS_COLORS = {
  APPROVED:  'text-green-400',
  SELECTION: 'text-indigo-400',
  FINALIST:  'text-purple-400',
  AWARD:     'text-amber-400',
};

const STATUS_BG = {
  APPROVED:  'bg-green-500/10 border-green-500/20 text-green-400',
  SELECTION: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  FINALIST:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  AWARD:     'bg-amber-500/10 border-amber-500/20 text-amber-400',
};

function Badge({ status }) {
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded border ${STATUS_BG[status] ?? 'bg-white/5 border-white/10 text-white/50'}`}>
      {status}
    </span>
  );
}

function Rating({ avg, total }) {
  if (avg == null) return <span className="text-white/30 text-xs">—</span>;
  return (
    <span className="text-white/70 text-xs font-mono">
      {avg.toFixed(1)} <span className="text-white/30">/ {total}v</span>
    </span>
  );
}

// ── Onglet 1 — Sélection ─────────────────────────────────────────────────────

function TabSelection({ onStatusChange }) {
  const [films, setFilms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/awards/selection`, { headers: authHeader() });
      const data = await res.json();
      setFilms(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (filmId, newStatus) => {
    setUpdating(filmId);
    try {
      await fetch(`${API}/films/${filmId}/status`, {
        method:  'PUT',
        headers: authHeader(),
        body:    JSON.stringify({ status: newStatus }),
      });
      await load();
      onStatusChange?.();
    } finally {
      setUpdating(null);
    }
  };

  const approved   = films.filter(f => f.status === 'APPROVED');
  const inSelection = films.filter(f => ['SELECTION','FINALIST','AWARD'].includes(f.status));

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>;

  return (
    <div className="space-y-6">
      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Approuvés (à sélectionner)', count: approved.length, color: 'text-green-400' },
          { label: 'En sélection',               count: inSelection.filter(f=>f.status==='SELECTION').length, color: 'text-indigo-400' },
          { label: 'Finalistes + Primés',        count: inSelection.filter(f=>['FINALIST','AWARD'].includes(f.status)).length, color: 'text-purple-400' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 p-4">
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-xs text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                {['Film', 'Réalisateur', 'Pays', 'Note moy.', 'Statut', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-white/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {films.map(film => (
                <tr key={film.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium max-w-48 truncate">{film.title}</td>
                  <td className="px-4 py-3 text-xs text-white/50">
                    {film.submitter?.firstName} {film.submitter?.lastName}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/50">{film.country}</td>
                  <td className="px-4 py-3"><Rating avg={film.avgRating} total={film.totalVotes} /></td>
                  <td className="px-4 py-3"><Badge status={film.status} /></td>
                  <td className="px-4 py-3">
                    {updating === film.id ? (
                      <Loader2 size={14} className="animate-spin text-white/30" />
                    ) : film.status === 'APPROVED' ? (
                      <button
                        onClick={() => changeStatus(film.id, 'SELECTION')}
                        className="text-[11px] px-3 py-1 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors"
                      >
                        → Sélectionner
                      </button>
                    ) : film.status === 'SELECTION' ? (
                      <button
                        onClick={() => changeStatus(film.id, 'APPROVED')}
                        className="text-[11px] px-3 py-1 bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw size={10} /> Retirer
                      </button>
                    ) : (
                      <span className="text-[11px] text-white/25">Nominé/Primé</span>
                    )}
                  </td>
                </tr>
              ))}
              {films.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-white/30">Aucun film approuvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Onglet 2 — Catégories ────────────────────────────────────────────────────

function TabCategories({ edition, userRole }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState({ name: '', description: '', displayOrder: 0 });
  const [saving, setSaving]         = useState(false);
  const [editId, setEditId]         = useState(null);

  const isAdmin = userRole === 'ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/awards/categories?edition=${edition}`, { headers: authHeader() });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [edition]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const url    = editId ? `${API}/awards/categories/${editId}` : `${API}/awards/categories`;
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: authHeader(),
        body: JSON.stringify({ ...form, edition }),
      });
      setForm({ name: '', description: '', displayOrder: 0 });
      setEditId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await fetch(`${API}/awards/categories/${id}`, { method: 'DELETE', headers: authHeader() });
    await load();
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description ?? '', displayOrder: cat.displayOrder });
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>;

  return (
    <div className="space-y-6">
      {/* Formulaire ajout/édition — ADMIN uniquement */}
      {isAdmin && (
        <div className="bg-white/5 border border-white/10 p-5 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-white/40">
            {editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Nom de la catégorie *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="bg-white/5 border border-white/15 text-white text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/25"
            />
            <input
              type="number"
              placeholder="Ordre d'affichage (0, 1, 2…)"
              value={form.displayOrder}
              onChange={e => setForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
              className="bg-white/5 border border-white/15 text-white text-sm px-3 py-2 outline-none focus:border-white/30"
            />
          </div>
          <textarea
            placeholder="Description (optionnelle)"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={2}
            className="w-full bg-white/5 border border-white/15 text-white text-sm px-3 py-2 outline-none focus:border-white/30 resize-none placeholder:text-white/25"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving || !form.name.trim()}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 bg-white text-black disabled:opacity-40"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              {editId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm({ name: '', description: '', displayOrder: 0 }); }}
                className="text-xs px-4 py-2 border border-white/15 text-white/50 hover:bg-white/5">
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white/5 border border-white/10 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <Star size={14} className="text-amber-400 shrink-0" />
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <span className="text-[11px] text-white/30">{cat.nominations.length} nominé(s)</span>
              </div>
              {cat.description && <p className="text-xs text-white/40 ml-5">{cat.description}</p>}
            </div>
            {isAdmin && (
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(cat)}
                  className="text-[11px] px-3 py-1 border border-white/15 text-white/50 hover:bg-white/5">
                  Modifier
                </button>
                <button onClick={() => remove(cat.id)}
                  className="text-[11px] px-2 py-1 border border-red-500/20 text-red-400/70 hover:bg-red-500/10">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-white/30 py-8 text-center">
            Aucune catégorie pour l'édition {edition}. {isAdmin ? 'Créez-en une ci-dessus.' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Onglet 3 — Nominations ───────────────────────────────────────────────────

function TabNominations({ edition }) {
  const [categories, setCategories] = useState([]);
  const [selection, setSelection]   = useState([]); // films SELECTION
  const [loading, setLoading]       = useState(true);
  const [nominating, setNominating] = useState(null);
  const [selectedFilm, setSelectedFilm] = useState({});  // { [categoryId]: filmId }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, selRes] = await Promise.all([
        fetch(`${API}/awards/categories?edition=${edition}`, { headers: authHeader() }),
        fetch(`${API}/awards/selection`, { headers: authHeader() }),
      ]);
      const cats = await catRes.json();
      const sel  = await selRes.json();
      setCategories(Array.isArray(cats) ? cats : []);
      setSelection(Array.isArray(sel) ? sel.filter(f => f.status === 'SELECTION') : []);
    } finally {
      setLoading(false);
    }
  }, [edition]);

  useEffect(() => { load(); }, [load]);

  const nominate = async (categoryId) => {
    const filmId = selectedFilm[categoryId];
    if (!filmId) return;
    setNominating(categoryId);
    try {
      await fetch(`${API}/awards/nominations`, {
        method:  'POST',
        headers: authHeader(),
        body:    JSON.stringify({ filmId: Number(filmId), categoryId }),
      });
      setSelectedFilm(p => ({ ...p, [categoryId]: '' }));
      await load();
    } finally {
      setNominating(null);
    }
  };

  const removeNom = async (nominationId) => {
    await fetch(`${API}/awards/nominations/${nominationId}`, { method: 'DELETE', headers: authHeader() });
    await load();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>;

  if (categories.length === 0) {
    return <p className="text-sm text-white/30 py-8 text-center">Créez d'abord des catégories dans l'onglet "Catégories".</p>;
  }

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const nominated = cat.nominations.filter(n => !n.isWinner);
        const winner    = cat.nominations.find(n => n.isWinner);
        // Films disponibles = SELECTION, pas encore nominés dans cette catégorie
        const nominatedFilmIds = new Set(cat.nominations.map(n => n.film.id));
        const available = selection.filter(f => !nominatedFilmIds.has(f.id));

        return (
          <div key={cat.id} className="bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-amber-400" />
              <p className="text-sm font-bold text-white uppercase tracking-wide">{cat.name}</p>
            </div>

            {/* Ajouter un nominé */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedFilm[cat.id] ?? ''}
                onChange={e => setSelectedFilm(p => ({ ...p, [cat.id]: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/15 text-white text-xs px-3 py-2 outline-none"
              >
                <option value="">— Choisir un film en SELECTION —</option>
                {available.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.title} ({f.country}) — {f.avgRating?.toFixed(1) ?? '?'}/10
                  </option>
                ))}
              </select>
              <button
                onClick={() => nominate(cat.id)}
                disabled={!selectedFilm[cat.id] || nominating === cat.id}
                className="flex items-center gap-1 text-xs px-4 py-2 bg-white/10 text-white hover:bg-white/15 disabled:opacity-30 shrink-0"
              >
                {nominating === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Nominer
              </button>
            </div>

            {/* Liste des nominés */}
            {cat.nominations.length > 0 ? (
              <div className="space-y-1">
                {cat.nominations.map(nom => (
                  <div key={nom.id} className={`flex items-center justify-between px-3 py-2 text-xs ${nom.isWinner ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/[0.03] border border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      {nom.isWinner && <Crown size={11} className="text-amber-400" />}
                      <span className={nom.isWinner ? 'text-amber-300 font-semibold' : 'text-white/70'}>
                        {nom.film.title}
                      </span>
                      <span className="text-white/30">{nom.film.country}</span>
                    </div>
                    {!nom.isWinner && (
                      <button onClick={() => removeNom(nom.id)}
                        className="text-red-400/50 hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/25 text-center py-2">Aucun nominé</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Onglet 4 — Gagnants ──────────────────────────────────────────────────────

function TabWinners({ edition }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [processing, setProcessing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/awards/categories?edition=${edition}`, { headers: authHeader() });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [edition]);

  useEffect(() => { load(); }, [load]);

  const setWinner = async (nominationId) => {
    setProcessing(nominationId);
    try {
      await fetch(`${API}/awards/nominations/${nominationId}/winner`, { method: 'PUT', headers: authHeader() });
      await load();
    } finally {
      setProcessing(null);
    }
  };

  const clearWinner = async (nominationId) => {
    setProcessing(nominationId);
    try {
      await fetch(`${API}/awards/nominations/${nominationId}/winner`, { method: 'DELETE', headers: authHeader() });
      await load();
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 size={20} className="animate-spin text-white/30" /></div>;

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const winner = cat.nominations.find(n => n.isWinner);
        const others = cat.nominations.filter(n => !n.isWinner);

        return (
          <div key={cat.id} className="bg-white/5 border border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={14} className="text-amber-400" />
              <p className="text-sm font-bold text-white uppercase tracking-wide">{cat.name}</p>
              {winner && <span className="text-[11px] px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25">PRIMÉ</span>}
            </div>

            {cat.nominations.length === 0 ? (
              <p className="text-xs text-white/25 text-center py-2">Aucun nominé</p>
            ) : (
              <div className="space-y-2">
                {cat.nominations.map(nom => (
                  <div key={nom.id} className={`flex items-center justify-between px-4 py-3 border ${nom.isWinner ? 'bg-amber-500/10 border-amber-500/25' : 'bg-white/[0.03] border-white/8'}`}>
                    <div className="flex items-center gap-3">
                      {nom.isWinner
                        ? <Crown size={14} className="text-amber-400" />
                        : <Film  size={14} className="text-white/30" />
                      }
                      <div>
                        <p className={`text-sm font-medium ${nom.isWinner ? 'text-amber-300' : 'text-white'}`}>
                          {nom.film.title}
                        </p>
                        <p className="text-xs text-white/40">{nom.film.country}</p>
                      </div>
                    </div>
                    <div>
                      {processing === nom.id ? (
                        <Loader2 size={14} className="animate-spin text-white/30" />
                      ) : nom.isWinner ? (
                        <button onClick={() => clearWinner(nom.id)}
                          className="text-[11px] px-3 py-1 border border-amber-500/25 text-amber-400/70 hover:bg-amber-500/10 flex items-center gap-1">
                          <X size={10} /> Retirer
                        </button>
                      ) : (
                        <button onClick={() => setWinner(nom.id)}
                          className="text-[11px] px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1">
                          <Crown size={10} /> Désigner gagnant
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {categories.length === 0 && (
        <p className="text-sm text-white/30 py-8 text-center">Aucune catégorie pour l'édition {edition}.</p>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

const TABS = [
  { id: 'selection',   label: 'Sélection',   icon: Film   },
  { id: 'categories',  label: 'Catégories',  icon: Star   },
  { id: 'nominations', label: 'Nominations', icon: Trophy },
  { id: 'winners',     label: 'Gagnants',    icon: Crown  },
];

export default function AwardsPage() {
  const [tab, setTab]         = useState('selection');
  const [edition, setEdition] = useState(CURRENT_EDITION);

  // Récupérer le rôle depuis le localStorage
  const user     = JSON.parse(localStorage.getItem('marsai_user') || '{}');
  const userRole = user.role ?? 'MODERATOR';

  return (
    <div className="min-h-screen bg-[#111827] text-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#111827]/95 backdrop-blur border-b border-white/10 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trophy size={18} className="text-amber-400" />
          <h1 className="text-xl font-black uppercase tracking-tight">Palmarès & Awards</h1>
        </div>

        {/* Sélecteur d'édition */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 uppercase tracking-wider">Édition</span>
          <div className="relative">
            <select
              value={edition}
              onChange={e => setEdition(Number(e.target.value))}
              className="appearance-none bg-white/5 border border-white/15 text-white text-sm px-3 py-1.5 pr-7 outline-none"
            >
              {[CURRENT_EDITION, CURRENT_EDITION + 1, CURRENT_EDITION - 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">

        {/* Onglets */}
        <div className="flex gap-1 border-b border-white/10 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px
                ${tab === id
                  ? 'text-white border-white'
                  : 'text-white/40 border-transparent hover:text-white/70'
                }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {tab === 'selection'   && <TabSelection onStatusChange={() => {}} />}
        {tab === 'categories'  && <TabCategories edition={edition} userRole={userRole} />}
        {tab === 'nominations' && <TabNominations edition={edition} />}
        {tab === 'winners'     && <TabWinners edition={edition} />}
      </div>
    </div>
  );
}
