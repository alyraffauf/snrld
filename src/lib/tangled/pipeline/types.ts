import type { Pipeline as CiPipeline } from '../lexicons/types/org/tangled/ci/defs'

export type PipelineList = { items: CiPipeline[]; cursor?: string }
export type QueryPipelinesOptions = { cursor?: string; limit?: number }

export type { Pipeline } from '../lexicons/types/org/tangled/ci/defs'
