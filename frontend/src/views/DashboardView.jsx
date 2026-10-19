import CountUp from '../components/CountUp.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import { StatusBadge, ConfidenceBadge } from '../components/Badges.jsx'

export default function DashboardView({ results, catalog, onGoToScan }) {
  const totalScans = results.length
  const totalProducts = results.reduce((sum, r) => sum + (r.products?.length ?? 0), 0)
  const avgConfidence = totalScans
    ? results.reduce((sum, r) => sum + (r.confidence ?? 0), 0) / totalScans
    : 0
  const lowConfidenceCount = results.filter((r) => (r.confidence ?? 0) < 0.6).length
  const successCount = results.filter((r) => r.status === 'success').length

  const newProductNames = new Set()
  results.forEach((r) =>
    r.products?.forEach((p) => {
      if (!catalog.some((c) => c.toLowerCase() === p.name.toLowerCase())) {
        newProductNames.add(p.name)
      }
    })
  )

  const buckets = [
    { label: 'Excellente (≥85%)', count: results.filter((r) => (r.confidence ?? 0) >= 0.85).length, color: 'var(--green)' },
    { label: 'Correcte (60–84%)', count: results.filter((r) => (r.confidence ?? 0) >= 0.6 && (r.confidence ?? 0) < 0.85).length, color: 'var(--accent)' },
    { label: 'Faible (<60%)', count: results.filter((r) => (r.confidence ?? 0) < 0.6).length, color: 'var(--red)' },
  ]
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count))

  return (
    <div className="fade-up">
      <HeroBanner
        title="Bonjour ✨ Voici ta boutique aujourd'hui"
        subtitle="Suis tes scans, ton catalogue et la qualité de reconnaissance en un coup d'œil."
        ctaLabel="Lancer un scan"
        onCta={onGoToScan}
      />

      <div style={s.kpiGrid}>
        <KpiCard label="Scans effectués" value={totalScans} delay={0} />
        <KpiCard label="Articles détectés" value={totalProducts} delay={0.06} />
        <KpiCard label="Confiance moyenne" value={totalScans ? Math.round(avgConfidence * 100) : 0} suffix="%" delay={0.12} />
        <KpiCard label="Nouveaux produits" value={newProductNames.size} accent delay={0.18} />
      </div>

      <div style={s.row}>
        <div className="lift-card fade-up" style={{ ...s.panel, animationDelay: '0.15s' }}>
          <h3 className="serif" style={s.panelTitle}>Qualité de reconnaissance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
            {buckets.map((b) => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: 'var(--text-dim)' }}>{b.label}</span>
                  <span className="mono">{b.count}</span>
                </div>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: `${(b.count / maxBucket) * 100}%`, background: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lift-card fade-up" style={{ ...s.panel, animationDelay: '0.2s' }}>
          <h3 className="serif" style={s.panelTitle}>État du pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18, fontSize: 14 }}>
            <StatRow label="Scans réussis" value={`${successCount} / ${totalScans || 0}`} />
            <StatRow label="Scans à faible confiance" value={lowConfidenceCount} />
            <StatRow label="Références au catalogue" value={catalog.length} />
          </div>
        </div>
      </div>

      <div className="lift-card fade-up" style={{ ...s.panel, marginTop: 20, animationDelay: '0.25s' }}>
        <h3 className="serif" style={s.panelTitle}>Scans récents</h3>
        {results.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', marginTop: 12 }}>Aucun scan pour l'instant — direction l'onglet Scan ✦</p>
        ) : (
          <div style={{ marginTop: 12 }}>
            {results.slice(0, 5).map((r, i) => (
              <div key={r.id} className="fade-up" style={{ ...s.recentRow, animationDelay: `${i * 0.05}s` }}>
                <span style={{ fontWeight: 500 }}>{r.fileName}</span>
                <StatusBadge status={r.status} />
                <ConfidenceBadge value={r.confidence} />
                <span className="mono" style={{ color: 'var(--text-dim)', fontSize: 12 }}>
                  {new Date(r.scannedAtUtc).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ label, value, suffix = '', accent, delay = 0 }) {
  return (
    <div className="lift-card fade-up" style={{ ...s.kpiCard, animationDelay: `${delay}s` }}>
      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{label}</div>
      <div className="serif" style={{ fontSize: 32, fontWeight: 600, marginTop: 6, color: accent ? 'var(--accent)' : 'var(--text)' }}>
        <CountUp value={value} suffix={suffix} />
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
      <span className="mono" style={{ fontWeight: 600 }}>{value}</span>
    </div>
  )
}

const s = {
  viewHeader: { marginBottom: 28 },
  h1: { fontSize: 30, fontWeight: 600, margin: 0 },
  sub: { color: 'var(--text-dim)', marginTop: 8, fontSize: 15 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  kpiCard: { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 },
  panel: { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px' },
  panelTitle: { margin: 0, fontSize: 17, fontWeight: 600 },
  barTrack: { height: 8, borderRadius: 99, background: 'var(--panel-raised)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' },
  recentRow: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 0.8fr 0.6fr 1fr',
    alignItems: 'center',
    gap: 10,
    padding: '10px 0',
    borderTop: '1px solid var(--border)',
    fontSize: 14,
  },
}
