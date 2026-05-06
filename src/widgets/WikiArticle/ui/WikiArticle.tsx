import { notFound } from 'next/navigation'
import { getMdContent, WikiFetchError, type WikiSource } from '@/entities/wiki'
import { MarkdownRenderer } from '@/shared/ui/MarkdownRenderer'
import s from './WikiArticle.module.scss'

interface WikiArticleProps {
  source: WikiSource
  slug: string[]
  className?: string
}

export async function WikiArticle({ source, slug, className }: WikiArticleProps) {
  let content: Awaited<ReturnType<typeof getMdContent>>
  try {
    content = await getMdContent(source, slug)
  } catch (err) {
    if (err instanceof WikiFetchError) {
      return <FetchErrorFallback error={err} className={className} />
    }
    throw err
  }

  if (!content) notFound()
  return <MarkdownRenderer className={className} text={content.contentHtml} />
}

function FetchErrorFallback({ error, className }: { error: WikiFetchError; className?: string }) {
  const isRateLimit = error.kind === 'rate-limit'
  return (
    <div className={`${s.fallback} ${className ?? ''}`}>
      <h2 className={s.title}>
        {isRateLimit ? 'Контент временно недоступен' : 'Не удалось загрузить статью'}
      </h2>
      <p className={s.text}>
        {isRateLimit
          ? 'Превышен лимит запросов к GitHub API. Попробуйте обновить страницу через несколько минут.'
          : 'Произошла ошибка при обращении к GitHub API. Попробуйте позже.'}
      </p>
    </div>
  )
}
