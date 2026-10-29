import type { GarbageType, Rule } from './types'

export const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

/** その月の何回目のその曜日か（1〜5）。カレンダーの行ではない */
export const nthWeek = (date: Date) => Math.ceil(date.getDate() / 7)

export function matches(rule: Rule, date: Date): boolean {
  if (!rule.weekdays.includes(date.getDay())) return false
  return rule.weeks.length === 0 || rule.weeks.includes(nthWeek(date))
}

export const typesOn = (types: GarbageType[], date: Date) => types.filter((t) => matches(t.rule, date))

/** ローカル日付で days 日後（時刻は 0 時にそろえる） */
export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

export function upcoming(types: GarbageType[], from: Date, days = 14) {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(from, i)
    return { date, types: typesOn(types, date) }
  })
}

export function describeRule(rule: Rule): string {
  if (rule.weekdays.length === 0) return '（曜日未設定）'
  const days = [...rule.weekdays].sort((a, b) => a - b).map((d) => WEEKDAY_LABELS[d]).join('・')
  if (rule.weeks.length === 0) return `毎週 ${days}`
  const weeks = [...rule.weeks].sort((a, b) => a - b).map((w) => `第${w}`).join('・')
  return `${weeks} ${days}`
}

export const formatDate = (date: Date) =>
  `${date.getMonth() + 1}/${date.getDate()}（${WEEKDAY_LABELS[date.getDay()]}）`
