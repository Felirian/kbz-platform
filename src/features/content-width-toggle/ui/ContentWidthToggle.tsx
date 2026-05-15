'use client'

import { type ContentWidth, useContentWidthStore } from '../model/store'
import s from './ContentWidthToggle.module.scss'

const OPTIONS: { value: ContentWidth; label: string }[] = [
  { value: 'narrow', label: 'Узко' },
  { value: 'wide', label: 'Средне' },
  { value: 'full', label: 'Широко' },
]

export function ContentWidthToggle() {
  const { contentWidth, setContentWidth } = useContentWidthStore()

  return (
    <div className={s.bar}>
      <span className={s.label}>Ширина</span>
      <div className={s.group} role="group" aria-label="Ширина статьи">
        {OPTIONS.map(({ value, label }) => (
          <button
            type="button"
            key={value}
            className={`${s.btn} ${contentWidth === value ? s.active : ''}`}
            onClick={() => setContentWidth(value)}
            aria-pressed={contentWidth === value}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
