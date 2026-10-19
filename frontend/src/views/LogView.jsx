import { useState } from 'react'
import { ConfidenceBadge, StatusBadge, CatalogBadge } from '../components/Badges.jsx'
import { isKnown } from '../catalog.js'

export default function LogView({ results, images, catalog }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="fade-up">
      <header style={s.viewHeader}>
        <h1 className="serif" style={s.h1}>Registre des scans</h1>
        <p style={s.sub}>Historique des produits identifiés, du plus récent au plus ancien.</p>
        <span className="title-accent" />
      </header>

      {results.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color: 'var(--text-dim)' }}>Le registre est vide. Lance un scan pour commencer ✦</p>
        </div>
      ) : (
        <div style={s.grid}>
          {results.map((r, idx) => {
            const totalValue = (r.products ?? []).reduce(
              (sum, p) => sum + (p.unitPrice ?? 0) * (p.quantity ?? 0),
              0
            )
            const isOpen = openId === r.id
            const firstProduct = r.products?.[0]

            return (
              <div
                key={r.id}
                className="lift-card fade-up"
                style={{ ...s.card, animationDelay: `${idx * 0.04}s`, gridColumn: isOpen ? '1 / -1' : undefined }}
                onClick={() => setOpenId(isOpen ? null : r.id)}
              >
                <div style={s.cardImage}>
                  {images[r.id] ? (
                    <img src={images[r.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={s.cardImagePlaceholder}>✦</div>
                  )}
                  <div style={s.cardImageBadge}><StatusBadge status={r.status} /></div>
                </div>

                <div style={s.cardBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{firstProduct?.name ?? r.fileName}</div>
                      <div className="mono" style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 2 }}>
                        {r.products?.length ?? 0} article{(r.products?.length ?? 0) > 1 ? 's' : ''} · {r.fileName}
                      </div>
                    </div>
                    <ConfidenceBadge value={r.confidence} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                    <span className="serif" style={{ fontSize: 18, fontWeight: 600, color: 'var(--gold)' }}>
                      {totalValue.toFixed(2)} €
                    </span>
                    <span className="mono" style={{ color: 'var(--text-dim)', fontSize: 11 }}>
                      {new Date(r.scannedAtUtc).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="fade-in" style={s.detail} onClick={(e) => e.stopPropagation()}>
                    {r.products?.length > 0 && (
                      <div style={{ marginBottom: r.warnings?.length ? 16 : 0 }}>
                        <div className="mono" style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 8 }}>
                          PRODUITS DÉTECTÉS
                        </div>
                        <div style={s.productTable}>
                          <div style={{ ...s.productRow, ...s.productRowHead }} className="mono">
                            <span>Nom</span>
                            <span>Qté</span>
                            <span>Prix unit.</span>
                            <span>Catalogue</span>
                          </div>
                          {r.products.map((p, i) => (
                            <div key={i} style={s.productRow} title={p.rawOcrText || ''}>
                              <span>{p.name}</span>
                              <span className="mono">{p.quantity}</span>
                              <span className="mono">{p.unitPrice != null ? `${p.unitPrice.toFixed(2)} €` : '—'}</span>
                              <CatalogBadge known={isKnown(p.name, catalog)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {r.warnings?.length > 0 && (
                      <div>
                        <div className="mono" style={{ color: 'var(--text-dim)', fontSize: 12, marginBottom: 6 }}>
                          AVERTISSEMENTS
                        </div>
                        {r.warnings.map((w, i) => (
                          <p key={i} style={s.warning}>{w}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  viewHeader: { marginBottom: 28 },
  h1: { fontSize: 30, fontWeight: 600, margin: 0 },
  sub: { color: 'var(--text-dim)', marginTop: 8, fontSize: 15 },
  empty: { padding: '40px 0', borderTop: '1px solid var(--border)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 18,
  },
  card: {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  cardImage: {
    position: 'relative',
    height: 140,
    background: 'var(--panel-raised)',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    color: 'var(--accent)',
    opacity: 0.5,
  },
  cardImageBadge: { position: 'absolute', top: 10, left: 10 },
  cardBody: { padding: '14px 16px 16px' },
  detail: { padding: '18px 20px 20px', borderTop: '1px solid var(--border)', background: 'var(--panel-raised)' },
  productTable: { border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  productRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 0.5fr 0.8fr 0.7fr',
    gap: 10,
    padding: '8px 12px',
    fontSize: 13,
    borderBottom: '1px solid var(--border)',
    alignItems: 'center',
    background: 'var(--panel)',
  },
  productRowHead: { color: 'var(--text-dim)', fontSize: 11, background: 'var(--panel-raised)' },
  warning: { color: 'var(--accent)', fontSize: 13, margin: '4px 0' },
}
