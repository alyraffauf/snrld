import { parseResourceUri } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useIssueComments } from '../../hooks/useIssueComments'
import { useRecordActors } from '../../hooks/useRecordActors'
import type { ResolvedActor } from '../../lib/actor'
import type { CommentRecord } from '../../lib/tangled/feed'
import { ProfileAvatar } from '../profile/ProfileAvatar'
import { MarkdownContent } from '../shared/MarkdownContent'
import { SurfaceCard } from '../shared/SurfaceCard'

const EMPTY_COMMENTS: readonly CommentRecord[] = []
const COMMENT_SKELETON_COUNT = 3

type IssueCommentsProps = {
  issueUri: CommentRecord['value']['subject']['uri']
}

export function IssueComments({ issueUri }: IssueCommentsProps) {
  const { comments, error } = useIssueComments(issueUri)
  const { actors, error: actorsError } = useRecordActors(comments?.items ?? EMPTY_COMMENTS)

  if (error) {
    return <p role="alert">Could not load comments: {error.message}</p>
  }

  if (comments === null) {
    return <IssueCommentsSkeleton />
  }

  if (comments.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No comments yet.</p>
  }

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="flex items-center gap-2 font-mono text-lg">
        <IconMessageCircle size={18} stroke={1.75} aria-hidden="true" />
        Comments ({comments.items.length})
      </h2>
      {actorsError && (
        <p className="mt-2 text-sm">Some commenter profiles could not be resolved.</p>
      )}
      <ol className="mt-4 space-y-3">
        {comments.items.map((comment) => {
          const authorIdentifier = parseResourceUri(comment.uri).repo
          const author = isDid(authorIdentifier) ? actors?.get(authorIdentifier) : undefined

          return (
            <li key={comment.uri}>
              <CommentView comment={comment} author={author} />
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function IssueCommentsSkeleton() {
  return (
    <section aria-labelledby="comments-heading" aria-busy="true">
      <h2 id="comments-heading" className="flex items-center gap-2 font-mono text-lg">
        <IconMessageCircle size={18} stroke={1.75} aria-hidden="true" />
        Comments
      </h2>
      <p className="sr-only" role="status">
        Loading comments...
      </p>
      <ol className="mt-4 space-y-3" aria-hidden="true">
        {Array.from({ length: COMMENT_SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <SurfaceCard as="div" className="animate-pulse p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-ctp-surface-1" />
                  <div className="h-3 w-28 rounded bg-ctp-surface-1" />
                </div>
                <div className="h-3 w-24 rounded bg-ctp-surface-1" />
              </div>
              <div className="mt-4 space-y-2 border-t border-ctp-surface-1 pt-4">
                <div className="h-3 w-full rounded bg-ctp-surface-1" />
                <div className="h-3 w-4/5 rounded bg-ctp-surface-1" />
              </div>
            </SurfaceCard>
          </li>
        ))}
      </ol>
    </section>
  )
}

type CommentViewProps = {
  author?: ResolvedActor
  comment: CommentRecord
}

function CommentView({ author, comment }: CommentViewProps) {
  const authorDid = parseResourceUri(comment.uri).repo
  const authorLabel = author?.miniDoc.handle ?? authorDid

  return (
    <SurfaceCard as="article" className="p-4">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs">
        {author === undefined ? (
          <span className="text-ctp-subtext-0">{authorLabel}</span>
        ) : (
          <Link
            to={`/${author.miniDoc.handle}`}
            className="flex items-center gap-2 rounded-full font-semibold text-ctp-blue hover:text-ctp-sapphire focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ctp-blue"
          >
            <ProfileAvatar
              miniDoc={author.miniDoc}
              profile={author.profile}
              bskyProfile={author.bskyProfile}
              avatarUrl={author.avatarUrl}
              size="small"
            />
            {authorLabel}
          </Link>
        )}
        <time className="text-ctp-overlay-1" dateTime={comment.value.createdAt}>
          {new Date(comment.value.createdAt).toLocaleString()}
        </time>
      </header>
      <MarkdownContent className="mt-4 border-t border-ctp-surface-1 pt-4 text-sm text-ctp-subtext-1">
        {comment.value.body.text}
      </MarkdownContent>
    </SurfaceCard>
  )
}
