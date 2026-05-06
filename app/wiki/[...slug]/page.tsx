import type { Metadata } from 'next'
import Link from 'next/link'
import { getMdContent } from '@/entities/wiki'
import { Breadcrumbs } from '@/features/breadcrumbs'
import { WikiArticle } from '@/widgets/WikiArticle'
import { wikiSource } from '../_source'
import s from './wikiPage.module.scss'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const content = await getMdContent(wikiSource, slug)
    if (!content) return { title: 'Not Found' }
    return { title: `${content.title} — kbz-test` }
  } catch {
    return { title: 'kbz-test' }
  }
}

export default async function MdPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <>
      <header>
        <Link href="/">Home</Link>
        <Breadcrumbs currentSlug={slug} />
      </header>
      <main>
        <WikiArticle source={wikiSource} slug={slug} className={s.content} />
      </main>
    </>
  )
}
