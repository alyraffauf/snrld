import { ok } from '../response'
import { Client, simpleFetchHandler, type FetchHandler } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as queryPipelinesSchema } from '../lexicons/types/org/tangled/ci/queryPipelines'
import { removeNullCursor } from '../utils'
import type { PipelineList, QueryPipelinesOptions } from './types'

export async function queryPipelines(
  spindle: string,
  repo: Did,
  options: QueryPipelinesOptions = {},
): Promise<PipelineList> {
  const rpc = new Client({ handler: getSpindleFetchHandler(spindle) })
  const response = await ok(
    rpc.get('org.tangled.ci.queryPipelines', { params: { repo, ...options } }),
  )
  const validation = safeParse(
    queryPipelinesSchema.output.schema,
    normalizePipelineResponse(response),
  )
  if (!validation.ok) throw new Error(`Spindle returned invalid pipelines: ${validation.message}`)

  return { items: validation.value.pipelines, cursor: validation.value.cursor }
}

function normalizePipelineResponse(value: unknown): unknown {
  const response = removeNullCursor(value)
  if (typeof response !== 'object' || response === null || Array.isArray(response)) {
    return response
  }

  // Older Spindle versions serialize an empty pipeline list as null.
  if ('pipelines' in response && response.pipelines === null) {
    return { ...response, pipelines: [] }
  }

  return response
}

function getSpindleFetchHandler(spindle: string): FetchHandler {
  return simpleFetchHandler({ service: spindleServiceUrl(spindle) })
}

export function spindleServiceUrl(identifier: string): string {
  if (identifier.startsWith('did:web:')) {
    const [host, ...path] = identifier.slice(8).split(':').map(decodeURIComponent)
    return new URL(`https://${host}/${path.join('/')}`).toString().replace(/\/$/, '')
  }
  const url = new URL(identifier.includes('://') ? identifier : `https://${identifier}`)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid Spindle URL')
  return url.toString().replace(/\/$/, '')
}
