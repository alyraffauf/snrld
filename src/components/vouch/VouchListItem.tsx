import { IconThumbDown, IconThumbUp } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import type { ResolvedActor } from '../../lib/actor'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { SurfaceCard } from '../shared/SurfaceCard'
import type { VouchRecord } from '../../lib/tangled/graph'

type VouchListItemProps = {
  vouchRecord: VouchRecord
  author: ResolvedActor
}

export function VouchListItem({ vouchRecord, author }: VouchListItemProps) {
  const { value } = vouchRecord
  const isDenouncement = value.kind === 'denounce'
  const actionLabel = isDenouncement ? 'Denounces' : 'Vouches'
  const actionColor = isDenouncement ? 'text-ctp-red' : 'text-ctp-green'
  const borderColor = isDenouncement ? 'border-l-ctp-red' : 'border-l-ctp-green'
  const ActionIcon = isDenouncement ? IconThumbDown : IconThumbUp

  return (
    <SurfaceCard as="article" className={`border-l-4 p-3 sm:p-4 ${borderColor}`}>
      <header className="flex items-center gap-3">
        <Link
          to={`/${author.miniDoc.handle}`}
          aria-label={`View ${author.miniDoc.handle}'s profile`}
          className="group flex min-w-0 flex-1 items-center gap-3"
        >
          <ProfileAvatar
            miniDoc={author.miniDoc}
            profile={author.profile}
            bskyProfile={author.bskyProfile}
            avatarUrl={author.avatarUrl}
            size="small"
          />

          <span className="truncate font-semibold text-ctp-text group-hover:text-ctp-lavender">
            {author.miniDoc.handle}
          </span>
        </Link>

        <span
          className={`flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide ${actionColor}`}
        >
          <ActionIcon size={14} stroke={2} aria-hidden="true" />
          {actionLabel}
        </span>

        <time dateTime={value.createdAt} className="shrink-0 text-xs text-ctp-overlay-1 sm:text-sm">
          {new Date(value.createdAt).toLocaleDateString()}
        </time>
      </header>

      {value.reason && (
        <p className="mt-3 border-t border-ctp-surface-1 pt-3 text-sm leading-relaxed text-ctp-subtext-1">
          {value.reason}
        </p>
      )}
    </SurfaceCard>
  )
}
