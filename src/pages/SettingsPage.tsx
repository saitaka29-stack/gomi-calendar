import { useState, type Dispatch, type FormEvent } from 'react'
import { GarbageBadge } from '../components/GarbageBadge'
import type { Action } from '../lib/reducer'
import { WEEKDAY_LABELS, describeRule } from '../lib/schedule'
import { COLOR_KEYS, type ColorKey, type GarbageType } from '../lib/types'

const COLOR_NAMES: Record<ColorKey, string> = {
  red: '赤',
  blue: '青',
  green: '緑',
  yellow: '黄',
  purple: '紫',
  gray: '灰',
}

const toggle = (list: number[], n: number) => (list.includes(n) ? list.filter((x) => x !== n) : [...list, n])

type Props = { types: GarbageType[]; dispatch: Dispatch<Action>; onApplyTemplate: () => void }

export function SettingsPage({ types, dispatch, onApplyTemplate }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<ColorKey>('red')
  const [weekdays, setWeekdays] = useState<number[]>([])
  const [weeks, setWeeks] = useState<number[]>([])
  const [note, setNote] = useState('')
  const valid = name.trim() !== '' && weekdays.length > 0

  const add = (e: FormEvent) => {
    e.preventDefault()
    if (!valid) return
    dispatch({
      type: 'addType',
      garbage: { id: crypto.randomUUID(), name: name.trim(), color, note: note.trim(), rule: { weekdays, weeks } },
    })
    setName('')
    setWeekdays([])
    setWeeks([])
    setNote('')
  }

  const remove = (t: GarbageType) => {
    if (confirm(`「${t.name}」を削除しますか？`)) dispatch({ type: 'removeType', id: t.id })
  }

  return (
    <>
      <section className="card">
        <h2>登録しているゴミ</h2>
        {types.length === 0 ? (
          <p className="hint">まだ登録がありません。下のフォームから追加してください。</p>
        ) : (
          <ul className="type-list">
            {types.map((t) => (
              <li key={t.id}>
                <div>
                  <GarbageBadge garbage={t} />
                  <div className="sub">
                    {describeRule(t.rule)}
                    {t.note && ` ・ ${t.note}`}
                  </div>
                </div>
                <button type="button" className="ghost danger" aria-label={`${t.name}を削除`} onClick={() => remove(t)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>ゴミの種類を追加</h2>
        <form className="type-form" onSubmit={add}>
          <label>
            名前
            <input placeholder="例：燃えるゴミ" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          </label>
          <fieldset>
            <legend>色</legend>
            <div className="toggles">
              {COLOR_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`swatch c-${c}`}
                  aria-pressed={color === c}
                  aria-label={COLOR_NAMES[c]}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>曜日（複数選べます）</legend>
            <div className="toggles">
              {WEEKDAY_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`toggle wd-${i}`}
                  aria-pressed={weekdays.includes(i)}
                  onClick={() => setWeekdays((w) => toggle(w, i))}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>第何週？</legend>
            <div className="toggles">
              <button type="button" className="toggle wide" aria-pressed={weeks.length === 0} onClick={() => setWeeks([])}>
                毎週
              </button>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="toggle"
                  aria-pressed={weeks.includes(n)}
                  aria-label={`第${n}週`}
                  onClick={() => setWeeks((w) => toggle(w, n))}
                >
                  第{n}
                </button>
              ))}
            </div>
            <p className="hint small">「第2」は、その月の 2 回目のその曜日（8〜14 日）です。</p>
          </fieldset>
          <label>
            メモ（任意）
            <input placeholder="例：朝 8 時までに" value={note} maxLength={30} onChange={(e) => setNote(e.target.value)} />
          </label>
          <p className="preview">
            {valid ? (
              <>
                <GarbageBadge garbage={{ id: '', name: name.trim(), color, note, rule: { weekdays, weeks } }} />
                <span>{describeRule({ weekdays, weeks })}</span>
              </>
            ) : (
              <span className="sub">名前と曜日を入れると追加できます</span>
            )}
          </p>
          <button type="submit" className="primary" disabled={!valid}>
            追加する
          </button>
        </form>
      </section>

      <section className="card">
        <h2>よくある例</h2>
        <p className="hint">燃えるゴミ（月・木）、プラスチック（水）、資源（火）、燃えないゴミ（第2・第4 金）で登録し直します。</p>
        <button type="button" onClick={onApplyTemplate}>
          よくある例で登録し直す
        </button>
      </section>
    </>
  )
}
