import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { IconCircleDot, IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useRecordAuthors } from '../../hooks/useRecordAuthors'
import { useRepoIssues } from '../../hooks/useRepoIssues'
import { getRecordRkey, type Issue } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'

const EMPTY_ISSUES: readonly Issue[] = []

type RepoIssuesProps = {
  repoOwnerHandle: Handle
  repoDid: Did
  repoKey: string
}

export function RepoIssues({ repoOwnerHandle, repoDid, repoKey }: RepoIssuesProps) {
  const { issues, error } = useRepoIssues(repoDid)
  const { authors, error: authorsError } = useRecordAuthors(issues?.items ?? EMPTY_ISSUES)

  if (error) {
    return <p role="alert">Could not load issues: {error.message}</p>
  }

  if (issues === null) {
    return <p>Loading issues...</p>
  }

  if (issues.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No issues found.</p>
  }

  const authorResolutionMessage =
    authorsError === null ? null : 'Some issues may not be available until their authors resolve.'

  return (
    <>
      {authorResolutionMessage && <p role="status">{authorResolutionMessage}</p>}
      <ul className="space-y-3" aria-label="Issues">
        {issues.items.map((issue) => {
          const isOpen = issue.state === 'open'
          const authorDid = parseResourceUri(issue.uri).repo
          const issueOwner = authors?.get(authorDid)
          const issueUrl =
            issueOwner === undefined
              ? undefined
              : `/${repoOwnerHandle}/${repoKey}/issues/${issueOwner}/${getRecordRkey(issue.uri)}`

          return (
            <li key={issue.uri}>
              {issueUrl === undefined ? (
                <IssueCard issue={issue} isOpen={isOpen} />
              ) : (
                <Link
                  to={issueUrl}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-blue"
                  aria-label={`Open issue: ${issue.value.title}`}
                >
                  <IssueCard issue={issue} isOpen={isOpen} linked />
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </>
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
