import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { ResolvedActor } from '../../lib/actor'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { MarkdownContent } from '../shared/MarkdownContent'
import { SurfaceCard } from '../shared/SurfaceCard'

type RepoRecordViewProps = {
  author: ResolvedActor
  body?: string
  createdAt: string
  details?: ReactNode
  mentions?: string[]
  references?: string[]
  title: string
}

export function RepoRecordView({
  author,
  body,
  createdAt,
  details,
  mentions,
  references,
  title,
}: RepoRecordViewProps) {
  const { description } = author.profile.value

  return (
    <SurfaceCard as="article" className="p-4 sm:p-6">
      <header>
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={`/${author.miniDoc.handle}`}
            className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-blue"
            aria-label={`View ${author.miniDoc.handle}'s profile`}
          >
            <ProfileAvatar
              miniDoc={author.miniDoc}
              profile={author.profile}
              bskyProfile={author.bskyProfile}
              avatarUrl={author.avatarUrl}
              size="small"
            />
          </Link>
          <div className="min-w-0">
            <Link
              to={`/${author.miniDoc.handle}`}
              className="block truncate font-mono text-sm font-semibold text-ctp-blue hover:text-ctp-sapphire"
            >
              {author.miniDoc.handle}
            </Link>
            {description && (
              <p className="mt-1 line-clamp-2 text-sm text-ctp-subtext-0">{description}</p>
            )}
          </div>
        </div>

        <h1 className="mt-5 font-mono text-2xl font-bold text-ctp-text">{title}</h1>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-ctp-overlay-1">
          <div className="flex gap-1.5">
            <dt>Opened</dt>
            <dd>
              <time dateTime={createdAt}>{new Date(createdAt).toLocaleString()}</time>
            </dd>
          </div>
          {mentions && mentions.length > 0 && (
            <RecordCount label="Mentions" count={mentions.length} />
          )}
          {references && references.length > 0 && (
            <RecordCount label="References" count={references.length} />
          )}
        </dl>
        {details && <div className="mt-4">{details}</div>}
      </header>

      {body && (
        <MarkdownContent className="mt-6 border-t border-ctp-surface-1 pt-6 text-sm text-ctp-subtext-1">
          {body}
        </MarkdownContent>
      )}
    </SurfaceCard>
  )
}

function RecordCount({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex gap-1.5">
      <dt>{label}</dt>
      <dd>{count}</dd>
    </div>
  )
}
