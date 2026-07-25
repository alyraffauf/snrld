type RepoTreePathProps = {
  onNavigate: (path: string) => void
  path: string
  repoName: string
}

export function RepoTreePath({ onNavigate, path, repoName }: RepoTreePathProps) {
  const segments = path.split('/').filter(Boolean)

  return (
    <span className="flex min-w-0 items-baseline gap-1 font-mono text-sm font-normal">
      <span className="text-ctp-subtext-0">/</span>
      <button
        type="button"
        onClick={() => onNavigate('')}
        className="truncate text-ctp-subtext-0 hover:text-ctp-lavender"
        aria-label="Repository root"
      >
        {repoName}
      </button>
      {segments.map((segment, index) => {
        const segmentPath = segments.slice(0, index + 1).join('/')

        return (
          <span key={segmentPath} className="flex min-w-0 items-baseline gap-1">
            <span className="text-ctp-subtext-0">/</span>
            <button
              type="button"
              onClick={() => onNavigate(segmentPath)}
              className="truncate text-ctp-subtext-0 hover:text-ctp-lavender"
            >
              {segment}
            </button>
          </span>
        )
      })}
    </span>
  )
}
