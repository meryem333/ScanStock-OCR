const STORAGE_KEY = 'scanstock-catalog'

const DEFAULT_CATALOG = [
  'Fond de teint HUDA Beauty',
  'Palette fards à paupières',
  'Gloss Bomb Fenty',
  'Rouge à lèvres Charlotte Tilbury',
  'Mascara volume Sephora',
  'Highlighter poudre or',
]

export function getCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATALOG))
      return [...DEFAULT_CATALOG]
    }
    return JSON.parse(raw)
  } catch {
    return [...DEFAULT_CATALOG]
  }
}

export function addProduct(name) {
  const trimmed = name.trim()
  if (!trimmed) return getCatalog()
  const catalog = getCatalog()
  if (!catalog.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
    catalog.push(trimmed)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  }
  return catalog
}

export function removeProduct(name) {
  const catalog = getCatalog().filter((p) => p !== name)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog))
  return catalog
}

export function isKnown(name, catalog) {
  if (!name) return false
  return catalog.some((p) => p.toLowerCase().trim() === name.toLowerCase().trim())
}
