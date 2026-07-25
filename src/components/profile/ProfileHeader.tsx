import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { useProfileFollowCounts } from '../../hooks/useProfileFollowCounts'
import type { Profile } from '../../lib/tangled'
import { ProfileAvatar } from './ProfileAvatar'

type ProfileHeaderProps = {
  miniDoc: MiniDoc
  profile: Profile
  blueskyProfile?: AppBskyActorProfile.Main | null
}

export function ProfileHeader({ miniDoc, profile, blueskyProfile }: ProfileHeaderProps) {
  const { value } = profile
  const { followers, following } = useProfileFollowCounts(miniDoc.did)
  const profileLinks = [
    ...(value.bluesky
      ? [{ href: `https://witchsky.app/profile/${miniDoc.handle}`, label: 'witchsky' }]
      : []),
    ...(value.links ?? []).map((link) => ({ href: link, label: getLinkLabel(link) })),
  ]

  return (
    <article className="border-0 bg-transparent p-0 shadow-none">
      <div className="flex items-center gap-4">
        <ProfileAvatar miniDoc={miniDoc} profile={profile} bskyProfile={blueskyProfile} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-mono text-2xl font-bold text-ctp-text">{miniDoc.handle}</h1>
            {value.pronouns && (
              <span className="font-mono text-sm text-ctp-subtext-0">({value.pronouns})</span>
            )}
          </div>

          <p className="mt-2 truncate font-mono text-xs text-ctp-overlay-1">{miniDoc.did}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ctp-green">
        <span>{followers ?? '—'} followers</span>
        <span>{following ?? '—'} following</span>
      </div>

      {value.description && (
        <p className="mt-4 max-w-prose text-base leading-relaxed">{value.description}</p>
      )}

      {value.location && <p className="mt-3 text-sm text-ctp-subtext-0">{value.location}</p>}

      {profileLinks.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2" aria-label="Profile links">
          {profileLinks.map((link) => (
            <li key={link.href} className="font-mono text-sm text-ctp-teal">
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function getLinkLabel(link: string): string {
  try {
    return new URL(link).hostname || link
  } catch {
    return link
  }
}
