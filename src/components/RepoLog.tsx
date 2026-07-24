import { useEffect, useState } from 'react'
import type { Repo } from '../lib/tangled'
import { getRecentCommits, type RepoCommit } from '../lib/tangled/repo'
import { RepoCommit as RepoCommitComponent } from './RepoCommit'

type RepoLogProps = {
  repo: Repo
}

export function RepoLog({ repo }: RepoLogProps) {
  const [commits, setCommits] = useState<RepoCommit[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadLog() {
      setError(null)

      try {
        const response = await getRecentCommits(repo)
        if (!cancelled) setCommits(response)
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository log'))
        }
      }
    }

    void loadLog()

    return () => {
      cancelled = true
    }
  }, [repo])

  if (error) {
    return <p role="alert">Could not load commits: {error.message}</p>
  }

  if (commits === null) {
    return <p aria-busy="true">Loading commits...</p>
  }

  return (
    <section className="h-full font-mono" aria-labelledby="repository-commits">
      <div className="h-full overflow-hidden bg-ctp-mantle">
        <div className="flex items-center justify-between border-b border-ctp-surface-1 px-4 py-3">
          <h2 id="repository-commits" className="font-mono text-base font-semibold text-ctp-text">
            Log
          </h2>
          {/* <span className="rounded bg-ctp-surface-0 px-2 py-1 font-mono text-xs text-ctp-subtext-1">
                        {commits.length}
                    </span> */}
        </div>

        {commits.length === 0 ? (
          <p className="px-4 py-4 text-sm text-ctp-subtext-1">No commits found.</p>
        ) : (
          <ul className="divide-y divide-ctp-surface-0">
            {commits.map((commit) => (
              <RepoCommitComponent commit={commit} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
