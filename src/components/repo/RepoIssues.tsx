import type { Did } from '@atcute/lexicons'
import { IconCircleDot, IconMessageCircle } from '@tabler/icons-react'
import { useRepoIssues } from '../../hooks/useRepoIssues'
import { SurfaceCard } from '../shared/SurfaceCard'

type RepoIssuesProps = {
  repoDid: Did
}

export function RepoIssues({ repoDid }: RepoIssuesProps) {
  const { issues, error } = useRepoIssues(repoDid)

  if (error) {
    return <p role="alert">Could not load issues: {error.message}</p>
  }

  if (issues === null) {
    return <p>Loading issues...</p>
  }

  if (issues.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No issues found.</p>
  }

  return (
    <ul className="space-y-3" aria-label="Issues">
      {issues.items.map((issue) => {
        const isOpen = issue.state === 'open'

        return (
          <li key={issue.uri}>
            <SurfaceCard as="article" className="p-4">
              <div className="flex items-center justify-between gap-4 font-mono text-xs">
                <span
                  className={`inline-flex items-center gap-1.5 ${
                    isOpen ? 'text-ctp-teal' : 'text-ctp-overlay-1'
                  }`}
                >
                  <IconCircleDot size={15} stroke={1.75} aria-hidden="true" />
                  {issue.state}
                </span>

                <span className="inline-flex items-center gap-1.5 text-ctp-subtext-0">
                  <IconMessageCircle size={15} stroke={1.75} aria-hidden="true" />
                  {issue.commentCount}
                </span>
              </div>

              <h2 className="mt-3 text-base font-semibold text-ctp-text">{issue.value.title}</h2>
            </SurfaceCard>
          </li>
        )
      })}
    </ul>
  )
}
