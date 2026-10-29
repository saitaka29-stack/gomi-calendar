import type { GarbageType, Store } from './types'

export type Action =
  | { type: 'addType'; garbage: GarbageType }
  | { type: 'removeType'; id: string }
  | { type: 'applyTemplate'; types: GarbageType[] }

export function reducer(store: Store, action: Action): Store {
  switch (action.type) {
    case 'addType':
      return { ...store, types: [...store.types, action.garbage] }
    case 'removeType':
      return { ...store, types: store.types.filter((t) => t.id !== action.id) }
    case 'applyTemplate':
      return { ...store, types: action.types }
  }
}
