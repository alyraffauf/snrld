import type { Handle } from '@atcute/lexicons'
import { Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import type { Repo } from '../../lib/tangled/index'
import { getRepoName, getRepoRkey } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'
import { RepoStarCount } from './RepoStarCount'

const MAX_VISIBLE_TOPICS = 3

type RepoListItemProps = {
  handle: Handle
  repo: Repo
}

export function RepoListItem({ handle, repo }: RepoListItemProps) {
  const { value } = repo
  const name = getRepoName(repo)
  const rkey = getRepoRkey(repo)
  const repoDid = value.repoDid

  return (
    <SurfaceCard
      as="article"
      className="group flex h-full flex-col p-3 transition-colors hover:border-ctp-lavender sm:p-4"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to={`/${handle}/${encodeURIComponent(rkey)}`}
            className="block truncate font-mono text-base font-semibold text-ctp-text transition-colors hover:text-ctp-lavender focus-visible:rounded"
          >
            {name}
          </Link>

          {value.knot && (
            <p className="mt-1 truncate font-mono text-xs text-ctp-overlay-1">{value.knot}</p>
          )}
        </div>

        <RepoStarCount repoDid={repoDid} />
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
}
