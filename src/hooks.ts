import { useEffect, useState, useSyncExternalStore } from 'react'

export type View = 'today' | 'settings'

function subscribeHash(listener: () => void) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

/** 画面はハッシュで持つ（#settings）。ブラウザの戻るボタンでも戻れる */
export function useHashView(): View {
  return useSyncExternalStore(subscribeHash, () => (window.location.hash === '#settings' ? 'settings' : 'today'))
}

/** 今日の日付。開きっぱなしで日付が変わっても、タブに戻ったときに更新する */
export function useToday(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const update = () => {
      if (document.visibilityState === 'visible') setNow(new Date())
    }
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}
