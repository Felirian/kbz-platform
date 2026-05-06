'use client'

import { type FontSize, useFontSizeStore } from '../model/store'
import s from './FontSizeToggle.module.scss'

const OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'small', label: 'A−' },
  { value: 'medium', label: 'A' },
  { value: 'large', label: 'A+' },
]

export function FontSizeToggle() {
  const { fontSize, setFontSize } = useFontSizeStore()

  return (
    <div className={s.bar}>
      <span className={s.label}>Размер текста</span>
      <div className={s.group} role="group" aria-label="Размер текста">
        {OPTIONS.map(({ value, label }) => (
          <button
            type="button"
            key={value}
            className={`${s.btn} ${fontSize === value ? s.active : ''}`}
            onClick={() => setFontSize(value)}
            aria-pressed={fontSize === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
