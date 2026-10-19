import { useState, useEffect } from 'react'
import { getResults } from './api.js'
import { getCatalog, addProduct, removeProduct } from './catalog.js'
import Sidebar from './components/Sidebar.jsx'
import BackgroundDecor from './components/BackgroundDecor.jsx'
import DashboardView from './views/DashboardView.jsx'
import ScanView from './views/ScanView.jsx'
import LogView from './views/LogView.jsx'
import AdminView from './views/AdminView.jsx'
import LoginView from './views/LoginView.jsx'
import { getToken, logout } from './api.js'

export default function App() {
  const [view, setView] = useState('dashboard')
  const [authed, setAuthed] = useState(() => !!getToken())
  const [results, setResults] = useState([])
  const [images, setImages] = useState({}) // scan id -> object URL, kept client-side for preview
  const [catalog, setCatalog] = useState(() => getCatalog())
  const [theme, setTheme] = useState(() => localStorage.getItem('scanstock-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('scanstock-theme', theme)
  }, [theme])

  useEffect(() => {
    getResults().then(setResults)
  }, [])

  async function refresh() {
    setResults(await getResults())
  }

  function handleScanned(result, previewUrl) {
    if (previewUrl) {
      setImages((prev) => ({ ...prev, [result.id]: previewUrl }))
    }
    refresh().then(() => setView('log'))
  }

  function handleAddProduct(name) {
    setCatalog(addProduct(name))
  }

  function handleRemoveProduct(name) {
    setCatalog(removeProduct(name))
  }
if (!authed) {
    return <LoginView onLoggedIn={() => setAuthed(true)} />
  }
  return (
    <div style={s.shell}>
      <BackgroundDecor />
<Sidebar
  view={view}
  setView={setView}
  scanCount={results.length}
  theme={theme}
  setTheme={setTheme}
  onLogout={() => {
    logout()
    setAuthed(false)
  }}
/>
      <main style={s.main}>
        {view === 'dashboard' && (
          <DashboardView results={results} catalog={catalog} onGoToScan={() => setView('scan')} />
        )}
        {view === 'scan' && <ScanView onScanned={handleScanned} />}
        {view === 'log' && <LogView results={results} images={images} catalog={catalog} />}
        {view === 'admin' && (
          <AdminView catalog={catalog} onAdd={handleAddProduct} onRemove={handleRemoveProduct} />
        )}
      </main>
    </div>
  )
}

const s = {
  shell: { display: 'flex', Height: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' },
  main: { flex: 1, padding: '48px 56px', Width: 100, position: 'relative', zIndex: 1 ,height: '100vh', overflowY: 'auto' },
}
