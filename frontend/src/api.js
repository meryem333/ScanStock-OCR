// Set to true to test the UI without the backend/database (in-memory, fake data).
export const USE_MOCK = false

const API_BASE = 'http://127.0.0.1:8000/api'

let mockDb = []
let mockIdCounter = 
function fakeExtraction(fileName) {
  return {
    status: 'success',
    confidence: Math.round((0.6 + Math.random() * 0.4) * 100) / 100,
    products: [
      { name: 'Fond de teint HUDA Beauty', quantity: 8, unitPrice: 42.5, rawOcrText: 'Fond de teint HUDA Beauty 8 42.50' },
      { name: 'Gloss Bomb Fenty', quantity: 15, unitPrice: 21.0, rawOcrText: 'Gloss Bomb Fenty 15 21.00' },
    ],
    warnings: [`Ligne non reconnue, ignorée dans "${fileName}"`],
  }
}

export async function uploadImage(file) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    const extraction = fakeExtraction(file.name)
    const result = {
      id: mockIdCounter++,
      fileName: file.name,
      status: extraction.status,
      confidence: extraction.confidence,
      products: extraction.products,
      warnings: extraction.warnings,
      scannedAtUtc: new Date().toISOString(),
    }
    mockDb = [result, ...mockDb]
    return result
  }

  const formData = new FormData()
  formData.append('file', file) // matches ia-service's field name, proxied by the backend
  const res = await fetch(`${API_BASE}/scan/upload`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export async function getResults() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return mockDb
  }

  const res = await fetch(`${API_BASE}/scan/results`)
  if (!res.ok) throw new Error('Failed to load results')
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Identifiants incorrects')
  const data = await res.json()
  localStorage.setItem('scanstock-token', data.token)
  return data.token
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error("Erreur lors de l'inscription")
  return res.json()
}

export function logout() {
  localStorage.removeItem('scanstock-token')
}

export function getToken() {
  return localStorage.getItem('scanstock-token')
}