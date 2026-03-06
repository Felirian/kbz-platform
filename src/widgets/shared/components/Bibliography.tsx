import React from 'react';
import path from "path";
import {getMdEntries, MdEntry} from "@/utils/mdRouterParcer";
import Link from "next/link";

interface Props {
  currentSlug: string[]
}

interface EntryListProps extends React.HTMLAttributes<HTMLUListElement> {
  entries: MdEntry[]
}

function EntryList({ entries , ...props}: EntryListProps) {
  return (
    <ul {...props}>
      {entries.map((entry, index) => (
        <li key={ entry.name}>
          {entry.slug ? (
            <Link href={`/wiki/${entry.slug || ''}`}>
              {entry.name}
            </Link>
          ) : (
            entry.name
          )}

          {entry.children && entry.children.length > 0 && (
            <EntryList entries={entry.children} style={{ marginLeft: `${index * 20}px` }} />
          )}
        </li>
      ))}
    </ul>
  );
}

const Bibliography = ({currentSlug}: Props) => {

  const entries = getMdEntries()

  if (entries.length === 0) return (<>No entries</>)

  return (
    <div>
      <h3>Bibliography: авыаы</h3>
      <EntryList entries={entries} />
    </div>
  );
};

export default Bibliography;