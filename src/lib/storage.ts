import { COLOR_KEYS, emptyStore, type GarbageType, type Store } from './types'

export const STORAGE_KEY = 'gomi-calendar:v1'

const isIntArray = (v: unknown, min: number, max: number) =>
  Array.isArray(v) && v.every((x) => Number.isInteger(x) && x >= min && x <= max)

function isGarbageType(v: unknown): v is GarbageType {
  if (typeof v !== 'object' || v === null) return false
  const t = v as Record<string, unknown>
  const rule = t.rule as Record<string, unknown> | null
  return (
    typeof t.id === 'string' &&
    typeof t.name === 'string' &&
    typeof t.note === 'string' &&
    COLOR_KEYS.includes(t.color as GarbageType['color']) &&
    typeof rule === 'object' &&
    rule !== null &&
    isIntArray(rule.weekdays, 0, 6) &&
    isIntArray(rule.weeks, 1, 5)
  )
}

export function parseStore(v: unknown): Store | null {
  if (typeof v !== 'object' || v === null) return null
  const s = v as Record<string, unknown>
  if (s.version !== 1 || !Array.isArray(s.types) || !s.types.every(isGarbageType)) return null
  return { version: 1, types: s.types }
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return (raw && parseStore(JSON.parse(raw))) || emptyStore()
  } catch {
    return emptyStore()
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // プライベートモード等で保存できなくても表示は続ける
  }
}
