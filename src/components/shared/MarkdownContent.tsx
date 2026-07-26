import Markdown, { type UrlTransform } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

type MarkdownContentProps = {
  children: string
  className?: string
  urlTransform?: UrlTransform
}

export function MarkdownContent({ children, className = '', urlTransform }: MarkdownContentProps) {
  return (
    <div className={`markdown-body ${className}`}>
      <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]} urlTransform={urlTransform}>
        {children}
      </Markdown>
    </div>
  )
}
