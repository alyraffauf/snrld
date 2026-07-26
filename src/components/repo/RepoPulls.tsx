import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { IconGitPullRequest, IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useRecordAuthors } from '../../hooks/useRecordAuthors'
import { useRepoPulls } from '../../hooks/useRepoPulls'
import { getRecordRkey, type Pull } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'

const EMPTY_PULLS: readonly Pull[] = []

type RepoPullsProps = {
  repoOwnerHandle: Handle
  repoDid: Did
  repoKey: string
}

export function RepoPulls({ repoOwnerHandle, repoDid, repoKey }: RepoPullsProps) {
  const { pulls, error } = useRepoPulls(repoDid)
  const { authors, error: authorsError } = useRecordAuthors(pulls?.items ?? EMPTY_PULLS)

  if (error) {
    return <p role="alert">Could not load pulls: {error.message}</p>
  }

  if (pulls === null) {
    return <p>Loading pulls...</p>
  }

  if (pulls.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No pulls found.</p>
  }

  const authorResolutionMessage =
    authorsError === null
      ? null
      : 'Some pull requests may not be available until their authors resolve.'

  return (
    <>
      {authorResolutionMessage && <p role="status">{authorResolutionMessage}</p>}
      <ul className="space-y-3" aria-label="Pull requests">
        {pulls.items.map((pull) => {
          const stateClassName =
            pull.state === 'open'
              ? 'text-ctp-teal'
              : pull.state === 'merged'
                ? 'text-ctp-mauve'
                : 'text-ctp-overlay-1'
          const authorDid = parseResourceUri(pull.uri).repo
          const pullOwner = authors?.get(authorDid)
          const pullUrl =
            pullOwner === undefined
              ? undefined
              : `/${repoOwnerHandle}/${repoKey}/pulls/${pullOwner}/${getRecordRkey(pull.uri)}`

          return (
            <li key={pull.uri}>
              {pullUrl === undefined ? (
                <PullCard pull={pull} stateClassName={stateClassName} />
              ) : (
                <Link
                  to={pullUrl}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-blue"
                  aria-label={`Open pull request: ${pull.value.title}`}
                >
                  <PullCard pull={pull} stateClassName={stateClassName} linked />
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

type PullCardProps = {
  linked?: boolean
  pull: Pull
  stateClassName: string
}

function PullCard({ linked = false, pull, stateClassName }: PullCardProps) {
  return (
    <SurfaceCard
      as="article"
      className={`p-4 transition-colors ${linked ? 'group-hover:border-ctp-overlay-1' : ''}`}
    >
      <div className="flex items-center justify-between gap-4 font-mono text-xs">
        <span className={`inline-flex items-center gap-1.5 ${stateClassName}`}>
          <IconGitPullRequest size={15} stroke={1.75} aria-hidden="true" />
          {pull.state}
        </span>

        <span className="inline-flex items-center gap-1.5 text-ctp-subtext-0">
          <IconMessageCircle size={15} stroke={1.75} aria-hidden="true" />
          {pull.commentCount}
        </span>
      </div>

      <h2 className="mt-3 text-base font-semibold text-ctp-text">{pull.value.title}</h2>
    </SurfaceCard>
  )
}
