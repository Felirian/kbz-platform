import { BackToTop } from '@/features/back-to-top'
import { ContentWidthToggle } from '@/features/content-width-toggle'
import { FontSizeToggle } from '@/features/font-size-toggle'
import { LineHeightToggle } from '@/features/line-height-toggle'
import s from './ArticleControls.module.scss'

interface ArticleControlsProps {
  className?: string
}

export function ArticleControls({ className }: ArticleControlsProps) {
  return (
    <section className={`${s.controls} ${className ?? ''}`} aria-label="Настройки статьи">
      <span className={s.title}>Настройки статьи</span>
      <FontSizeToggle />
      <LineHeightToggle />
      <ContentWidthToggle />
      <BackToTop />
    </section>
  )
}
