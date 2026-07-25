import type { Did } from '@atcute/lexicons'
import { IconGitPullRequest, IconMessageCircle } from '@tabler/icons-react'
import { useRepoPulls } from '../../hooks/useRepoPulls'
import { SurfaceCard } from '../shared/SurfaceCard'

type RepoPullsProps = {
  repoDid: Did
}

export function RepoPulls({ repoDid }: RepoPullsProps) {
  const { pulls, error } = useRepoPulls(repoDid)

  if (error) {
    return <p role="alert">Could not load pulls: {error.message}</p>
  }

  if (pulls === null) {
    return <p>Loading pulls...</p>
  }

  if (pulls.items.length === 0) {
    return <p className="text-sm text-ctp-subtext-0">No pulls found.</p>
  }

  return (
    <ul className="space-y-3" aria-label="Pull requests">
      {pulls.items.map((pull) => {
        const stateClassName =
          pull.state === 'open'
            ? 'text-ctp-teal'
            : pull.state === 'merged'
              ? 'text-ctp-mauve'
              : 'text-ctp-overlay-1'

        return (
          <li key={pull.uri}>
            <SurfaceCard as="article" className="p-4">
              <div className="flex items-center justify-between gap-4 font-mono text-xs">
                <span className={`inline-flex items-center gap-1.5 ${stateClassName}`}>
                  <IconGitPullRequest size={15} stroke={1.75} aria-hidden="true" />
                  {pull.state}
                </span>

                <span className="inline-flex items-center gap-1.5 text-ctp-subtext-0">
                  <IconMessageCircle size={15} stroke={1.75} aria-hidden="true" />
                  {pull.commentCount}
                </span>
              </div>

              <h2 className="mt-3 text-base font-semibold text-ctp-text">{pull.value.title}</h2>
            </SurfaceCard>
          </li>
        )
      })}
    </ul>
  )
}
