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

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const STATUS_BG = {
  APPROVED:  'bg-green-500/10 border-green-500/20 text-green-400',
  SELECTION: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  FINALIST:  'bg-purple-500/10 border-purple-500/20 text-purple-400',
  AWARD:     'bg-amber-500/10 border-amber-500/20 text-amber-400',
};

function Badge({ status }) {
  return (
    <span className={`text-[11px] px-2 py-0.5 border ${STATUS_BG[status] ?? ''}`}
      style={!STATUS_BG[status] ? { background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' } : {}}
    >
      {status}
    </span>
  );
}

function Rating({ avg, total }) {
  if (avg == null) return <span style={{ color: 'var(--color-text-faint)', fontSize: '0.75rem' }}>—</span>;
  return (
    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
      {avg.toFixed(1)} <span style={{ color: 'var(--color-text-faint)' }}>/ {total}v</span>
    </span>
  );
}

const spinnerStyle = { display: 'flex', justifyContent: 'center', padding: '4rem 0' };

// ── Onglet 1 — Sélection ─────────────────────────────────────────────────────

function TabSelection({ onStatusChange }) {
  const [films, setFilms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/awards/selection`, { headers: JSON_HEADERS, credentials: 'include' });
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
        headers: JSON_HEADERS,
        credentials: 'include',
        body:    JSON.stringify({ status: newStatus }),
      });
      await load();
      onStatusChange?.();
    } finally {
      setUpdating(null);
    }
  };

  const approved    = films.filter(f => f.status === 'APPROVED');
  const inSelection = films.filter(f => ['SELECTION','FINALIST','AWARD'].includes(f.status));

  if (loading) return <div style={spinnerStyle}><Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} /></div>;

  return (
    <div className="space-y-6">
      {/* Compteurs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Approuvés (à sélectionner)', count: approved.length, color: 'text-green-400' },
          { label: 'En sélection',               count: inSelection.filter(f=>f.status==='SELECTION').length, color: 'text-indigo-400' },
          { label: 'Finalistes + Primés',        count: inSelection.filter(f=>['FINALIST','AWARD'].includes(f.status)).length, color: 'text-purple-400' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="label-overline" style={{ marginTop: '0.25rem' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-high)' }}>
                {['Film', 'Réalisateur', 'Pays', 'Note moy.', 'Statut', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left label-overline">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {films.map(film => (
                <tr
                  key={film.id}
                  style={{ borderTop: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500, maxWidth: '12rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {film.submitter?.firstName} {film.submitter?.lastName}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{film.country}</td>
                  <td style={{ padding: '0.75rem 1rem' }}><Rating avg={film.avgRating} total={film.totalVotes} /></td>
                  <td style={{ padding: '0.75rem 1rem' }}><Badge status={film.status} /></td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {updating === film.id ? (
                      <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} />
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
                        style={{ fontSize: '0.6875rem', padding: '0.25rem 0.75rem', background: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                      >
                        <RotateCcw size={10} /> Retirer
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>Nominé/Primé</span>
                    )}
                  </td>
                </tr>
              ))}
              {films.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-faint)' }}>
                    Aucun film approuvé
                  </td>
                </tr>
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
      const res  = await fetch(`${API}/awards/categories?edition=${edition}`, { headers: JSON_HEADERS, credentials: 'include' });
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
        headers: JSON_HEADERS,
        credentials: 'include',
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

  const inputStyle = {
    background:   'transparent',
    border:       '1px solid var(--color-border)',
    color:        'var(--color-text)',
    fontSize:     '0.875rem',
    padding:      '0.5rem 0.75rem',
    outline:      'none',
    width:        '100%',
    boxSizing:    'border-box',
    transition:   'border-color 0.2s',
  };

  if (loading) return <div style={spinnerStyle}><Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} /></div>;

  return (
    <div className="space-y-6">
      {/* Formulaire ajout/édition — ADMIN uniquement */}
      {isAdmin && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem' }} className="space-y-4">
          <p className="label-overline">{editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Nom de la catégorie *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
            <input
              type="number"
              placeholder="Ordre d'affichage (0, 1, 2…)"
              value={form.displayOrder}
              onChange={e => setForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
            />
          </div>
          <textarea
            placeholder="Description (optionnelle)"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={2}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={save}
              disabled={saving || !form.name.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.625rem 1rem', background: 'var(--color-text)', color: 'var(--color-bg-pure)', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
              className="disabled:opacity-40"
              onMouseEnter={e => { if (!saving && form.name.trim()) e.currentTarget.style.background = '#6366f1'; }}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-text)'}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              {editId ? 'Mettre à jour' : 'Créer'}
            </button>
            {editId && (
              <button
                onClick={() => { setEditId(null); setForm({ name: '', description: '', displayOrder: 0 }); }}
                style={{ fontSize: '0.625rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.625rem 1rem', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'none', cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <Star size={14} className="text-amber-400 shrink-0" />
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{cat.name}</p>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>{cat.nominations.length} nominé(s)</span>
              </div>
              {cat.description && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '1.375rem' }}>{cat.description}</p>}
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(cat)}
                  style={{ fontSize: '0.6875rem', padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(cat.id)}
                  className="text-[11px] px-2 py-1 border border-red-500/20 text-red-400/70 hover:bg-red-500/10"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)', padding: '2rem 0', textAlign: 'center' }}>
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
        fetch(`${API}/awards/categories?edition=${edition}`, { headers: JSON_HEADERS, credentials: 'include' }),
        fetch(`${API}/awards/selection`, { headers: JSON_HEADERS, credentials: 'include' }),
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
        headers: JSON_HEADERS,
        credentials: 'include',
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

  if (loading) return <div style={spinnerStyle}><Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} /></div>;

  if (categories.length === 0) {
    return <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)', padding: '2rem 0', textAlign: 'center' }}>Créez d'abord des catégories dans l'onglet "Catégories".</p>;
  }

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        // Films disponibles = SELECTION, pas encore nominés dans cette catégorie
        const nominatedFilmIds = new Set(cat.nominations.map(n => n.film.id));
        const available = selection.filter(f => !nominatedFilmIds.has(f.id));

        return (
          <div key={cat.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Star size={14} className="text-amber-400" />
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</p>
            </div>

            {/* Ajouter un nominé */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <select
                value={selectedFilm[cat.id] ?? ''}
                onChange={e => setSelectedFilm(p => ({ ...p, [cat.id]: e.target.value }))}
                style={{ flex: 1, background: 'var(--color-surface-high)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.75rem', padding: '0.5rem 0.75rem', outline: 'none' }}
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
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', padding: '0.5rem 1rem', background: 'var(--color-surface-high)', color: 'var(--color-text)', border: '1px solid var(--color-border)', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                className="disabled:opacity-40"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
              >
                {nominating === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                Nominer
              </button>
            </div>

            {/* Liste des nominés */}
            {cat.nominations.length > 0 ? (
              <div className="space-y-1">
                {cat.nominations.map(nom => (
                  <div
                    key={nom.id}
                    className={`flex items-center justify-between px-3 py-2 text-xs ${nom.isWinner ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}
                    style={!nom.isWinner ? { background: 'var(--color-surface-high)', border: '1px solid var(--color-border)' } : {}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {nom.isWinner && <Crown size={11} className="text-amber-400" />}
                      <span className={nom.isWinner ? 'text-amber-300 font-semibold' : ''} style={!nom.isWinner ? { color: 'var(--color-text-muted)' } : {}}>
                        {nom.film.title}
                      </span>
                      <span style={{ color: 'var(--color-text-faint)' }}>{nom.film.country}</span>
                    </div>
                    {!nom.isWinner && (
                      <button
                        onClick={() => removeNom(nom.id)}
                        style={{ color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', textAlign: 'center', padding: '0.5rem 0' }}>Aucun nominé</p>
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
      const res  = await fetch(`${API}/awards/categories?edition=${edition}`, { headers: JSON_HEADERS, credentials: 'include' });
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

  if (loading) return <div style={spinnerStyle}><Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} /></div>;

  return (
    <div className="space-y-4">
      {categories.map(cat => {
        const winner = cat.nominations.find(n => n.isWinner);

        return (
          <div key={cat.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Trophy size={14} className="text-amber-400" />
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</p>
              {winner && <span className="text-[11px] px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25">PRIMÉ</span>}
            </div>

            {cat.nominations.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', textAlign: 'center', padding: '0.5rem 0' }}>Aucun nominé</p>
            ) : (
              <div className="space-y-2">
                {cat.nominations.map(nom => (
                  <div
                    key={nom.id}
                    className={`flex items-center justify-between px-4 py-3 border ${nom.isWinner ? 'bg-amber-500/10 border-amber-500/25' : ''}`}
                    style={!nom.isWinner ? { background: 'var(--color-surface-high)', border: '1px solid var(--color-border)' } : {}}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {nom.isWinner
                        ? <Crown size={14} className="text-amber-400" />
                        : <Film  size={14} style={{ color: 'var(--color-text-faint)' }} />
                      }
                      <div>
                        <p className={`text-sm font-medium ${nom.isWinner ? 'text-amber-300' : ''}`}
                          style={!nom.isWinner ? { color: 'var(--color-text)' } : {}}>
                          {nom.film.title}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)' }}>{nom.film.country}</p>
                      </div>
                    </div>
                    <div>
                      {processing === nom.id ? (
                        <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} />
                      ) : nom.isWinner ? (
                        <button
                          onClick={() => clearWinner(nom.id)}
                          className="text-[11px] px-3 py-1 border border-amber-500/25 text-amber-400/70 hover:bg-amber-500/10 flex items-center gap-1"
                        >
                          <X size={10} /> Retirer
                        </button>
                      ) : (
                        <button
                          onClick={() => setWinner(nom.id)}
                          className="text-[11px] px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1"
                        >
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
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)', padding: '2rem 0', textAlign: 'center' }}>
          Aucune catégorie pour l'édition {edition}.
        </p>
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
    <div className="animate-fade-in" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>

      {/* ── Header éditorial ── */}
      <header style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ width: 'clamp(2rem, 3vw, 3rem)', height: '1px', background: 'var(--color-accent)', flexShrink: 0 }} />
          <span className="label-overline">Administration</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.03em', textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1 }}>
            Palmarès <span style={{ color: '#6366f1' }}>Awards</span>
          </h1>

          {/* Sélecteur d'édition */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="label-overline">Édition</span>
            <div style={{ position: 'relative' }}>
              <select
                value={edition}
                onChange={e => setEdition(Number(e.target.value))}
                style={{ appearance: 'none', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.875rem', padding: '0.375rem 1.75rem 0.375rem 0.75rem', outline: 'none', cursor: 'pointer' }}
              >
                {[CURRENT_EDITION, CURRENT_EDITION + 1, CURRENT_EDITION - 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-faint)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>
      </header>

      {/* ── Onglets ── */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors
              ${tab === id ? 'border-indigo-600' : 'border-transparent'}`}
            style={{ fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: tab === id ? 'var(--color-text)' : 'var(--color-text-muted)', background: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { if (tab !== id) e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { if (tab !== id) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Contenu ── */}
      {tab === 'selection'   && <TabSelection onStatusChange={() => {}} />}
      {tab === 'categories'  && <TabCategories edition={edition} userRole={userRole} />}
      {tab === 'nominations' && <TabNominations edition={edition} />}
      {tab === 'winners'     && <TabWinners edition={edition} />}
    </div>
  );
}
