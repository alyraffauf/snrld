import type { Did, Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { countStars } from '../../lib/tangled/feed'
import type { Repo } from '../../lib/tangled/index'
import { getRepoName, getRepoRkey } from '../../lib/tangled/repo'

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
    <Link to={`/${handle}/${encodeURIComponent(rkey)}`} className="block">
      <article className="group h-full border-ctp-surface-1 p-4 transition-colors hover:border-ctp-lavender">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-mono text-base font-semibold text-ctp-text">{name}</h3>
          </div>

          {repoDid !== undefined && (
            <span className="shrink-0 font-mono text-xs text-ctp-yellow">
              ★ {starsFailed ? '—' : (stars ?? '…')}
            </span>
          )}
        </div>

        {value.description && (
          <div className="mt-2 line-clamp-2 text-sm leading-snug text-ctp-subtext-1">
            <Markdown>{value.description}</Markdown>
          </div>
        )}
      </article>
    </Link>
  )
}
