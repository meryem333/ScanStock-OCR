import { USE_MOCK, logout } from '../api.js'

export default function Sidebar({ view, setView, scanCount, theme, setTheme, onLogout }) {
  return (
    <aside style={s.sidebar}>
      <div style={s.brand}>
        <span style={s.brandMark} />
        <span className="serif" style={{ fontWeight: 600, fontSize: 21, letterSpacing: 0.3 }}>Glow Stock</span>
      </div>
      <div style={{ color: 'var(--text-dim)', fontSize: 12, padding: '2px 8px 0', letterSpacing: 0.4 }}>
        Beauty inventory & scan
      </div>

      <nav style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <NavItem icon="✦" label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
        <NavItem icon="◈" label="Scan" active={view === 'scan'} onClick={() => setView('scan')} />
        <NavItem icon="≡" label="Registre" active={view === 'log'} onClick={() => setView('log')} badge={scanCount} />
        <NavItem icon="⚙" label="Admin" active={view === 'admin'} onClick={() => setView('admin')} />
      </nav>

      <div style={s.sidebarFooter}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={s.themeToggle}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          <span>{theme === 'dark' ? 'Mode nuit' : 'Mode jour'}</span>
        </button>

        {USE_MOCK && (
          <div style={s.mockPill}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }} />
            Mode test — sans base de données
          </div>
        )}

        <button
          className="theme-toggle"
          onClick={onLogout}
          style={{ ...s.themeToggle, color: 'var(--red)' }}
        >
          <LogoutIcon />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      className="nav-item"
      onClick={onClick}
      style={{
        ...s.navItem,
        color: active ? 'var(--text)' : 'var(--text-dim)',
        background: active ? 'var(--panel-raised)' : 'transparent',
        borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 13, opacity: 0.85, color: active ? 'var(--accent)' : 'var(--text-dim)' }}>{icon}</span>
        {label}
      </span>
      {typeof badge === 'number' && badge > 0 && (
        <span className="mono" style={s.navBadge}>{badge}</span>
      )}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="var(--text-dim)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" stroke="var(--text-dim)" strokeWidth="1.6" />
      <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" stroke="var(--text-dim)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="var(--red)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const s = {
  sidebar: {
    width: 232,
    borderRight: '1px solid var(--border)',
    padding: '26px 16px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    height: '100vh', 
    zIndex: 1,
    background: 'var(--bg)',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' },
  brandMark: {
    width: 11,
    height: 11,
    borderRadius: '40% 60% 55% 45% / 55% 45% 60% 40%',
    background: 'linear-gradient(135deg, var(--accent), var(--gold))',
    display: 'inline-block',
  },
  navItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: 8,
    background: 'transparent',
    border: 'none',
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'left',
  },
  navBadge: { fontSize: 11, color: 'var(--text-dim)' },
  sidebarFooter: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text-dim)',
    padding: '9px 12px',
    background: 'var(--panel)',
    borderRadius: 10,
    border: '1px solid var(--border)',
    cursor: 'pointer',
  },
  mockPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    color: 'var(--text-dim)',
    padding: '10px 12px',
    background: 'var(--panel)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
}