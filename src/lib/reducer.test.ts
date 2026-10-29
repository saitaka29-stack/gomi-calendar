import { describe, expect, it } from 'vitest'
import { reducer } from './reducer'
import { emptyStore, type GarbageType } from './types'

const g = (id: string): GarbageType => ({ id, name: id, color: 'red', note: '', rule: { weekdays: [1], weeks: [] } })

describe('reducer', () => {
  it('追加・削除・テンプレート適用', () => {
    let s = reducer(emptyStore(), { type: 'addType', garbage: g('a') })
    s = reducer(s, { type: 'addType', garbage: g('b') })
    expect(s.types.map((t) => t.id)).toEqual(['a', 'b'])
    s = reducer(s, { type: 'removeType', id: 'a' })
    expect(s.types.map((t) => t.id)).toEqual(['b'])
    s = reducer(s, { type: 'applyTemplate', types: [g('x'), g('y')] })
    expect(s.types.map((t) => t.id)).toEqual(['x', 'y'])
  })
})
