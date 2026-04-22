import { WikiNav } from '@/widgets/WikiNav'
import { wikiSource } from './_source'
import s from './[...slug]/wikiPage.module.scss'

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={s.wikiPage}>
      <WikiNav source={wikiSource} />
      {children}
    </div>
  )
}
