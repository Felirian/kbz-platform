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

export type WikiFetchErrorKind = 'rate-limit' | 'unauthorized' | 'unknown'

export class WikiFetchError extends Error {
  kind: WikiFetchErrorKind
  status: number

  constructor(kind: WikiFetchErrorKind, status: number, message: string) {
    super(message)
    this.name = 'WikiFetchError'
    this.kind = kind
    this.status = status
  }
}

async function fetchWithRetry(url: string, init: RequestInit & { next?: unknown }, retries = 2): Promise<Response> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetch(url, init)
    } catch (err) {
      lastErr = err
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 200 * 2 ** attempt))
      }
    }
  }
  throw new WikiFetchError(
    'unknown',
    0,
    `Network error fetching ${url}: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  )
}

async function fetchGh(source: WikiSource, relPath: string): Promise<GhResponse | null> {
  const branch = source.branch ?? 'main'
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/contents/${relPath}?ref=${branch}`

  const res = await fetchWithRetry(url, {
    headers: buildHeaders(),
    next: { revalidate: 3600, tags: ['wiki', `wiki:${source.owner}/${source.repo}`] },
  })

  if (res.status === 404) return null
  if (!res.ok) {
    const body = await res.text()
    if (res.status === 403 && /rate limit/i.test(body)) {
      throw new WikiFetchError('rate-limit', res.status, 'GitHub API rate limit exceeded')
    }
    if (res.status === 401) {
      throw new WikiFetchError('unauthorized', res.status, 'GitHub API unauthorized')
    }
    throw new WikiFetchError('unknown', res.status, `GitHub API ${res.status}: ${body}`)
  }
  return res.json()
}

async function mapWithConcurrency<T, U>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  const results: U[] = new Array(items.length)
  let cursor = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++
      if (i >= items.length) return
      results[i] = await fn(items[i], i)
    }
  })
  await Promise.all(workers)
  return results
}

function decodeBase64(content: string): string {
  return Buffer.from(content, 'base64').toString('utf8')
}

function joinPath(parts: string[]): string {
  return parts.filter(Boolean).join('/')
}

const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/

function safeParseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    const parsed = matter(raw)
    return { data: parsed.data as Record<string, unknown>, content: parsed.content }
  } catch (err) {
    console.warn('[wiki] failed to parse YAML frontmatter, falling back to raw content:', err)
    const match = raw.match(FRONTMATTER_RE)
    const content = match ? raw.slice(match[0].length) : raw
    return { data: {}, content }
  }
}

function deriveTitleFromSlug(slug: string[]): string {
  const last = slug[slug.length - 1] ?? ''
  if (!last) return 'Без названия'
  return last
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function getMdContent(source: WikiSource, slug: string[]): Promise<MdContent | null> {
  const base = joinPath([source.root ?? '', ...slug])

  let data = await fetchGh(source, `${base}.md`)
  if (!data) data = await fetchGh(source, joinPath([base, 'index.md']))
  if (!data || Array.isArray(data) || data.type !== 'file') return null

  const raw = decodeBase64(data.content)
  const { data: frontmatter, content } = safeParseFrontmatter(raw)

  return {
    title: (frontmatter.title as string | undefined) ?? deriveTitleFromSlug(slug),
    date: (frontmatter.date as string | undefined) || undefined,
    author: (frontmatter.author as string | undefined) || undefined,
    contentHtml: content,
  }
}

export async function getMdEntries(source: WikiSource, slug: string[] = []): Promise<MdEntry[]> {
  const relPath = joinPath([source.root ?? '', ...slug])
  const data = await fetchGh(source, relPath)
  if (!data || !Array.isArray(data)) return []

  const entries = await mapWithConcurrency(data, 5, async (item): Promise<MdEntry | null> => {
    if (item.type === 'dir') {
      const dirSlug = [...slug, item.name]
      const [children, indexContent] = await Promise.all([
        getMdEntries(source, dirSlug),
        getMdContent(source, dirSlug),
      ])
      if (children.length === 0 && !indexContent) return null

      return {
        name: indexContent?.title ?? item.name,
        slug: indexContent ? dirSlug.join('/') : undefined,
        children: children.length > 0 ? children : undefined,
      }
    }

    if (item.type === 'file' && item.name.endsWith('.md')) {
      const nameNoExt = item.name.replace(/\.md$/, '')
      if (nameNoExt === 'index') return null

      const fileSlug = [...slug, nameNoExt]
      const content = await getMdContent(source, fileSlug)
      return {
        name: content?.title ?? nameNoExt,
        slug: fileSlug.join('/'),
      }
    }

    return null
  })

  return entries.filter((e): e is MdEntry => e !== null)
}
