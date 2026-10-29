export const COLOR_KEYS = ['red', 'blue', 'green', 'yellow', 'purple', 'gray'] as const
export type ColorKey = (typeof COLOR_KEYS)[number]

export type Rule = {
  /** 0=日〜6=土 */
  weekdays: number[]
  /** 空なら毎週。1〜5 は「その月の N 回目のその曜日」 */
  weeks: number[]
}

export type GarbageType = { id: string; name: string; color: ColorKey; note: string; rule: Rule }

export type Store = { version: 1; types: GarbageType[] }

export const emptyStore = (): Store => ({ version: 1, types: [] })
