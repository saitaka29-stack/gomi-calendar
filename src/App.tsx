import { useEffect, useReducer } from 'react'
import { useHashView, useToday } from './hooks'
import { reducer } from './lib/reducer'
import { formatDate } from './lib/schedule'
import { loadStore, saveStore } from './lib/storage'
import { TEMPLATES } from './lib/templates'
import { SettingsPage } from './pages/SettingsPage'
import { TodayPage } from './pages/TodayPage'

export default function App() {
  const [store, dispatch] = useReducer(reducer, undefined, loadStore)
  const view = useHashView()
  const today = useToday()

  useEffect(() => saveStore(store), [store])

  const applyTemplate = () => {
    if (store.types.length > 0 && !confirm('登録しているゴミを、よくある例で置き換えます。よろしいですか？')) return
    dispatch({ type: 'applyTemplate', types: TEMPLATES.map((t) => ({ ...t, id: crypto.randomUUID() })) })
  }

  return (
    <main className="container">
      <header className="app-header">
        {view === 'settings' ? (
          <>
            <a href="#" className="back">
              ← 戻る
            </a>
            <h1>ルール設定</h1>
          </>
        ) : (
          <>
            <div>
              <h1>ゴミ出しカレンダー</h1>
              <p className="sub">{formatDate(today)}</p>
            </div>
            <a href="#settings" className="settings-link">
              ⚙ 設定
            </a>
          </>
        )}
      </header>
      {view === 'settings' ? (
        <SettingsPage types={store.types} dispatch={dispatch} onApplyTemplate={applyTemplate} />
      ) : (
        <TodayPage today={today} types={store.types} onStartTemplate={applyTemplate} />
      )}
      <footer className="app-footer">データはこの端末のブラウザ内にのみ保存されます</footer>
    </main>
  )
}
