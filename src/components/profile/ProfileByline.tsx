import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { Link } from 'react-router-dom'
import type { Profile } from '../../lib/tangled'
import { ProfileAvatar } from './ProfileAvatar'

type ProfileBylineProps = {
  miniDoc: MiniDoc
  profile: Profile
  bskyProfile?: AppBskyActorProfile.Main | null
  label: string
}

export function ProfileByline({ miniDoc, profile, bskyProfile, label }: ProfileBylineProps) {
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
              size="small"
            />
            {miniDoc.handle}
          </Link>
        </li>

        <li aria-hidden="true" className="text-ctp-subtext-0">
          /
        </li>

        <li className="min-w-0 truncate font-semibold text-ctp-text">{label}</li>
      </ol>
    </nav>
  )
}
