import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { IconCircleDot, IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useVisibleActor } from '../../hooks/useVisibleActor'
import { useRepoIssues } from '../../hooks/useRepoIssues'
import { getRecordRkey, type Issue } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'

type RepoIssuesProps = {
  repoOwnerHandle: Handle
  repoDid: Did
  repoKey: string
}

export function RepoIssues({ repoOwnerHandle, repoDid, repoKey }: RepoIssuesProps) {
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
      {issues.items.map((issue) => (
        <IssueListItem
          key={issue.uri}
          issue={issue}
          repoKey={repoKey}
          repoOwnerHandle={repoOwnerHandle}
        />
      ))}
    </ul>
  )
}

type IssueListItemProps = { issue: Issue; repoKey: string; repoOwnerHandle: Handle }

function IssueListItem({ issue, repoKey, repoOwnerHandle }: IssueListItemProps) {
  const authorIdentifier = parseResourceUri(issue.uri).repo
  const { actor, elementRef } = useVisibleActor(isDid(authorIdentifier) ? authorIdentifier : null)
  const issueUrl = actor
    ? `/${repoOwnerHandle}/${repoKey}/issues/${actor.miniDoc.handle}/${getRecordRkey(issue.uri)}`
    : undefined

  return (
    <li ref={elementRef}>
      {issueUrl === undefined ? (
        <IssueCard issue={issue} isOpen={issue.state === 'open'} />
      ) : (
        <Link
          to={issueUrl}
          className="group block rounded-lg"
          aria-label={`Open issue: ${issue.value.title}`}
        >
          <IssueCard issue={issue} isOpen={issue.state === 'open'} linked />
        </Link>
      )}
    </li>
  )
}

type IssueCardProps = {
  issue: Issue
  isOpen: boolean
  linked?: boolean
}

function IssueCard({ issue, isOpen, linked = false }: IssueCardProps) {
  return (
    <SurfaceCard
      as="article"
      className={`p-4 transition-colors ${linked ? 'group-hover:border-ctp-overlay-1' : ''}`}
    >
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
  )
}
