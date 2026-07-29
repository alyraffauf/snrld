import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { Link } from 'react-router-dom'
import type { Profile } from '../../lib/tangled'
import { ProfileAvatar } from './ProfileAvatar'

type ProfileBylineProps = {
  miniDoc: MiniDoc
  profile: Profile
  bskyProfile?: AppBskyActorProfile.Main | null
  breadcrumbs?: readonly Breadcrumb[]
  label?: string
}

type Breadcrumb = {
  label: string
  to?: string
}

export function ProfileByline({
  miniDoc,
  profile,
  bskyProfile,
  breadcrumbs,
  label,
}: ProfileBylineProps) {
  const items = breadcrumbs ?? (label === undefined ? [] : [{ label }])

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex min-w-0 items-center gap-2 font-mono text-sm">
        <li className="shrink-0">
          <Link
            to={`/${miniDoc.handle}`}
            className="flex items-center gap-2 whitespace-nowrap text-ctp-blue hover:text-ctp-sapphire"
          >
            <ProfileAvatar
              miniDoc={miniDoc}
              profile={profile}
              bskyProfile={bskyProfile}
              loading="eager"
              size="small"
            />
            {miniDoc.handle}
          </Link>
        </li>

        {items.map((breadcrumb, index) => (
          <li key={`${breadcrumb.label}-${index}`} className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="shrink-0 text-ctp-subtext-0">
              /
            </span>
            <span className="min-w-0 truncate font-semibold">
              {breadcrumb.to === undefined ? (
                <span className="text-ctp-text">{breadcrumb.label}</span>
              ) : (
                <Link
                  to={breadcrumb.to}
                  className="text-ctp-blue hover:text-ctp-sapphire focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-blue"
                >
                  {breadcrumb.label}
                </Link>
              )}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
