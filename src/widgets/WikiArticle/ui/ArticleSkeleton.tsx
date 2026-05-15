import s from './ArticleSkeleton.module.scss'

interface ArticleSkeletonProps {
  className?: string
  banner?: {
    title: string
    text: string
  }
}

export function ArticleSkeleton({ className, banner }: ArticleSkeletonProps) {
  return (
    <div className={`${s.skeleton} ${className ?? ''}`} aria-busy="true" aria-live="polite">
      {banner && (
        <div className={s.banner} role="status">
          <span className={s.bannerTitle}>{banner.title}</span>
          <span className={s.bannerText}>{banner.text}</span>
        </div>
      )}

      <div className={`${s.row} ${s.heading}`} />
      <div className={`${s.row} ${s.long}`} />
      <div className={`${s.row} ${s.long}`} />
      <div className={`${s.row} ${s.medium}`} />
      <div className={`${s.row} ${s.short}`} />

      <div className={`${s.row} ${s.heading}`} style={{ width: '30%' }} />
      <div className={`${s.row} ${s.long}`} />
      <div className={`${s.row} ${s.medium}`} />
      <div className={`${s.row} ${s.block}`} />
      <div className={`${s.row} ${s.long}`} />
      <div className={`${s.row} ${s.short}`} />
    </div>
  )
}
