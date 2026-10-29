import type { GarbageType } from './types'

type Template = Omit<GarbageType, 'id'>

/** よくある例。地域によって違うので、登録後に設定画面で直してもらう前提 */
export const TEMPLATES: Template[] = [
  { name: '燃えるゴミ', color: 'red', note: '朝 8 時までに', rule: { weekdays: [1, 4], weeks: [] } },
  { name: 'プラスチック', color: 'blue', note: '朝 8 時までに', rule: { weekdays: [3], weeks: [] } },
  { name: '資源（缶・びん・ペット）', color: 'green', note: '朝 8 時までに', rule: { weekdays: [2], weeks: [] } },
  { name: '燃えないゴミ', color: 'gray', note: '朝 8 時までに', rule: { weekdays: [5], weeks: [2, 4] } },
]
