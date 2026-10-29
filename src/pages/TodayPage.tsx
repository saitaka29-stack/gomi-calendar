import { GarbageBadge } from '../components/GarbageBadge'
import { addDays, formatDate, typesOn, upcoming } from '../lib/schedule'
import type { GarbageType } from '../lib/types'

function DayCard({ label, date, types }: { label: string; date: Date; types: GarbageType[] }) {
  return (
    <section className={`card day-card${types.length === 0 ? ' none' : ''}`}>
      <h2>
        {label}
        <span className="sub">{formatDate(date)}</span>
      </h2>
      {types.length === 0 ? (
        <p className="nothing">収集なし</p>
      ) : (
        <ul className="day-types">
          {types.map((t) => (
            <li key={t.id}>
              <GarbageBadge garbage={t} large />
              {t.note && <span className="note">{t.note}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

type Props = { today: Date; types: GarbageType[]; onStartTemplate: () => void }

export function TodayPage({ today, types, onStartTemplate }: Props) {

  if (types.length === 0) {
    return (
      <section className="card welcome">
        <h2>はじめに、ゴミ出しのルールを登録しましょう</h2>
        <p className="hint">一度登録すれば、次からは開くだけで今日と明日のゴミが分かります。</p>
        <div className="actions">
          <button type="button" className="primary" onClick={onStartTemplate}>
            よくある例から始める
          </button>
          <a className="button" href="#settings">
            自分で登録する
          </a>
        </div>
        <p className="hint small">よくある例は、あとから設定画面で地域のルールに合わせて直せます。</p>
      </section>
    )
  }

  const tomorrow = addDays(today, 1)
  return (
    <>
      <div className="day-cards">
        <DayCard label="今日" date={today} types={typesOn(types, today)} />
        <DayCard label="明日" date={tomorrow} types={typesOn(types, tomorrow)} />
      </div>
      <section className="card">
        <h2>2 週間の予定</h2>
        <ol className="schedule">
          {upcoming(types, today).map(({ date, types: dayTypes }, i) => (
            <li key={date.getTime()} className={i === 0 ? 'is-today' : undefined}>
              <span className={`date wd-${date.getDay()}`}>{formatDate(date)}</span>
              <span className="chips">
                {dayTypes.length === 0 ? (
                  <span className="sub">—</span>
                ) : (
                  dayTypes.map((t) => <GarbageBadge key={t.id} garbage={t} />)
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
