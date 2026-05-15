import { ArticleControls } from '@/widgets/ArticleControls'
import { ArticleSkeleton } from '@/widgets/WikiArticle'
import s from './wikiPage.module.scss'

export default function Loading() {
  return (
    <div className={s.articleWrapper}>
      <ArticleControls />
      <ArticleSkeleton className={s.content} />
    </div>
  )
}
