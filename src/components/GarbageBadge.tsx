import type { GarbageType } from '../lib/types'

export function GarbageBadge({ garbage, large = false }: { garbage: GarbageType; large?: boolean }) {
  return (
    <span className={`badge c-${garbage.color}${large ? ' large' : ''}`}>
      <span className="dot" aria-hidden="true" />
      {garbage.name}
    </span>
  )
}
