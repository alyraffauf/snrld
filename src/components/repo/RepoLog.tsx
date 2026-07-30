import type { Repo } from '../../lib/tangled'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { LoadingPanel } from '../shared/LoadingPanel'
import { RepoCommit as RepoCommitComponent } from './RepoCommit'
import { WorkspacePaneHeader } from './WorkspacePaneHeader'

type RepoLogProps = {
  branch?: string
  isActive: boolean
  repo: Repo
}

export function RepoLog({ branch, isActive, repo }: RepoLogProps) {
  const { commits, error } = useRepoCommits(repo, branch, isActive)

  if (error) {
    return <p role="alert">Could not load commits: {error.message}</p>
  }

  if (commits === null) {
    return <LoadingPanel label="Loading commits" className="h-64 rounded-none border-0" />
  }

  return (
    <section className="h-full font-mono" aria-labelledby="repository-commits">
      <div className="h-full overflow-hidden bg-ctp-mantle">
        <WorkspacePaneHeader labelledBy="repository-commits" title="Log" />

        {commits.length === 0 ? (
          <p className="px-4 py-4 text-sm text-ctp-subtext-1">No commits found.</p>
        ) : (
          <ul className="divide-y divide-ctp-surface-0">
            {commits.map((commit) => (
              <RepoCommitComponent key={commit.hash} commit={commit} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
