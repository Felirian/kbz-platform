import Link from 'next/link'
import { Suspense } from 'react'
import { Breadcrumbs } from '@/features/breadcrumbs'
import { ArticleNav } from '@/widgets/ArticleNav'
import { WikiNav, WikiNavSkeleton } from '@/widgets/WikiNav'
import { wikiSource } from './_source'
import s from './[...slug]/wikiPage.module.scss'

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={s.header}>
        <Link href="/">Home</Link>
        <Breadcrumbs />
      </header>

      <main className={s.wikiPage}>
        <Suspense fallback={<WikiNavSkeleton title="Документация" />}>
          <WikiNav source={wikiSource} />
        </Suspense>
        {children}
        <ArticleNav />
      </main>
    </>
  )
}
