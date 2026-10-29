import { afterEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY, loadStore, parseStore, saveStore } from './storage'
import type { Store } from './types'

const store: Store = {
  version: 1,
  types: [{ id: 'a', name: '燃えるゴミ', color: 'red', note: '朝8時', rule: { weekdays: [1, 4], weeks: [] } }],
}

function mockLocalStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('storage', () => {
  it('保存したものを読み戻せる', () => {
    mockLocalStorage()
    saveStore(store)
    expect(loadStore()).toEqual(store)
  })
  it('壊れたデータ・不正な値なら空で始める', () => {
    mockLocalStorage({ [STORAGE_KEY]: '{broken' })
    expect(loadStore()).toEqual({ version: 1, types: [] })
    expect(parseStore({ ...store, types: [{ ...store.types[0], color: 'pink' }] })).toBeNull()
    expect(parseStore({ ...store, types: [{ ...store.types[0], rule: { weekdays: [7], weeks: [] } }] })).toBeNull()
    expect(parseStore({ ...store, types: [{ ...store.types[0], rule: { weekdays: [1], weeks: [6] } }] })).toBeNull()
  })
})
