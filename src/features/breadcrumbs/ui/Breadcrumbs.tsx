import Link from 'next/link'

interface BreadcrumbsProps {
  currentSlug: string[]
  basePath?: string
}

const sliceSlug = (slug: string[], index: number) => slug.slice(0, index + 1).join('/')

export function Breadcrumbs({ currentSlug, basePath = '/wiki' }: BreadcrumbsProps) {
  return (
    <div>
      {currentSlug.map((item, index) => (
        <Link key={sliceSlug(currentSlug, index)} href={`${basePath}/${sliceSlug(currentSlug, index)}`}>
          /{item}
        </Link>
      ))}
    </div>
  )
}
