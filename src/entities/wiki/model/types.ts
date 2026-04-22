export interface WikiSource {
  owner: string
  repo: string
  branch?: string
  root?: string
}

export interface MdEntry {
  name: string
  slug?: string
  children?: MdEntry[]
}

export interface MdContent {
  title: string
  date?: string
  author?: string
  contentHtml: string
}
