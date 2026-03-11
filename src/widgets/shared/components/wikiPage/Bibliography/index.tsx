import React from 'react';
import {getMdEntries, MdEntry} from "@/utils/mdRouterParcer";
import EntryList from "@/widgets/shared/components/wikiPage/Bibliography/EntryList";
import s from "@/widgets/shared/components/wikiPage/Bibliography/Bibliography.module.scss";

interface Props {
  // currentSlug: string[]
}

const Index = ({}: Props) => {
  const entries = getMdEntries()

  if (entries.length === 0) return <>No entries</>

  return (
    <div className={s.bibliography}>
      <h3>Bibliography:</h3>
      <EntryList entries={entries} />
    </div>
  );
};

export default Index;