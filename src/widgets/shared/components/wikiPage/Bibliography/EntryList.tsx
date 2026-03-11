import React from "react";
import {MdEntry} from "@/utils/mdRouterParcer";
import s from "@/widgets/shared/components/wikiPage/Bibliography/Bibliography.module.scss";
import EntryItem from "@/widgets/shared/components/wikiPage/Bibliography/EntryItem";

interface EntryListProps extends React.HTMLAttributes<HTMLUListElement> {
  entries: MdEntry[],
  depth?: number
  keyPrefix?: string
}

function EntryList({ entries ,depth = 0, keyPrefix = '', ...props}: EntryListProps) {

  return (
    <ul className={s.list} {...props}>
      {entries.map((entry) => {
        const itemKey = keyPrefix ? `${keyPrefix}__${entry.name}` : entry.name
        return (
          <EntryItem key={itemKey} entry={entry} depth={depth} itemKey={itemKey} />
        )
      })}
    </ul>
  );
}

export default EntryList;