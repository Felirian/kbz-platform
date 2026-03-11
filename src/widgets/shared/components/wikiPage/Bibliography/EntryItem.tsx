'use client'

import { MdEntry } from "@/utils/mdRouterParcer";
import Link from "next/link";
import { useBibliographyStore } from "@/store/useBibliographyStore";
import s from "@/widgets/shared/components/wikiPage/Bibliography/Bibliography.module.scss";
import EntryList from "@/widgets/shared/components/wikiPage/Bibliography/EntryList";
import dynamic from "next/dynamic";

interface EntryItemProps {
  entry: MdEntry,
  depth: number,
  itemKey: string,
}

function EntryItemInner({ entry, depth, itemKey }: EntryItemProps) {
  const toggle = useBibliographyStore((s) => s.toggle)
  const isOpen = useBibliographyStore((s) => s.isOpen(itemKey))
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
          <Link href={`/wiki/${entry.slug}`} className={s.item__link}>
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
          <EntryList entries={entry.children!} depth={depth + 1} keyPrefix={itemKey} />
        </div>
      )}
    </li>
  )
}

const EntryItem = dynamic(() => Promise.resolve(EntryItemInner), { ssr: false })

export default EntryItem