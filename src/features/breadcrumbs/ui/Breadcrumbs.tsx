'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import s from './Breadcrumbs.module.scss'

interface BreadcrumbsProps {
  basePath?: string
}

export function Breadcrumbs({ basePath = '/wiki' }: BreadcrumbsProps) {
  const pathname = usePathname() ?? ''

  const slug = useMemo(() => {
    const stripped = pathname.startsWith(basePath)
      ? pathname.slice(basePath.length)
      : pathname
    return stripped.split('/').filter(Boolean)
  }, [pathname, basePath])

  if (slug.length === 0) return null

  return (
    <nav className={s.crumbs} aria-label="breadcrumbs">
      {slug.map((item, index) => {
        const href = `${basePath}/${slug.slice(0, index + 1).join('/')}`
        return (
          <Link key={href} className={s.link} href={href}>
            /{item}
          </Link>
        )
      })}
    </nav>
  )
}
