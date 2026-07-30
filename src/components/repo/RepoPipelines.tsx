import type { Did } from '@atcute/lexicons'
import { IconRoute } from '@tabler/icons-react'
import { useRepoPipelines } from '../../hooks/useRepoPipelines'
import type { Main as Pipeline } from '@atcute/tangled/types/ci/pipeline'
import { LoadMoreButton } from '../shared/LoadMoreButton'
import { SurfaceCard } from '../shared/SurfaceCard'

export function RepoPipelines({
  isActive,
  repoDid,
  spindle,
}: {
  isActive: boolean
  repoDid: Did
  spindle?: string
}) {
  if (spindle === undefined)
    return (
      <p className="text-sm text-ctp-subtext-0">
        Pipelines are not configured for this repository.
      </p>
    )

  return <ConfiguredRepoPipelines isActive={isActive} repoDid={repoDid} spindle={spindle} />
}

function ConfiguredRepoPipelines({
  isActive,
  repoDid,
  spindle,
}: {
  isActive: boolean
  repoDid: Did
  spindle: string
}) {
  const { pipelines, error, hasMore, isLoadingMore, loadMore } = useRepoPipelines(
    repoDid,
    spindle,
    isActive,
  )

  if (error && pipelines === null)
    return <p role="alert">Could not load pipelines: {error.message}</p>
  if (pipelines === null) return <p>Loading pipelines...</p>
  if (pipelines.items.length === 0)
    return <p className="text-sm text-ctp-subtext-0">No pipelines found.</p>

  return (
    <>
      <ul className="space-y-3" aria-label="Pipelines">
        {pipelines.items.map((pipeline) => (
          <li key={pipeline.id}>
            <PipelineCard pipeline={pipeline} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="mt-4">
          <LoadMoreButton
            label="Pipelines"
            isLoading={isLoadingMore}
            onClick={() => void loadMore()}
          />
        </div>
      )}
      {error && (
        <p className="mt-2" role="alert">
          Could not load more pipelines: {error.message}
        </p>
      )}
    </>
  )
}

function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  return (
    <SurfaceCard as="article" className="p-4">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-sm text-ctp-text">
          <IconRoute size={16} stroke={1.75} aria-hidden="true" />
          {getTriggerName(pipeline)}
        </div>
        <span className="font-mono text-xs text-ctp-overlay-1">
          {getTriggerReference(pipeline)}
        </span>
      </header>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Workflow statuses">
        {pipeline.workflows.map((workflow) => (
          <li
            key={workflow.id}
            className={`rounded px-2 py-1 font-mono text-xs ${getStatusClass(workflow.status)}`}
          >
            {workflow.name}: {workflow.status}
          </li>
        ))}
      </ul>
    </SurfaceCard>
  )
}

function getTriggerName(pipeline: Pipeline) {
  const type = pipeline.trigger.$type
  if (type === 'sh.tangled.ci.trigger#pullRequest') return 'pull request'
  if (type === 'sh.tangled.ci.trigger#push') return 'push'
  return 'manual'
}

function getTriggerReference(pipeline: Pipeline) {
  const { trigger } = pipeline
  if (trigger.$type === 'sh.tangled.ci.trigger#push') return trigger.ref
  if (trigger.$type === 'sh.tangled.ci.trigger#pullRequest') return trigger.targetBranch
  return trigger.ref ?? trigger.sha.slice(0, 7)
}

function getStatusClass(status: string | undefined) {
  if (status === 'success') return 'bg-ctp-green/20 text-ctp-green'
  if (status === 'failed' || status === 'timeout') return 'bg-ctp-red/20 text-ctp-red'
  if (status === 'running') return 'bg-ctp-blue/20 text-ctp-blue'
  return 'bg-ctp-surface-1 text-ctp-subtext-0'
}
