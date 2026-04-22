import matter from 'gray-matter';

const GITHUB_OWNER = process.env.WIKI_GITHUB_OWNER ?? 'Felirian'
const GITHUB_REPO = process.env.WIKI_GITHUB_REPO ?? 'kbz-storage'
const GITHUB_BRANCH = process.env.WIKI_GITHUB_BRANCH ?? 'main'
const LOCALE = process.env.WIKI_LOCALE ?? 'ru'
const CONTENT_ROOT = `storage/${LOCALE}`

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`

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

async function fetchGh(relPath: string): Promise<GhResponse | null> {
  const url = `${API_BASE}/${relPath}?ref=${GITHUB_BRANCH}`
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 3600, tags: ['wiki'] },
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

export async function getMdContent(slug: string[]): Promise<MdContent | null> {
  const base = [CONTENT_ROOT, ...slug].join('/')

  let data = await fetchGh(`${base}.md`)
  if (!data) data = await fetchGh(`${base}/index.md`)
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

export async function getMdEntries(currentSlug: string[] = []): Promise<MdEntry[]> {
  const relPath = [CONTENT_ROOT, ...currentSlug].filter(Boolean).join('/')
  const data = await fetchGh(relPath)
  if (!data || !Array.isArray(data)) return []

  const entries: MdEntry[] = []
  for (const item of data) {
    if (item.type === 'dir') {
      const children = await getMdEntries([...currentSlug, item.name])
      if (children.length === 0) continue
      entries.push({ name: item.name, children })
    } else if (item.type === 'file' && item.name.endsWith('.md')) {
      const nameNoExt = item.name.replace(/\.md$/, '')
      entries.push({
        name: nameNoExt,
        slug: [...currentSlug, nameNoExt].join('/'),
      })
    }
  }
  return entries
}
