import { describe, expect, it } from 'vitest'
import { addDays, describeRule, formatDate, matches, nthWeek, typesOn, upcoming } from './schedule'
import type { GarbageType } from './types'

const d = (m: number, day: number) => new Date(2026, m - 1, day)

const burnable: GarbageType = { id: 'a', name: '燃える', color: 'red', note: '', rule: { weekdays: [1, 4], weeks: [] } }
const nonBurnable: GarbageType = { id: 'b', name: '燃えない', color: 'gray', note: '', rule: { weekdays: [5], weeks: [2, 4] } }

describe('nthWeek', () => {
  it('日付から「その月の何回目の曜日か」を出す', () => {
    expect(nthWeek(d(11, 1))).toBe(1)
    expect(nthWeek(d(11, 7))).toBe(1)
    expect(nthWeek(d(11, 8))).toBe(2)
    expect(nthWeek(d(11, 29))).toBe(5)
  })
})

describe('matches', () => {
  // 2026 年 11 月の金曜は 6・13・20・27 日
  it('第2・第4 金曜だけに一致する', () => {
    expect(matches(nonBurnable.rule, d(11, 6))).toBe(false)
    expect(matches(nonBurnable.rule, d(11, 13))).toBe(true)
    expect(matches(nonBurnable.rule, d(11, 20))).toBe(false)
    expect(matches(nonBurnable.rule, d(11, 27))).toBe(true)
  })
  it('第何週の指定がなければ毎週', () => {
    expect(matches(burnable.rule, d(11, 2))).toBe(true) // 月
    expect(matches(burnable.rule, d(11, 5))).toBe(true) // 木
    expect(matches(burnable.rule, d(11, 3))).toBe(false) // 火
  })
  it('曜日が未設定なら一致しない', () => {
    expect(matches({ weekdays: [], weeks: [] }, d(11, 2))).toBe(false)
  })
})

describe('typesOn / upcoming', () => {
  it('その日に出すゴミを返す', () => {
    expect(typesOn([burnable, nonBurnable], d(11, 13)).map((t) => t.id)).toEqual(['b'])
    expect(typesOn([burnable, nonBurnable], d(11, 14))).toEqual([])
  })
  it('14 日分をローカル日付で月またぎも含めて返す', () => {
    const list = upcoming([burnable], d(10, 29))
    expect(list).toHaveLength(14)
    expect(formatDate(list[0].date)).toBe('10/29（木）')
    expect(formatDate(list[3].date)).toBe('11/1（日）')
    expect(formatDate(list[13].date)).toBe('11/11（水）')
    expect(list.filter((x) => x.types.length > 0).map((x) => formatDate(x.date))).toEqual([
      '10/29（木）',
      '11/2（月）',
      '11/5（木）',
      '11/9（月）',
    ])
  })
  it('addDays は時刻を 0 時にそろえる', () => {
    const late = new Date(2026, 9, 31, 23, 59)
    const next = addDays(late, 1)
    expect([next.getMonth(), next.getDate(), next.getHours()]).toEqual([10, 1, 0])
  })
})

describe('describeRule', () => {
  it('日本語で説明する（曜日は日曜始まりの順）', () => {
    expect(describeRule({ weekdays: [4, 1], weeks: [] })).toBe('毎週 月・木')
    expect(describeRule({ weekdays: [5], weeks: [4, 2] })).toBe('第2・第4 金')
    expect(describeRule({ weekdays: [], weeks: [] })).toBe('（曜日未設定）')
  })
})
