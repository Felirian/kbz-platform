import matter from 'gray-matter'
import type { MdContent, MdEntry, WikiSource } from '../model/types'

interface GhTreeNode {
  path: string
  mode: string
  type: 'blob' | 'tree' | 'commit'
  sha: string
  size?: number
  url: string
}

interface GhTreeResponse {
  sha: string
  url: string
  tree: GhTreeNode[]
  truncated: boolean
}

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

function throwForStatus(status: number, body: string): never {
  if (status === 403 && /rate limit/i.test(body)) {
    throw new WikiFetchError('rate-limit', status, 'GitHub API rate limit exceeded')
  }
  if (status === 401) {
    throw new WikiFetchError('unauthorized', status, 'GitHub API unauthorized')
  }
  throw new WikiFetchError('unknown', status, `GitHub API ${status}: ${body}`)
}

/**
 * Один HTTP-запрос к CDN raw.githubusercontent.com.
 * Быстрее Contents API (нет base64-кодирования, нет JSON-оборачивания, кэш CDN),
 * и без лимита 5000/час (он только на api.github.com).
 */
async function fetchRawMd(source: WikiSource, path: string): Promise<string | null> {
  const branch = source.branch ?? 'main'
  const url = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${branch}/${path}`

  const init: RequestInit & { next?: unknown } = {
    next: { revalidate: 3600, tags: ['wiki', `wiki:${source.owner}/${source.repo}`, 'wiki:raw'] },
  }
  if (process.env.GITHUB_TOKEN) {
    init.headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
  }

  const res = await fetchWithRetry(url, init)
  if (res.status === 404) return null
  if (!res.ok) throwForStatus(res.status, await res.text())
  return res.text()
}

/**
 * Один запрос — все пути репозитория (blob + tree).
 * Дедуплицируется кэшем Next.js fetch внутри одного запроса.
 */
async function fetchRepoTree(source: WikiSource): Promise<GhTreeNode[]> {
  const branch = source.branch ?? 'main'
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${branch}?recursive=1`

  const res = await fetchWithRetry(url, {
    headers: buildHeaders(),
    next: { revalidate: 3600, tags: ['wiki', `wiki:${source.owner}/${source.repo}`, 'wiki:tree'] },
  })

  if (res.status === 404) return []
  if (!res.ok) throwForStatus(res.status, await res.text())

  const data = (await res.json()) as GhTreeResponse
  if (data.truncated) {
    console.warn(
      `[wiki] git tree truncated for ${source.owner}/${source.repo} — репа слишком большая, часть путей не пришла`,
    )
  }
  return data.tree
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
  return last.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function getMdContent(source: WikiSource, slug: string[]): Promise<MdContent | null> {
  const base = joinPath([source.root ?? '', ...slug])

  let raw = await fetchRawMd(source, `${base}.md`)
  if (raw === null) raw = await fetchRawMd(source, joinPath([base, 'index.md']))
  if (raw === null) return null

  const { data: frontmatter, content } = safeParseFrontmatter(raw)

  return {
    title: (frontmatter.title as string | undefined) ?? deriveTitleFromSlug(slug),
    date: (frontmatter.date as string | undefined) || undefined,
    author: (frontmatter.author as string | undefined) || undefined,
    contentHtml: content,
  }
}

function buildEntries(
  paths: Set<string>,
  allPaths: string[],
  basePrefix: string,
  baseSlug: string[],
): MdEntry[] {
  const filesAtLevel = new Map<string, string>() // имя без .md → полный путь
  const dirsAtLevel = new Map<string, string[]>() // имя папки → пути внутри

  for (const path of allPaths) {
    const rel = basePrefix ? path.slice(basePrefix.length) : path
    if (!rel) continue
    const segments = rel.split('/')

    if (segments.length === 1) {
      const file = segments[0]
      if (!file.endsWith('.md')) continue
      const nameNoExt = file.slice(0, -3)
      if (nameNoExt === 'index') continue
      filesAtLevel.set(nameNoExt, path)
    } else {
      const dirName = segments[0]
      if (!dirsAtLevel.has(dirName)) dirsAtLevel.set(dirName, [])
      dirsAtLevel.get(dirName)!.push(path)
    }
  }

  const entries: MdEntry[] = []

  for (const [nameNoExt] of filesAtLevel) {
    entries.push({
      name: nameNoExt,
      slug: [...baseSlug, nameNoExt].join('/'),
    })
  }

  for (const [dirName, dirPaths] of dirsAtLevel) {
    const subPrefix = basePrefix + dirName + '/'
    const indexPath = subPrefix + 'index.md'
    const hasIndex = paths.has(indexPath)
    const children = buildEntries(paths, dirPaths, subPrefix, [...baseSlug, dirName])

    if (children.length === 0 && !hasIndex) continue

    entries.push({
      name: dirName,
      slug: hasIndex ? [...baseSlug, dirName].join('/') : undefined,
      children: children.length > 0 ? children : undefined,
    })
  }

  return entries
}

export async function getMdEntries(source: WikiSource, slug: string[] = []): Promise<MdEntry[]> {
  const tree = await fetchRepoTree(source)
  if (tree.length === 0) return []

  const root = source.root ?? ''
  const basePath = joinPath([root, ...slug])
  const basePrefix = basePath ? basePath + '/' : ''

  // Все .md под текущим префиксом — единственный сетевой запрос для навигации.
  const mdPaths = tree
    .filter((n) => n.type === 'blob' && n.path.endsWith('.md'))
    .map((n) => n.path)
    .filter((p) => (basePrefix ? p.startsWith(basePrefix) : true))

  if (mdPaths.length === 0) return []

  return buildEntries(new Set(mdPaths), mdPaths, basePrefix, slug)
}
