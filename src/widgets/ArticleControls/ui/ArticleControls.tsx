import { FontSizeToggle } from '@/features/font-size-toggle'
import s from './ArticleControls.module.scss'

interface ArticleControlsProps {
  className?: string
}

export function ArticleControls({ className }: ArticleControlsProps) {
  return (
    <section className={`${s.controls} ${className ?? ''}`} aria-label="Настройки статьи">
      <span className={s.title}>Настройки статьи</span>
      <FontSizeToggle />
    </section>
  )
}
