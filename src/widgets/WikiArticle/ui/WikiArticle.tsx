import { notFound } from 'next/navigation'
import { getMdContent, type WikiSource } from '@/entities/wiki'
import { MarkdownRenderer } from '@/shared/ui/MarkdownRenderer'

interface WikiArticleProps {
  source: WikiSource
  slug: string[]
  className?: string
}

export async function WikiArticle({ source, slug, className }: WikiArticleProps) {
  const content = await getMdContent(source, slug)
  if (!content) notFound()

  return <MarkdownRenderer className={className} text={content.contentHtml} />
}
