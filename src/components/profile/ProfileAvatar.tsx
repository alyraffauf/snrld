import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { getAvatarUrl } from '../../lib/atproto/media'
import type { Profile } from '../../lib/tangled'

type ProfileAvatarProps = {
  miniDoc: MiniDoc
  profile: Profile
  bskyProfile?: AppBskyActorProfile.Main | null
  avatarUrl?: string | null
  loading?: 'eager' | 'lazy'
  size?: 'compact' | 'small' | 'medium'
}

export function ProfileAvatar({
  miniDoc,
  profile,
  bskyProfile,
  avatarUrl,
  loading = 'lazy',
  size = 'medium',
}: ProfileAvatarProps) {
  const avatar = profile.value.avatar ?? bskyProfile?.avatar
  const resolvedAvatarUrl =
    avatarUrl === undefined ? (avatar ? getAvatarUrl(miniDoc.did, avatar) : null) : avatarUrl
  const sizeClass = {
    compact: 'size-6 text-xs',
    small: 'size-8 text-sm',
    medium: 'size-16 text-xl',
  }[size]
  const ringClass = size === 'compact' ? 'ring-1' : 'ring-2'

  if (resolvedAvatarUrl) {
    return (
      <img
        src={resolvedAvatarUrl}
        alt={`${miniDoc.handle} avatar`}
        loading={loading}
        decoding="async"
        className={`${sizeClass} ${ringClass} shrink-0 rounded-full object-cover ring-ctp-surface-1`}
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
