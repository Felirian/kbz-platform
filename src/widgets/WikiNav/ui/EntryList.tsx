import React from 'react'
import type { MdEntry } from '@/entities/wiki'
import EntryItem from './EntryItem'
import s from './WikiNav.module.scss'

interface EntryListProps extends React.HTMLAttributes<HTMLUListElement> {
  entries: MdEntry[]
  depth?: number
  keyPrefix?: string
  basePath: string
}

export default function EntryList({ entries, depth = 0, keyPrefix = '', basePath, ...props }: EntryListProps) {
  return (
    <ul className={s.list} {...props}>
      {entries.map((entry) => {
        const itemKey = keyPrefix ? `${keyPrefix}__${entry.name}` : entry.name
        return <EntryItem key={itemKey} entry={entry} depth={depth} itemKey={itemKey} basePath={basePath} />
      })}
    </ul>
  )
}
