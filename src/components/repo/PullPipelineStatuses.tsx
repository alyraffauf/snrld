import type { Did, ResourceUri } from '@atcute/lexicons'
import { useRepoPipelines } from '../../hooks/useRepoPipelines'
import { PipelineWorkflowStatuses } from './PipelineWorkflowStatuses'

type PullPipelineStatusesProps = {
  pullUri: ResourceUri
  repoDid?: Did
  spindle?: string
}

export function PullPipelineStatuses({ pullUri, repoDid, spindle }: PullPipelineStatusesProps) {
  if (repoDid === undefined || spindle === undefined) return null

  return <ConfiguredPullPipelineStatuses pullUri={pullUri} repoDid={repoDid} spindle={spindle} />
}

function ConfiguredPullPipelineStatuses({
  pullUri,
  repoDid,
  spindle,
}: Required<PullPipelineStatusesProps>) {
  const { pipelines, error } = useRepoPipelines(repoDid, spindle, true)

  if (error !== null || pipelines === null) return null

  const matchingPipelines = pipelines.items.filter(
    (pipeline) =>
      pipeline.trigger.$type === 'sh.tangled.ci.trigger#pullRequest' &&
      pipeline.trigger.pull === pullUri,
  )
  if (matchingPipelines.length === 0) return null

  return (
    <section className="mt-3" aria-label="Pipeline checks">
      <p className="mb-2 text-xs font-medium text-ctp-overlay-1">Checks</p>
      <ul className="space-y-2">
        {matchingPipelines.map((pipeline) => (
          <li key={pipeline.id}>
            <p className="mb-1 font-mono text-xs text-ctp-overlay-1">
              commit{' '}
              <code className="text-ctp-lavender" title={pipeline.commit}>
                {pipeline.commit.slice(0, 7)}
              </code>
            </p>
            <PipelineWorkflowStatuses pipelines={[pipeline]} />
          </li>
        ))}
      </ul>
    </section>
  )
}
