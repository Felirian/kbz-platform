'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { MdEntry } from '@/entities/wiki'
import { useWikiNavStore } from '../model/store'
import s from './WikiNav.module.scss'
import EntryList from './EntryList'

interface EntryItemProps {
  entry: MdEntry
  depth: number
  itemKey: string
  basePath: string
}

function EntryItemInner({ entry, depth, itemKey, basePath }: EntryItemProps) {
  const toggle = useWikiNavStore((s) => s.toggle)
  const isOpen = useWikiNavStore((s) => s.isOpen(itemKey))
  const hasChildren = entry.children && entry.children.length > 0

  return (
    <li className={s.item}>
      <div className={s.item__row}>
        {hasChildren && (
          <button
            className={`${s.item__toggle} ${isOpen ? s.item__toggle_open : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggle(itemKey)
            }}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            ▶
          </button>
        )}

        {entry.slug ? (
          <Link href={`${basePath}/${entry.slug}`} className={s.item__link}>
            {entry.name}
          </Link>
        ) : (
          <span
            className={`${s.item__label} ${hasChildren ? s.item__label_clickable : ''}`}
            onClick={hasChildren ? (e) => { e.stopPropagation(); toggle(itemKey) } : undefined}
          >
            {entry.name}
          </span>
        )}
      </div>

      {hasChildren && (
        <div className={`${s.item__children} ${isOpen ? s.item__children_open : ''}`}>
          <EntryList entries={entry.children!} depth={depth + 1} keyPrefix={itemKey} basePath={basePath} />
        </div>
      )}
    </li>
  )
}

const EntryItem = dynamic(() => Promise.resolve(EntryItemInner), { ssr: false })

export default EntryItem
