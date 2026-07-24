import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { countStars } from '../lib/tangled/feed'
import type { Repo } from '../lib/tangled/index'
import { getRepoName } from '../lib/tangled/repo'

type RepoProps = {
  repo: Repo
}

export function RepoView({ repo }: RepoProps) {
  const { value } = repo
  const name = getRepoName(repo)
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
    <article className="rounded border border-ctp-surface-1 bg-ctp-mantle p-6 transition-colors hover:border-ctp-lavender">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-mono text-2xl font-bold text-ctp-text">{name}</h1>
          {value.knot && <p className="mt-1 font-mono text-sm text-ctp-overlay-1">{value.knot}</p>}
        </div>

        {repoDid !== undefined && (
          <span className="shrink-0 font-mono text-sm text-ctp-yellow">
            ★ {starsFailed ? '—' : (stars ?? '…')}
          </span>
        )}
      </header>

      {value.description && (
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ctp-subtext-1">
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{value.description}</Markdown>
        </p>
      )}

      {value.topics && value.topics.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Topics">
          {value.topics.map((topic) => (
            <li key={topic} className="font-mono text-sm text-ctp-teal">
              #{topic}
            </li>
          ))}
        </ul>
      )}

      {value.website && (
        <div className="mt-4 border-t border-ctp-surface-0 pt-4 text-sm">
          <a href={value.website} target="_blank" rel="noreferrer">
            {new URL(value.website).hostname}
          </a>
        </div>
      )}
    </article>
  )
}
