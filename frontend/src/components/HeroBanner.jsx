export default function HeroBanner({ title, subtitle, ctaLabel, onCta }) {
  return (
    <div style={s.banner} className="fade-up">
      <div style={s.decorCircle1} />
      <div style={s.decorCircle2} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={s.eyebrow}>✦ Glow Stock</div>
        <h2 className="serif" style={s.title}>{title}</h2>
        <p style={s.subtitle}>{subtitle}</p>
        {ctaLabel && (
          <button onClick={onCta} style={s.cta}>
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  )
}

const s = {
  banner: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    padding: '32px 36px',
    background: 'var(--gradient)',
    color: '#fff',
    marginBottom: 24,
  },
  decorCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.14)',
    top: -100,
    right: -60,
  },
  decorCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    bottom: -60,
    right: 80,
  },
  eyebrow: { fontSize: 12, letterSpacing: 1, opacity: 0.85, fontWeight: 600, textTransform: 'uppercase' },
  title: { fontSize: 30, fontWeight: 600, margin: '10px 0 6px' },
  subtitle: { fontSize: 15, opacity: 0.9, maxWidth: 420, lineHeight: 1.5 },
  cta: {
    marginTop: 18,
    background: '#fff',
    color: '#7c3aed',
    border: 'none',
    padding: '10px 22px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
}
