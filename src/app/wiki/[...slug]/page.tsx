import { notFound } from 'next/navigation'
import Link from 'next/link'
import {getMdContent, MdContent} from "@/utils/mdRouterParcer";
import MarkDownParcer from "@/widgets/shared/components/markDownParcer";
import s from './wikiPage.module.scss';
import Breadcrumbs from "@/widgets/shared/components/Breadcrumbs";
import Bibliography from "@/widgets/shared/components/Bibliography";
import {Metadata} from "next";

interface PageProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const content = await getMdContent(slug)

  if (!content) {
    return { title: 'Not Found' }
  }

  return {
    title: `${content.title} — kbz-test`,
  }
}


export default async function MdPage({ params }: PageProps) {
  const { slug } = await params

  const content = await getMdContent(slug)
  console.log(content);
  if (!content) return notFound()

  return (
    <>
      <header >
        <Link href="/public">Home</Link>
        <Breadcrumbs currentSlug={slug}/>
      </header>
      <main className={s.wikiPage}>
        <Bibliography currentSlug={slug}/>
        <div className={s.meta}>
          {content.date && <span>{new Date(content.date).toLocaleDateString('ru-RU')}</span>}
          {content.date && content.author && <span className={s.metaDot} />}
          {content.author && <span>{content.author}</span>}
        </div>
        <MarkDownParcer
          className={s.content}
          text={content.contentHtml}
        />
      </main>
    </>
  )
}