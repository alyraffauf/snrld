import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

type MarkdownContentProps = {
  children: string
  className?: string
}

export function MarkdownContent({ children, className = '' }: MarkdownContentProps) {
  return (
    <div className={`markdown-body ${className}`}>
      <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{children}</Markdown>
    </div>
  )
}
