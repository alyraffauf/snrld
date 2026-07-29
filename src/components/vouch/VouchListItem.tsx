import { IconThumbDown, IconThumbUp } from '@tabler/icons-react'
import { parseResourceUri } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { Link } from 'react-router-dom'
import { useVisibleActor } from '../../hooks/useVisibleActor'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { SurfaceCard } from '../shared/SurfaceCard'
import type { VouchRecord } from '../../lib/tangled/graph'

type VouchListItemProps = {
  vouchRecord: VouchRecord
}

export function VouchListItem({ vouchRecord }: VouchListItemProps) {
  const { value } = vouchRecord
  const authorIdentifier = parseResourceUri(vouchRecord.uri).repo
  const { actor, elementRef } = useVisibleActor(isDid(authorIdentifier) ? authorIdentifier : null)
  const isDenouncement = value.kind === 'denounce'
  const actionLabel = isDenouncement ? 'Denounces' : 'Vouches'
  const actionColor = isDenouncement ? 'text-ctp-red' : 'text-ctp-green'
  const borderColor = isDenouncement ? 'border-l-ctp-red' : 'border-l-ctp-green'
  const ActionIcon = isDenouncement ? IconThumbDown : IconThumbUp

  return (
    <div ref={elementRef}>
      <SurfaceCard as="article" className={`border-l-4 p-3 sm:p-4 ${borderColor}`}>
        <header className="flex items-center gap-3">
          {actor ? (
            <Link
              to={`/${actor.miniDoc.handle}`}
              aria-label={`View ${actor.miniDoc.handle}'s profile`}
              className="group flex min-w-0 flex-1 items-center gap-3"
            >
              <ProfileAvatar
                miniDoc={actor.miniDoc}
                profile={actor.profile}
                bskyProfile={actor.bskyProfile}
                avatarUrl={actor.avatarUrl}
                size="small"
              />

              <span className="truncate font-semibold text-ctp-text group-hover:text-ctp-lavender">
                {actor.miniDoc.handle}
              </span>
            </Link>
          ) : (
            <span className="flex min-w-0 flex-1 items-center gap-3 text-ctp-subtext-0">
              <span className="size-8 rounded-full bg-ctp-surface-1" />
              {authorIdentifier}
            </span>
          )}

          <span
            className={`flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide ${actionColor}`}
          >
            <ActionIcon size={14} stroke={2} aria-hidden="true" />
            {actionLabel}
          </span>

          <time
            dateTime={value.createdAt}
            className="shrink-0 text-xs text-ctp-overlay-1 sm:text-sm"
          >
            {new Date(value.createdAt).toLocaleDateString()}
          </time>
        </header>

        {value.reason && (
          <p className="mt-3 border-t border-ctp-surface-1 pt-3 text-sm leading-relaxed text-ctp-subtext-1">
            {value.reason}
          </p>
        )}
      </SurfaceCard>
    </div>
  )
}
