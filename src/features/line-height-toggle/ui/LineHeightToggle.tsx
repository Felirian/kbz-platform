'use client'

import { type LineHeight, useLineHeightStore } from '../model/store'
import s from './LineHeightToggle.module.scss'

const OPTIONS: { value: LineHeight; label: string }[] = [
  { value: 'compact', label: '1×' },
  { value: 'normal', label: '1.5×' },
  { value: 'relaxed', label: '2×' },
]

export function LineHeightToggle() {
  const { lineHeight, setLineHeight } = useLineHeightStore()

  return (
    <div className={s.bar}>
      <span className={s.label}>Интервал</span>
      <div className={s.group} role="group" aria-label="Межстрочный интервал">
        {OPTIONS.map(({ value, label }) => (
          <button
            type="button"
            key={value}
            className={`${s.btn} ${lineHeight === value ? s.active : ''}`}
            onClick={() => setLineHeight(value)}
            aria-pressed={lineHeight === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
