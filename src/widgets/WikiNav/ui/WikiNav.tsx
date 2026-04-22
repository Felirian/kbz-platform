import { getMdEntries, type WikiSource } from '@/entities/wiki'
import EntryList from './EntryList'
import s from './WikiNav.module.scss'

interface WikiNavProps {
  source: WikiSource
  basePath?: string
  title?: string
}

export async function WikiNav({ source, basePath = '/wiki', title }: WikiNavProps) {
  const entries = await getMdEntries(source)

  if (entries.length === 0) return <>No entries</>

  return (
    <div className={s.nav}>
      {title && <h3>{title}</h3>}
      <EntryList entries={entries} basePath={basePath} />
    </div>
  )
}
