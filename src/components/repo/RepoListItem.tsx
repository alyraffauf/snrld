import type { Did, Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { countStars } from '../../lib/tangled/feed'
import type { Repo } from '../../lib/tangled/index'
import { getRepoName, getRepoRkey } from '../../lib/tangled/repo'
import { IconStar } from '@tabler/icons-react'

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
  const [stars, setStars] = useState<number | null>(null)
  const [starsFailed, setStarsFailed] = useState(false)

  useEffect(() => {
    if (repoDid === undefined) return

    async function loadStars(repoDid: Did) {
      try {
        setStars(await countStars(repoDid))
      } catch {
        setStarsFailed(true)
      }
    }

    loadStars(repoDid)
  }, [repoDid])

  return (
    <Link
      to={`/${handle}/${encodeURIComponent(rkey)}`}
      className="group block h-full rounded focus-visible:outline-none"
    >
      <article className="flex h-full flex-col border border-ctp-surface-1 bg-ctp-mantle p-3 transition-colors group-hover:border-ctp-lavender sm:p-4">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-mono text-base font-semibold text-ctp-text transition-colors group-hover:text-ctp-lavender">
              {name}
            </h3>

            {value.knot && (
              <p className="mt-1 truncate font-mono text-xs text-ctp-overlay-1">{value.knot}</p>
            )}
          </div>

          {repoDid !== undefined && (
            <span className="shrink-0 font-mono text-sm leading-4 tabular-nums text-ctp-yellow">
              <IconStar
                size={16}
                stroke={1.75}
                aria-hidden="true"
                className="mr-1 inline-block align-middle text-current"
              />
              {starsFailed ? '—' : (stars ?? '…')}
            </span>
          )}
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
      </article>
    </Link>
  )
}
