import type { Main as Pipeline } from '@atcute/tangled/types/ci/pipeline'

type PipelineWorkflowStatusesProps = {
  pipelines: readonly Pipeline[]
}

export function PipelineWorkflowStatuses({ pipelines }: PipelineWorkflowStatusesProps) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Pipeline statuses">
      {pipelines.flatMap((pipeline) =>
        pipeline.workflows.map((workflow) => (
          <li
            key={`${pipeline.id}:${workflow.id}`}
            className={`rounded px-2 py-1 font-mono text-xs ${getStatusClass(workflow.status)}`}
          >
            {workflow.name}: {workflow.status}
          </li>
        )),
      )}
    </ul>
  )
}

function getStatusClass(status: string | undefined) {
  if (status === 'success') return 'bg-ctp-green/20 text-ctp-green'
  if (status === 'failed' || status === 'timeout') return 'bg-ctp-red/20 text-ctp-red'
  if (status === 'running') return 'bg-ctp-blue/20 text-ctp-blue'
  return 'bg-ctp-surface-1 text-ctp-subtext-0'
}
