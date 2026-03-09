import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';

const mdDir = path.join(process.cwd(),'src','_app', 'mockData', 'wiki')

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

export async function getMdContent(slug: string[]): Promise<MdContent | null>{
  const filePath = path.join(mdDir, ...slug) + '.md'

  const indexFilePath = path.join(mdDir, ...slug, 'index.md')

  let resolvedPath: string

  if (fs.existsSync(filePath)) {
    resolvedPath = filePath
  } else if (fs.existsSync(indexFilePath)) {
    resolvedPath = indexFilePath
  } else {
    console.error('Could not find file: ' + filePath + ' or ' + indexFilePath)
    return null
  }

  const fileContents = fs.readFileSync(resolvedPath, 'utf8')
  const {data, content} = matter(fileContents)

  return {
    title: data.title,
    date: data?.date || undefined,
    author: data?.author || undefined,
    contentHtml: content
  }
}

export function getMdEntries(currentSlug: string[] = ['']): MdEntry[] {
  let res: MdEntry[] = [];

  const currentDir = path.join(mdDir, ...currentSlug)
  if (!fs.existsSync(currentDir) || !fs.statSync(currentDir).isDirectory()) {
    console.error('no entries');
    return []
  }

  const entries = fs.readdirSync(currentDir, { withFileTypes: true })

  entries.map(entry => {
    if (entry.isDirectory()) {
      const children = getMdEntries([...currentSlug, entry.name])
      if (children.length === 0) return
      res.push({
        name: entry.name,
        children: children
      })
    } else {
      res.push({
        name: entry.name.replace('.md', ''),
        slug: currentSlug.join('/') + '/' + entry.name.replace('.md', '')
      })
    }
  })
  return res
}