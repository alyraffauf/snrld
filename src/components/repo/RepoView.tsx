import type { Handle } from '@atcute/lexicons'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import type { Repo } from '../../lib/tangled'
import { getRepoName } from '../../lib/tangled/repo'
import { SurfaceCard } from '../shared/SurfaceCard'
import { RepoCloneUrl } from './RepoCloneUrl'
import { RepoStarCount } from './RepoStarCount'

type RepoProps = {
  handle: Handle
  repo: Repo
}

export function RepoView({ handle, repo }: RepoProps) {
  const { value } = repo
  const name = getRepoName(repo)
  const repoDid = value.repoDid

  return (
    <SurfaceCard
      as="article"
      className="min-w-0 p-4 transition-colors hover:border-ctp-lavender sm:p-6"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-mono text-2xl font-bold text-ctp-text">{name}</h1>
          {value.knot && <p className="mt-1 font-mono text-sm text-ctp-subtext-0">{value.knot}</p>}
        </div>

        <RepoStarCount repoDid={repoDid} />
      </header>

      {value.description && (
        <div className="mt-4 max-w-prose break-words text-lg leading-relaxed text-ctp-subtext-1">
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{value.description}</Markdown>
        </div>
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

      <RepoCloneUrl handle={handle} repo={repo} />
    </SurfaceCard>
  )
}
