import type { HTMLAttributes, ReactNode } from 'react'

type SurfaceCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'section'
  children: ReactNode
  className?: string
}

export function SurfaceCard({
  as = 'div',
  children,
  className = '',
  ...attributes
}: SurfaceCardProps) {
  const Component = as

  return (
    <Component
      {...attributes}
      className={`rounded border border-ctp-surface-1 bg-ctp-mantle ${className}`}
    >
      {children}
    </Component>
  )
}
