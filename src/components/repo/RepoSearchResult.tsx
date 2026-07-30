import type { Handle } from '@atcute/lexicons'
import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import type { ResolvedActor } from '../../lib/actor'
import type { Repo } from '../../lib/tangled'
import { getRepoName, getRepoRkey } from '../../lib/tangled/repo'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { SurfaceCard } from '../shared/SurfaceCard'
import { RepoStarCount } from './RepoStarCount'

const MAX_VISIBLE_TOPICS = 3

type RepoSearchResultProps = {
  repo: Repo
  handle: Handle | null
  actor: ResolvedActor | null
}

export function RepoSearchResult({ repo, handle, actor }: RepoSearchResultProps) {
  const { value } = repo
  const name = getRepoName(repo)
  const rkey = getRepoRkey(repo)

  const content = (
    <SurfaceCard
      as="article"
      className="group relative flex h-full flex-col p-3 transition-colors hover:border-ctp-lavender sm:p-4"
    >
      <header className="flex min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          {actor ? (
            <ProfileAvatar
              miniDoc={actor.miniDoc}
              profile={actor.profile}
              bskyProfile={actor.bskyProfile}
              avatarUrl={actor.avatarUrl}
              size="small"
            />
          ) : handle ? (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ctp-surface-1 font-mono text-sm text-ctp-lavender">
              {handle[0].toUpperCase()}
            </span>
          ) : null}
          <h2 className="truncate font-mono text-base font-semibold text-ctp-text transition-colors group-hover:text-ctp-lavender">
            {handle && <span className="font-normal text-ctp-overlay-1">{handle}/</span>}
            {name}
          </h2>
        </div>
        <RepoStarCount repoDid={value.repoDid} />
      </header>

      {value.description && (
        <div className="mt-3 line-clamp-2 text-sm leading-snug text-ctp-subtext-1">
          <Markdown>{value.description}</Markdown>
        </div>
      )}

      {value.topics && value.topics.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4" aria-label="Topics">
          {value.topics.slice(0, MAX_VISIBLE_TOPICS).map((topic) => (
            <li key={topic} className="font-mono text-xs text-ctp-teal">
              #{topic}
            </li>
          ))}
        </ul>
      )}
    </SurfaceCard>
  )

  if (handle === null) return content

  return (
    <Link
      to={`/${handle}/${encodeURIComponent(rkey)}`}
      className="block rounded-lg"
      aria-label={`Open ${handle}/${name}`}
    >
      {content}
    </Link>
  )
}
