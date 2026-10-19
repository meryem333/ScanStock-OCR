import { useState } from 'react'
import { login, register } from '../api.js'

export default function LoginView({ onLoggedIn }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        onLoggedIn()
      } else {
        await register(email, password)
        await login(email, password)
        onLoggedIn()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.wrap}>
      <form onSubmit={handleSubmit} style={s.card} className="fade-up">
        <h1 className="serif" style={s.title}>
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h1>
        <div className="title-accent" />
        <input
          style={s.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={s.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={s.error}>{error}</p>}
        <button type="submit" className="scan-btn" style={s.btn} disabled={loading}>
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
        <p style={s.switchText}>
          {mode === 'login' ? "Pas encore de compte ?" : 'Déjà un compte ?'}{' '}
          <span
            style={s.switchLink}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? "S'inscrire" : 'Se connecter'}
          </span>
        </p>
      </form>
    </div>
  )
}

const s = {
  wrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' },
  card: { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '40px', width: 360, display: 'flex', flexDirection: 'column', gap: 14 },
  title: { margin: 0, fontSize: 26, color: 'var(--text)' },
  input: { padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--panel-raised)', color: 'var(--text)', fontSize: 14 },
  btn: { padding: '12px', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 600, cursor: 'pointer', marginTop: 6 },
  error: { color: 'var(--red)', fontSize: 13, margin: 0 },
  switchText: { fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', margin: 0 },
  switchLink: { color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 },
}