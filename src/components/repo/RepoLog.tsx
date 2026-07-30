import type { Did } from '@atcute/lexicons'
import type { Main as Pipeline } from '@atcute/tangled/types/ci/pipeline'
import type { Repo } from '../../lib/tangled'
import type { RepoCommit } from '../../lib/tangled/repo'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { useRepoPipelines } from '../../hooks/useRepoPipelines'
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
        ) : repo.value.repoDid !== undefined && repo.value.spindle !== undefined ? (
          <PipelineAwareCommitList
            commits={commits}
            isActive={isActive}
            repoDid={repo.value.repoDid}
            spindle={repo.value.spindle}
          />
        ) : (
          <CommitList commits={commits} />
        )}
      </div>
    </section>
  )
}

function PipelineAwareCommitList({
  commits,
  isActive,
  repoDid,
  spindle,
}: {
  commits: RepoCommit[]
  isActive: boolean
  repoDid: Did
  spindle: string
}) {
  const { pipelines } = useRepoPipelines(repoDid, spindle, isActive)
  const pipelinesByCommit = groupPipelinesByCommit(pipelines?.items ?? [])

  return <CommitList commits={commits} pipelinesByCommit={pipelinesByCommit} />
}

function CommitList({
  commits,
  pipelinesByCommit = new Map<string, Pipeline[]>(),
}: {
  commits: RepoCommit[]
  pipelinesByCommit?: ReadonlyMap<string, Pipeline[]>
}) {
  return (
    <ul className="divide-y divide-ctp-surface-0">
      {commits.map((commit) => (
        <RepoCommitComponent
          key={commit.hash}
          commit={commit}
          pipelines={pipelinesByCommit.get(commit.hash)}
        />
      ))}
    </ul>
  )
}

function groupPipelinesByCommit(pipelines: readonly Pipeline[]): Map<string, Pipeline[]> {
  const pipelinesByCommit = new Map<string, Pipeline[]>()

  for (const pipeline of pipelines) {
    const matchingPipelines = pipelinesByCommit.get(pipeline.commit)
    if (matchingPipelines === undefined) {
      pipelinesByCommit.set(pipeline.commit, [pipeline])
    } else {
      matchingPipelines.push(pipeline)
    }
  }

  return pipelinesByCommit
}
