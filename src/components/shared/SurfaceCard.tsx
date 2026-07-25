import type { ReactNode } from 'react'

type SurfaceCardProps = {
  as?: 'article' | 'div'
  children: ReactNode
  className?: string
}

export function SurfaceCard({ as = 'div', children, className = '' }: SurfaceCardProps) {
  const Component = as

  return (
    <Component className={`rounded border border-ctp-surface-1 bg-ctp-mantle ${className}`}>
      {children}
    </Component>
  )
}
