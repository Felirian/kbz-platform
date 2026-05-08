import { getMdEntries, WikiFetchError, type WikiSource } from '@/entities/wiki'
import EntryList from './EntryList'
import s from './WikiNav.module.scss'

interface WikiNavProps {
  source: WikiSource
  basePath?: string
  title?: string
}

export async function WikiNav({ source, basePath = '/wiki', title }: WikiNavProps) {
  let entries: Awaited<ReturnType<typeof getMdEntries>>
  try {
    entries = await getMdEntries(source)
  } catch (err) {
    if (err instanceof WikiFetchError) {
      return (
        <div className={s.nav}>
          {title && <h3>{title}</h3>}
          <p>
            {err.kind === 'rate-limit'
              ? 'Превышен лимит запросов к GitHub. Попробуйте позже.'
              : 'Не удалось загрузить навигацию.'}
          </p>
        </div>
      )
    }
    throw err
  }

  if (entries.length === 0) return <>No entries</>

  return (
    <div className={s.nav}>
      <h4>Документация</h4>
      {title && <h3>{title}</h3>}
      <EntryList entries={entries} basePath={basePath} />
    </div>
  )
}
