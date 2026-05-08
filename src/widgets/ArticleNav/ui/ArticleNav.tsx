'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import s from './ArticleNav.module.scss'

interface Heading {
  id: string
  text: string
  level: number
}

const HEADING_SELECTOR = 'article :is(h1, h2, h3, h4, h5, h6)[id]'

export function ArticleNav() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // collect headings from DOM (re-runs when route or article changes)
  useEffect(() => {
    const collect = () => {
      const nodes = document.querySelectorAll<HTMLElement>(HEADING_SELECTOR)
      const list: Heading[] = Array.from(nodes).map((n) => ({
        id: n.id,
        text: n.textContent?.trim() ?? '',
        level: Number(n.tagName.slice(1)),
      }))
      setHeadings((prev) => {
        if (prev.length === list.length && prev.every((h, i) => h.id === list[i]?.id)) {
          return prev
        }
        return list
      })
    }

    collect()
    const observer = new MutationObserver(collect)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [pathname])

  // highlight active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => n !== null)

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className={s.nav} aria-label="Содержание статьи">
      <h3 className={s.title}>На странице</h3>
      <ul className={s.list}>
        {headings.map((h) => (
          <li key={h.id} className={s.item} data-level={h.level}>
            <a
              href={`#${h.id}`}
              className={`${s.link} ${activeId === h.id ? s.active : ''}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
