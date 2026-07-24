import { type RepoCommit } from '../../lib/tangled/repo'

type RepoCommitProps = {
  commit: RepoCommit
}

export function RepoCommit({ commit }: RepoCommitProps) {
  return (
    <li className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ctp-overlay-1">
        <span>{commit.hash.slice(0, 7)}</span>
        {commit.author?.When && (
          <time dateTime={commit.author.When}>{formatCommitDate(commit.author.When)}</time>
        )}
      </div>
      <p className="whitespace-pre-wrap break-words text-sm leading-snug text-ctp-subtext-1">
        {commit.message.trim()}
      </p>
    </li>
  )
}

function formatCommitDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
