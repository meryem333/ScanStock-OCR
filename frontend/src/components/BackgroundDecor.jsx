export default function BackgroundDecor() {
  return (
    <>
      <div
        className="decor-orb orb-1"
        style={{ width: 380, height: 380, top: -80, right: -100, background: 'var(--accent)' }}
      />
      <div
        className="decor-orb orb-2"
        style={{ width: 300, height: 300, bottom: -60, left: '18%', background: 'var(--gold)' }}
      />
      <div
        className="decor-orb orb-3"
        style={{ width: 240, height: 240, top: '40%', right: '8%', background: 'var(--accent-soft)' }}
      />
    </>
  )
}
