import type { Main as CiPipeline } from '@atcute/tangled/types/ci/pipeline'

export type PipelineList = { items: CiPipeline[]; cursor?: string }
export type QueryPipelinesOptions = { cursor?: string; limit?: number }
