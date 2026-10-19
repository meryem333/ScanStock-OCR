export function ConfidenceBadge({ value }) {
  if (value == null) return <span style={{ color: 'var(--text-dim)' }}>—</span>
  const pct = Math.round(value * 100)
  const level = pct >= 85 ? 'high' : pct >= 60 ? 'mid' : 'low'
  const colors = {
    high: { fg: 'var(--green)', bg: 'color-mix(in srgb, var(--green) 16%, transparent)' },
    mid: { fg: 'var(--accent)', bg: 'color-mix(in srgb, var(--accent) 16%, transparent)' },
    low: { fg: 'var(--red)', bg: 'color-mix(in srgb, var(--red) 16%, transparent)' },
  }[level]
  return (
    <span className="mono" style={{ padding: '3px 9px', borderRadius: 99, fontSize: 12, width: 'fit-content', color: colors.fg, background: colors.bg }}>
      {pct}%
    </span>
  )
}

export function StatusBadge({ status }) {
  const ok = status === 'success'
  return (
    <span
      className="mono"
      style={{
        padding: '3px 9px',
        borderRadius: 99,
        fontSize: 11,
        width: 'fit-content',
        color: ok ? 'var(--green)' : 'var(--red)',
        background: ok ? 'color-mix(in srgb, var(--green) 16%, transparent)' : 'color-mix(in srgb, var(--red) 16%, transparent)',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {status || 'inconnu'}
    </span>
  )
}

export function CatalogBadge({ known }) {
  return (
    <span
      className="mono"
      style={{
        padding: '2px 8px',
        borderRadius: 99,
        fontSize: 11,
        color: known ? 'var(--green)' : 'var(--gold)',
        background: known ? 'color-mix(in srgb, var(--green) 14%, transparent)' : 'color-mix(in srgb, var(--gold) 16%, transparent)',
        whiteSpace: 'nowrap',
      }}
    >
      {known ? 'En stock' : 'Nouveau'}
    </span>
  )
}

export function ScanIcon() {
  // A stylized lipstick/wand glyph rather than a generic barcode, to match the beauty theme.
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="17" y="6" width="8" height="14" rx="3" fill="var(--accent)" opacity="0.9" />
      <rect x="18.5" y="18" width="5" height="6" fill="var(--gold)" />
      <path d="M15 24h12l-1.5 10a3 3 0 0 1-3 2.6h-3a3 3 0 0 1-3-2.6L15 24Z" fill="var(--text-dim)" opacity="0.5" />
      <circle cx="34" cy="9" r="1.6" fill="var(--gold)" />
      <circle cx="8" cy="12" r="1.2" fill="var(--accent)" />
      <circle cx="32" cy="30" r="1.4" fill="var(--accent)" />
    </svg>
  )
}
