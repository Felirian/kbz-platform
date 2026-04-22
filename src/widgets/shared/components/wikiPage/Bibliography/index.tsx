import { getMdEntries } from "@/utils/mdRouterParcer";
import EntryList from "@/widgets/shared/components/wikiPage/Bibliography/EntryList";
import s from "@/widgets/shared/components/wikiPage/Bibliography/Bibliography.module.scss";

export default async function Bibliography() {
  const entries = await getMdEntries()

  if (entries.length === 0) return <>No entries</>

  return (
    <div className={s.bibliography}>
      <h3>Bibliography:</h3>
      <EntryList entries={entries} />
    </div>
  );
}
