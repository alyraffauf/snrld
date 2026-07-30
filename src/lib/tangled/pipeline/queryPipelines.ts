import { Client, ok, simpleFetchHandler, type FetchHandler } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as queryPipelinesSchema } from '@atcute/tangled/types/ci/queryPipelines'
import { removeNullCursor } from '../utils'
import type { PipelineList, QueryPipelinesOptions } from './types'

export async function queryPipelines(
  spindle: string,
  repo: Did,
  options: QueryPipelinesOptions = {},
): Promise<PipelineList> {
  const rpc = new Client({ handler: getSpindleFetchHandler(spindle) })
  const response = await ok(
    rpc.get('sh.tangled.ci.queryPipelines', { params: { repo, ...options } }),
  )
  const validation = safeParse(queryPipelinesSchema.output.schema, removeNullCursor(response))
  if (!validation.ok) throw new Error(`Spindle returned invalid pipelines: ${validation.message}`)

  return { items: validation.value.pipelines, cursor: validation.value.cursor }
}

function getSpindleFetchHandler(spindle: string): FetchHandler {
  const spindleUrl =
    spindle.startsWith('http://') || spindle.startsWith('https://') ? spindle : `https://${spindle}`

  if (!import.meta.env.DEV) return simpleFetchHandler({ service: spindleUrl })

  const hostname = new URL(spindleUrl).hostname
  const proxyUrl = `${window.location.origin}/spindle/${encodeURIComponent(hostname)}`
  return (pathname, init) => fetch(`${proxyUrl}${pathname}`, init)
}
