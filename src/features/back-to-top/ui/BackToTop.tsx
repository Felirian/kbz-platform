'use client'

import s from './BackToTop.module.scss'

export function BackToTop() {
  const handleClick = () => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button type="button" className={s.btn} onClick={handleClick} aria-label="Вернуться наверх">
      <span className={s.icon} aria-hidden="true">
        ↑
      </span>
    </button>
  )
}
