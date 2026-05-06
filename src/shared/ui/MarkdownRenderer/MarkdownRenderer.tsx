import React from 'react'
import Markdown, { type Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps extends React.HTMLProps<HTMLDivElement> {
  text: string
}

const EXTERNAL_PROTOCOL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|mailto:|tel:)/i

function prefixWikiHref(href: string | undefined): string | undefined {
  if (!href) return href
  if (EXTERNAL_PROTOCOL_RE.test(href)) return href

  const [pathRaw, hash = ''] = href.split('#')
  const path = pathRaw.replace(/^\.?\/+/, '').replace(/^wiki\//, '')
  if (!path) return href

  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `/wiki/${withSlash}${hash ? `#${hash}` : ''}`
}

const components: Components = {
  a: ({ href, children, ...rest }) => (
    <a href={prefixWikiHref(href)} {...rest}>
      {children}
    </a>
  ),
}

export function MarkdownRenderer({ text, ...props }: MarkdownRendererProps) {
  return (
    <article {...props}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={components}
      >
        {text}
      </Markdown>
    </article>
  )
}
