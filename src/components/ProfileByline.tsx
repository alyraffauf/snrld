import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { Link } from 'react-router-dom'
import { getAvatarUrl } from '../lib/atproto/media'
import type { Profile, Repo } from '../lib/tangled'
import { getRepoName } from '../lib/tangled/repo'

type ProfileBylineProps = {
  miniDoc: MiniDoc
  profile: Profile
  repo: Repo
}

export function ProfileByline({ miniDoc, profile, repo }: ProfileBylineProps) {
  const { value } = profile
  const avatarUrl = value.avatar ? getAvatarUrl(miniDoc.did, value.avatar) : null

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 font-mono text-sm">
        <li className="shrink-0">
          <Link
            to={`/${miniDoc.handle}`}
            className="flex items-center gap-2 whitespace-nowrap text-ctp-blue hover:text-ctp-sapphire"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${miniDoc.handle} avatar`}
                className="size-8 shrink-0 rounded-full object-cover ring-2 ring-ctp-surface-1"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ctp-surface-1 font-mono text-sm text-ctp-lavender">
                {miniDoc.handle[0].toUpperCase()}
              </span>
            )}
            {miniDoc.handle}
          </Link>
        </li>

        <li aria-hidden="true" className="text-ctp-subtext-0">
          /
        </li>

        <li className="truncate font-semibold text-ctp-text">{getRepoName(repo)}</li>
      </ol>
    </nav>
  )
}
