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
import { Trophy, Star, Plus, Trash2, Crown, X, ChevronDown, Loader2, Film } from 'lucide-react';

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

// ── Onglet 1 — Catégories ────────────────────────────────────────────────────

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
    await fetch(`${API}/awards/categories/${id}`, { method: 'DELETE', credentials: 'include' });
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
    <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '18rem 1fr' : '1fr', gap: '2rem', alignItems: 'start' }}>

      {/* ── Colonne gauche — Formulaire (ADMIN uniquement) ── */}
      {isAdmin && (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem', position: 'sticky', top: '1rem' }} className="space-y-4">
          <p className="label-overline">{editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</p>
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
          <textarea
            placeholder="Description (optionnelle)"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={3}
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

      {/* ── Colonne droite — Liste en tableau ── */}
      <div>
        {categories.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-faint)', padding: '3rem 0', textAlign: 'center' }}>
            Aucune catégorie pour l'édition {edition}. {isAdmin ? 'Créez-en une ci-contre.' : ''}
          </p>
        ) : (
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--color-surface-high)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Catégorie', 'Nominés', isAdmin ? 'Actions' : ''].map((h, i) => (
                    <th key={i} className="label-overline" style={{ padding: '0.875rem 1rem', textAlign: i === 2 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr
                    key={cat.id}
                    style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={13} className="text-amber-400 shrink-0" />
                        <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.875rem' }}>{cat.name}</span>
                      </div>
                      {cat.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', paddingLeft: '1.375rem' }}>{cat.description}</p>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: cat.nominations.length > 0 ? 'var(--color-text)' : 'var(--color-text-faint)' }}>
                        {cat.nominations.length}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      {isAdmin && (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => startEdit(cat)}
                            style={{ fontSize: '0.6875rem', padding: '0.25rem 0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', background: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    await fetch(`${API}/awards/nominations/${nominationId}`, { method: 'DELETE', credentials: 'include' });
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
          <div key={cat.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>

            {/* En-tête catégorie + sélecteur */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-high)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Star size={13} className="text-amber-400 shrink-0" />
                <p className="label-overline">{cat.name}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  value={selectedFilm[cat.id] ?? ''}
                  onChange={e => setSelectedFilm(p => ({ ...p, [cat.id]: e.target.value }))}
                  style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.75rem', padding: '0.5rem 0.75rem', outline: 'none' }}
                >
                  <option value="">— Choisir un film en SELECTION ({available.length} dispo.) —</option>
                  {available.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.title} · {f.country} — {f.avgRating?.toFixed(1) ?? '?'}/10
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => nominate(cat.id)}
                  disabled={!selectedFilm[cat.id] || nominating === cat.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                  className="disabled:opacity-40"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                >
                  {nominating === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  Nominer
                </button>
              </div>
            </div>

            {/* Tableau des nominés */}
            {cat.nominations.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', textAlign: 'center', padding: '1.5rem 1rem' }}>Aucun nominé pour cette catégorie.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Film · Pays', 'Statut', ''].map((h, i) => (
                      <th key={i} className="label-overline" style={{ padding: '0.625rem 1rem', textAlign: i === 2 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.nominations.map(nom => (
                    <tr
                      key={nom.id}
                      style={{ borderBottom: '1px solid var(--color-border)', background: nom.isWinner ? 'rgba(251,191,36,0.04)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={e => { if (!nom.isWinner) e.currentTarget.style.background = 'var(--color-surface-high)'; }}
                      onMouseLeave={e => { if (!nom.isWinner) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {nom.isWinner && <Crown size={11} className="text-amber-400 shrink-0" />}
                          <span style={{ fontWeight: 700, color: nom.isWinner ? '#fcd34d' : 'var(--color-text)', fontSize: '0.875rem' }}>{nom.film.title}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem', paddingLeft: nom.isWinner ? '1.375rem' : '0' }}>{nom.film.country}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Badge status={nom.film.status} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {!nom.isWinner && (
                          <button
                            onClick={() => removeNom(nom.id)}
                            title="Retirer la nomination"
                            style={{ color: 'var(--color-text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.15s', display: 'inline-flex', alignItems: 'center' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-faint)'}
                          >
                            <X size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      await fetch(`${API}/awards/nominations/${nominationId}/winner`, { method: 'PUT', credentials: 'include' });
      await load();
    } finally {
      setProcessing(null);
    }
  };

  const clearWinner = async (nominationId) => {
    setProcessing(nominationId);
    try {
      await fetch(`${API}/awards/nominations/${nominationId}/winner`, { method: 'DELETE', credentials: 'include' });
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
          <div key={cat.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>

            {/* En-tête catégorie */}
            <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Trophy size={13} className="text-amber-400 shrink-0" />
              <p className="label-overline" style={{ flex: 1 }}>{cat.name}</p>
              {winner
                ? <span className="text-[11px] px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 font-bold uppercase tracking-wider">Primé</span>
                : <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-faint)' }}>{cat.nominations.length} nominé{cat.nominations.length !== 1 ? 's' : ''}</span>
              }
            </div>

            {/* Tableau des nominés + actions gagnant */}
            {cat.nominations.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', textAlign: 'center', padding: '1.5rem 1rem' }}>Aucun nominé pour cette catégorie.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {['Film · Pays', 'Statut', 'Action'].map((h, i) => (
                      <th key={i} className="label-overline" style={{ padding: '0.625rem 1rem', textAlign: i === 2 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.nominations.map(nom => (
                    <tr
                      key={nom.id}
                      style={{ borderBottom: '1px solid var(--color-border)', background: nom.isWinner ? 'rgba(251,191,36,0.06)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={e => { if (!nom.isWinner) e.currentTarget.style.background = 'var(--color-surface-high)'; }}
                      onMouseLeave={e => { if (!nom.isWinner) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {nom.isWinner
                            ? <Crown size={11} className="text-amber-400 shrink-0" />
                            : <Film  size={11} style={{ color: 'var(--color-text-faint)', flexShrink: 0 }} />
                          }
                          <span style={{ fontWeight: 700, color: nom.isWinner ? '#fcd34d' : 'var(--color-text)', fontSize: '0.875rem' }}>{nom.film.title}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.125rem', paddingLeft: '1.375rem' }}>{nom.film.country}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Badge status={nom.film.status} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {processing === nom.id ? (
                          <Loader2 size={13} className="animate-spin" style={{ color: 'var(--color-text-faint)' }} />
                        ) : nom.isWinner ? (
                          <button
                            onClick={() => clearWinner(nom.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.3rem 0.75rem', border: '1px solid rgba(251,191,36,0.25)', color: 'rgba(251,191,36,0.7)', background: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <X size={10} /> Retirer
                          </button>
                        ) : (
                          <button
                            onClick={() => setWinner(nom.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.3rem 0.75rem', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', cursor: 'pointer', transition: 'background 0.15s', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.22)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(251,191,36,0.12)'}
                          >
                            <Crown size={10} /> Désigner
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default function AwardsPage() {
  const [tab, setTab]         = useState('categories');
  const [edition, setEdition] = useState(CURRENT_EDITION);
  const [summary, setSummary] = useState({ categories: 0, nominations: 0, winners: 0 });

  // Récupérer le rôle depuis le localStorage
  const user     = JSON.parse(localStorage.getItem('marsai_user') || '{}');
  const userRole = user.role ?? 'MODERATOR';

  // Chargement des stats globales (comptes pour KPIs et onglets)
  const loadSummary = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/awards/categories?edition=${edition}`, { credentials: 'include' });
      const cats = await res.json();
      if (Array.isArray(cats)) {
        const allNoms = cats.flatMap(c => c.nominations ?? []);
        setSummary({
          categories:  cats.length,
          nominations: allNoms.length,
          winners:     allNoms.filter(n => n.isWinner).length,
        });
      }
    } catch { /* silencieux */ }
  }, [edition]);

  useEffect(() => { loadSummary(); }, [loadSummary]);

  // Changement d'onglet + refresh des counts
  const handleTabChange = (id) => {
    setTab(id);
    loadSummary();
  };

  const tabs = [
    { id: 'categories',  label: 'Catégories',  icon: Star,   count: summary.categories  },
    { id: 'nominations', label: 'Nominations', icon: Film,   count: summary.nominations },
    { id: 'winners',     label: 'Gagnants',    icon: Crown,  count: summary.winners     },
  ];

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
            Palmarès
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Lien contextuel → Gagnants quand des nominations sont sans primé */}
          {summary.nominations > summary.winners && summary.nominations > 0 && (
            <button
              onClick={() => handleTabChange('winners')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '0.5rem 0.875rem', transition: 'background 0.15s, border-color 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.15)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'; }}
            >
              <Crown size={12} />
              {summary.nominations - summary.winners} nomination{summary.nominations - summary.winners > 1 ? 's' : ''} sans primé → Gagnants
            </button>
          )}

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
          </div>{/* fin wrapper lien + édition */}
        </div>
      </header>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black" style={{ color: '#818cf8' }}>{summary.categories}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Catégories</p>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black" style={{ color: '#a78bfa' }}>{summary.nominations}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Nominations</p>
        </div>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem' }}>
          <p className="text-2xl font-black text-amber-400">{summary.winners}</p>
          <p className="label-overline" style={{ marginTop: '0.25rem' }}>Primés</p>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              background: 'none', border: 'none',
              borderBottom: tab === id ? '2px solid #6366f1' : '2px solid transparent',
              color: tab === id ? '#818cf8' : 'var(--color-text-muted)',
              cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s', marginBottom: '-1px',
            }}
          >
            <Icon size={13} />
            {label}
            <span style={{ opacity: 0.6 }}>({count})</span>
          </button>
        ))}
      </div>

      {/* ── Contenu ── */}
      {tab === 'categories'  && <TabCategories edition={edition} userRole={userRole} />}
      {tab === 'nominations' && <TabNominations edition={edition} />}
      {tab === 'winners'     && <TabWinners edition={edition} />}
    </div>
  );
}
