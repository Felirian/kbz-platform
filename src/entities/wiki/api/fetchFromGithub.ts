import matter from 'gray-matter'
import type { MdContent, MdEntry, WikiSource } from '../model/types'

interface GhFile {
  type: 'file'
  name: string
  path: string
  content: string
  encoding: 'base64'
}

interface GhDirItem {
  type: 'file' | 'dir'
  name: string
  path: string
}

type GhResponse = GhFile | GhDirItem[]

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function fetchGh(source: WikiSource, relPath: string): Promise<GhResponse | null> {
  const branch = source.branch ?? 'main'
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${relPath}?ref=${branch}`

  const res = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate: 3600, tags: ['wiki', `wiki:${source.owner}/${source.repo}`] },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

function decodeBase64(content: string): string {
  return Buffer.from(content, 'base64').toString('utf8')
}

function joinPath(parts: string[]): string {
  return parts.filter(Boolean).join('/')
}

export async function getMdContent(source: WikiSource, slug: string[]): Promise<MdContent | null> {
  const base = joinPath([source.root ?? '', ...slug])

  let data = await fetchGh(source, `${base}.md`)
  if (!data) data = await fetchGh(source, joinPath([base, 'index.md']))
  if (!data || Array.isArray(data) || data.type !== 'file') return null

  const raw = decodeBase64(data.content)
  const { data: frontmatter, content } = matter(raw)

  return {
    title: frontmatter.title,
    date: frontmatter.date || undefined,
    author: frontmatter.author || undefined,
    contentHtml: content,
  }
}

export async function getMdEntries(source: WikiSource, slug: string[] = []): Promise<MdEntry[]> {
  const relPath = joinPath([source.root ?? '', ...slug])
  const data = await fetchGh(source, relPath)
  if (!data || !Array.isArray(data)) return []

  const entries: MdEntry[] = []
  for (const item of data) {
    if (item.type === 'dir') {
      const children = await getMdEntries(source, [...slug, item.name])
      if (children.length === 0) continue
      entries.push({ name: item.name, children })
    } else if (item.type === 'file' && item.name.endsWith('.md')) {
      const nameNoExt = item.name.replace(/\.md$/, '')
      entries.push({
        name: nameNoExt,
        slug: [...slug, nameNoExt].join('/'),
      })
    }
  }
  return entries
}
