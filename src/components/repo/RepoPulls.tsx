import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { IconGitPullRequest, IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useVisibleActor } from '../../hooks/useVisibleActor'
import { useRepoPulls } from '../../hooks/useRepoPulls'
import { getRecordRkey, type Pull } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'
import { LoadMoreButton } from '../shared/LoadMoreButton'

type RepoPullsProps = {
  isActive: boolean
  repoOwnerHandle: Handle
  repoDid: Did
  repoKey: string
}

export function RepoPulls({ isActive, repoOwnerHandle, repoDid, repoKey }: RepoPullsProps) {
  const { pulls, error, hasMore, isLoadingMore, loadMore } = useRepoPulls(repoDid, isActive)

  if (error && pulls === null) {
    return <p role="alert">Could not load pulls: {error.message}</p>
  }

  if (pulls === null) {
    return <p>Loading pulls...</p>
  }

  if (pulls.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No pulls found.</p>
  }

  return (
    <>
      <ul className="space-y-3" aria-label="Pull requests">
        {pulls.items.map((pull) => (
          <PullListItem
            key={pull.uri}
            pull={pull}
            repoKey={repoKey}
            repoOwnerHandle={repoOwnerHandle}
          />
        ))}
      </ul>
      {hasMore && (
        <div className="mt-4">
          <LoadMoreButton
            label="Pull requests"
            isLoading={isLoadingMore}
            onClick={() => void loadMore()}
          />
        </div>
      )}
      {error && pulls !== null && (
        <p role="alert">Could not load more pull requests: {error.message}</p>
      )}
    </>
  )
}

type PullListItemProps = { pull: Pull; repoKey: string; repoOwnerHandle: Handle }

function PullListItem({ pull, repoKey, repoOwnerHandle }: PullListItemProps) {
  const authorIdentifier = parseResourceUri(pull.uri).repo
  const { actor, elementRef } = useVisibleActor(isDid(authorIdentifier) ? authorIdentifier : null)
  const pullUrl = actor
    ? `/${repoOwnerHandle}/${repoKey}/pulls/${actor.miniDoc.handle}/${getRecordRkey(pull.uri)}`
    : undefined
  const stateClassName =
    pull.state === 'open'
      ? 'text-ctp-teal'
      : pull.state === 'merged'
        ? 'text-ctp-mauve'
        : 'text-ctp-overlay-1'

  return (
    <li ref={elementRef}>
      {pullUrl === undefined ? (
        <PullCard pull={pull} stateClassName={stateClassName} />
      ) : (
        <Link
          to={pullUrl}
          className="group block rounded-lg"
          aria-label={`Open pull request: ${pull.value.title}`}
        >
          <PullCard pull={pull} stateClassName={stateClassName} linked />
        </Link>
      )}
    </li>
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
