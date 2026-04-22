import s from './[...slug]/wikiPage.module.scss'
import Bibliography from "@/widgets/shared/components/wikiPage/Bibliography";

export default function WikiLayout({children}: { children: React.ReactNode }) {
  return (
    <div className={s.wikiPage}>
      <Bibliography/>
      {children}
    </div>
  );
}