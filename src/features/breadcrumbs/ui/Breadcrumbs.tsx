import Link from 'next/link'
import s from './Breadcrumbs.module.scss'

interface BreadcrumbsProps {
  currentSlug: string[]
  basePath?: string
}

const sliceSlug = (slug: string[], index: number) => slug.slice(0, index + 1).join('/')

export function Breadcrumbs({ currentSlug, basePath = '/wiki' }: BreadcrumbsProps) {
  return (
    <nav className={s.crumbs} aria-label="breadcrumbs">
      {currentSlug.map((item, index) => (
        <Link
          key={sliceSlug(currentSlug, index)}
          className={s.link}
          href={`${basePath}/${sliceSlug(currentSlug, index)}`}
        >
          /{item}
        </Link>
      ))}
    </nav>
  )
}
