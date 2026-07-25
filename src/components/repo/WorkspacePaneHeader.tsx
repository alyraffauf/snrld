import type { ReactNode } from 'react'

type WorkspacePaneHeaderProps = {
  title: ReactNode
  labelledBy: string
  trailing?: ReactNode
}

export function WorkspacePaneHeader({ title, labelledBy, trailing }: WorkspacePaneHeaderProps) {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-ctp-surface-1 bg-ctp-mantle px-4">
      <h2 id={labelledBy} className="font-mono text-base font-semibold text-ctp-text">
        {title}
      </h2>
      {trailing}
    </div>
  )
}
