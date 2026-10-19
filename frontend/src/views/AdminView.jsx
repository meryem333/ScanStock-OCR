import { useState } from 'react'

export default function AdminView({ catalog, onAdd, onRemove }) {
  const [newProduct, setNewProduct] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    if (!newProduct.trim()) return
    onAdd(newProduct)
    setNewProduct('')
  }

  return (
    <div className="fade-up">
      <header style={s.viewHeader}>
        <h1 className="serif" style={s.h1}>Catalogue produits</h1>
        <p style={s.sub}>
          Gère les références connues de ta boutique. Chaque produit scanné est comparé à cette liste
          pour savoir s'il est déjà en stock ou s'il s'agit d'une nouveauté.
        </p>
        <span className="title-accent" />
      </header>

      <div className="lift-card" style={s.panel}>
        <h3 className="serif" style={s.panelTitle}>Ajouter une référence</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <input
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="Ex : Palette Anastasia Beverly Hills"
            style={s.input}
          />
          <button type="submit" className="scan-btn" style={s.addBtn}>Ajouter</button>
        </form>
      </div>

      <div className="lift-card" style={{ ...s.panel, marginTop: 16 }}>
        <h3 className="serif" style={s.panelTitle}>En stock ({catalog.length})</h3>
        {catalog.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', marginTop: 12 }}>Aucun produit dans le catalogue.</p>
        ) : (
          <div style={s.chipGrid}>
            {catalog.map((name, i) => (
              <div key={name} className="fade-up" style={{ ...s.chip, animationDelay: `${i * 0.03}s` }}>
                <span>{name}</span>
                <button className="chip-remove" onClick={() => onRemove(name)} style={s.chipRemove} title="Retirer">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  viewHeader: { marginBottom: 28, maxWidth: 640 },
  h1: { fontSize: 30, fontWeight: 600, margin: 0 },
  sub: { color: 'var(--text-dim)', marginTop: 8, fontSize: 15, lineHeight: 1.5 },
  panel: { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px' },
  panelTitle: { margin: 0, fontSize: 17, fontWeight: 600 },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 14,
  },
  addBtn: {
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  chipGrid: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  chip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 8px 8px 14px',
    borderRadius: 99,
    background: 'var(--panel-raised)',
    border: '1px solid var(--border)',
    fontSize: 13,
  },
  chipRemove: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: 'none',
    background: 'var(--bg)',
    color: 'var(--text-dim)',
    fontSize: 11,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
