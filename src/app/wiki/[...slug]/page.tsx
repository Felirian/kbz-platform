import { notFound } from 'next/navigation'
import Link from 'next/link'
import {getMdContent, MdContent} from "@/utils/mdRouterParcer";
import MarkDownParcer from "@/utils/markDownParcer";
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

  // console.log(content);

  if (!content) return notFound()

  return (
    <>
      <header >
        <Link href="/public">Home</Link>
        <Breadcrumbs currentSlug={slug}/>
      </header>
      <main>
        <Bibliography currentSlug={slug}/>
        <MarkDownParcer
          className={s.articleContent}
          text={content.contentHtml}
        />
      </main>
    </>
  )
}