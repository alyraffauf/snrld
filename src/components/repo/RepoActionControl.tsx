import type { ReactNode } from 'react'

type RepoActionControlProps = {
  ariaLabel: string
  children: ReactNode
  count?: ReactNode
  countLabel?: string
  href?: string
}

export function RepoActionControl({
  ariaLabel,
  children,
  count,
  countLabel,
  href,
}: RepoActionControlProps) {
  const actionClassName =
    'flex size-10 items-center justify-center transition-colors hover:bg-ctp-surface-0'

  return (
    <div className="inline-flex shrink-0 overflow-hidden rounded border border-ctp-surface-1">
      {href === undefined ? (
        <button type="button" aria-label={ariaLabel} className={actionClassName}>
          {children}
        </button>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={ariaLabel}
          className={actionClassName}
        >
          {children}
        </a>
      )}

      {count !== undefined && (
        <span
          className="flex size-10 items-center justify-center border-l border-ctp-surface-1 font-mono tabular-nums text-ctp-text"
          aria-label={countLabel}
        >
          {count}
        </span>
      )}
    </div>
  )
}
