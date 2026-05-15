import s from './ArticleNav.module.scss'

export function ArticleNavSkeleton() {
  return (
    <nav className={s.nav} aria-busy="true" aria-live="polite">
      <h3 className={s.title}>Оглавление</h3>
      <div className={s.skeleton}>
        <div className={`${s.skeletonRow} ${s.l1}`} />
        <div className={`${s.skeletonRow} ${s.l2}`} />
        <div className={`${s.skeletonRow} ${s.l1}`} />
        <div className={`${s.skeletonRow} ${s.l3}`} />
        <div className={`${s.skeletonRow} ${s.l2}`} />
        <div className={`${s.skeletonRow} ${s.l1}`} />
      </div>
    </nav>
  )
}
