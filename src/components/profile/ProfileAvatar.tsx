import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { getAvatarUrl } from '../../lib/atproto/media'
import type { Profile } from '../../lib/tangled'

type ProfileAvatarProps = {
  miniDoc: MiniDoc
  profile: Profile
  bskyProfile?: AppBskyActorProfile.Main | null
  size?: 'small' | 'medium'
}

export function ProfileAvatar({
  miniDoc,
  profile,
  bskyProfile,
  size = 'medium',
}: ProfileAvatarProps) {
  const avatar = profile.value.avatar ?? bskyProfile?.avatar
  const avatarUrl = avatar ? getAvatarUrl(miniDoc.did, avatar) : null
  const sizeClass = size === 'small' ? 'size-8 text-sm' : 'size-16 text-xl'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${miniDoc.handle} avatar`}
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-ctp-surface-1`}
      />
    )
  }

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-ctp-surface-1 font-mono text-ctp-lavender`}
    >
      {miniDoc.handle[0].toUpperCase()}
    </span>
  )
}
