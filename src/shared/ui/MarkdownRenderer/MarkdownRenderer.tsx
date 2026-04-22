import React from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

interface MarkdownRendererProps extends React.HTMLProps<HTMLDivElement> {
  text: string
}

export function MarkdownRenderer({ text, ...props }: MarkdownRendererProps) {
  return (
    <article {...props}>
      <Markdown rehypePlugins={[rehypeRaw]}>{text}</Markdown>
    </article>
  )
}
