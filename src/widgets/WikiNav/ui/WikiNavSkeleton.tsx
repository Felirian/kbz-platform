import s from './WikiNav.module.scss'

interface WikiNavSkeletonProps {
  title?: string
}

export function WikiNavSkeleton({ title }: WikiNavSkeletonProps) {
  return (
    <div className={s.nav} aria-busy="true" aria-live="polite">
      {title && <h4>{title}</h4>}
      <div className={s.skeleton}>
        <div className={`${s.skeletonRow} ${s.title}`} />
        <div className={`${s.skeletonRow} ${s.l1}`} />
        <div className={`${s.skeletonRow} ${s.l2}`} />
        <div className={`${s.skeletonRow} ${s.l2}`} />
        <div className={`${s.skeletonRow} ${s.l1}`} />
        <div className={`${s.skeletonRow} ${s.l3}`} />
        <div className={`${s.skeletonRow} ${s.l2}`} />
        <div className={`${s.skeletonRow} ${s.l1}`} />
        <div className={`${s.skeletonRow} ${s.l3}`} />
      </div>
    </div>
  )
}
