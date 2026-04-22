import type { WikiSource } from '@/entities/wiki'

export const wikiSource: WikiSource = {
  owner: process.env.WIKI_GITHUB_OWNER ?? 'Felirian',
  repo: process.env.WIKI_GITHUB_REPO ?? 'kbz-storage',
  branch: process.env.WIKI_GITHUB_BRANCH ?? 'main',
  root: `storage/${process.env.WIKI_LOCALE ?? 'ru'}`,
}
