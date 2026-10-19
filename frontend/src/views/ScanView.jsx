import { useState, useRef } from 'react'
import { uploadImage } from '../api.js'
import { ScanIcon } from '../components/Badges.jsx'

export default function ScanView({ onScanned }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [status, setStatus] = useState('idle') // idle | scanning | error
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  function pickFile(f) {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Ce fichier n\u2019est pas une image. Choisis un JPG ou PNG.')
      return
    }
    setError('')
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  async function runScan() {
    if (!file) {
      setError('Ajoute une photo du produit avant de lancer le scan.')
      return
    }
    setStatus('scanning')
    setError('')
    try {
      const result = await uploadImage(file)
      onScanned(result, previewUrl)
      setFile(null)
      setPreviewUrl(null)
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setError(e.message || 'Le scan a échoué. Vérifie que le backend et ia-service tournent bien.')
    }
  }

  return (
    <div className="fade-up">
      <header style={s.viewHeader}>
        <h1 className="serif" style={s.h1}>Scanner un produit</h1>
        <p style={s.sub}>Photographie une étiquette ou un bon de livraison pour l'ajouter au registre.</p>
        <span className="title-accent" />
      </header>

      <div
        className={`dropzone${dragActive ? ' active' : ''}`}
        style={{ ...s.dropzone, position: 'relative', overflow: 'hidden' }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          pickFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => status !== 'scanning' && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') inputRef.current?.click() }}
      >
        {status === 'scanning' && <div className="scan-beam" />}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => pickFile(e.target.files?.[0])}
        />

        {file ? (
          <div style={s.previewRow}>
            <div style={s.previewThumb}>
              <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>{file.name}</div>
              <div className="mono" style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 2 }}>
                {(file.size / 1024).toFixed(0)} KB
              </div>
            </div>
          </div>
        ) : (
          <div>
            <ScanIcon />
            <p style={{ marginTop: 14, color: 'var(--text-dim)' }}>
              Glisse une photo ici, ou clique pour en choisir une
            </p>
          </div>
        )}
      </div>

      {error && <p style={s.error}>{error}</p>}

      <button className="scan-btn" style={s.primaryBtn} disabled={status === 'scanning'} onClick={runScan}>
        {status === 'scanning' ? 'Analyse en cours…' : 'Lancer le scan'}
      </button>
    </div>
  )
}

const s = {
  viewHeader: { marginBottom: 32 },
  h1: { fontSize: 30, fontWeight: 600, margin: 0 },
  sub: { color: 'var(--text-dim)', marginTop: 8, fontSize: 15 },
  dropzone: { padding: '52px 24px', textAlign: 'center', cursor: 'pointer', background: 'var(--panel)' },
  previewRow: { display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' },
  previewThumb: { width: 60, height: 60, borderRadius: 10, overflow: 'hidden', background: '#000', flexShrink: 0 },
  error: { color: 'var(--red)', fontSize: 14, marginTop: 12 },
  primaryBtn: {
    marginTop: 20,
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    fontSize: 15,
    padding: '12px 26px',
    borderRadius: 10,
    cursor: 'pointer',
  },
}
