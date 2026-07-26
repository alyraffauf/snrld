import type { Handle } from '@atcute/lexicons'
import { IconRss } from '@tabler/icons-react'
import { RepoActionControl } from './RepoActionControl'

type RepoAtomFeedProps = {
  handle: Handle
  repoKey: string
}

export function RepoAtomFeed({ handle, repoKey }: RepoAtomFeedProps) {
  const atomFeedUrl = `https://tangled.org/${encodeURIComponent(handle)}/${encodeURIComponent(repoKey)}/feed.atom`

  return (
    <div className="hidden sm:block">
      <RepoActionControl ariaLabel="Repository Atom feed" href={atomFeedUrl}>
        <IconRss size={16} stroke={1.75} aria-hidden="true" className="text-ctp-lavender" />
      </RepoActionControl>
    </div>
  )
}
