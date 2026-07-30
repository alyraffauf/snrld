import { ok } from '@atcute/client'
import { parseResourceUri, type ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import type { Repo } from '../repo'
import { validateRepo } from '../repo/validators'

const REPOSITORY_COLLECTION = 'sh.tangled.repo'

export async function searchRepos(query: string, signal: AbortSignal, limit = 8): Promise<Repo[]> {
  const response = await ok(
    rpc.get('sh.tangled.search.query', {
      signal,
      params: {
        q: query,
        nsid: REPOSITORY_COLLECTION,
        limit,
      },
    }),
  )

  return validateSearchResponse(response)
}

function validateSearchResponse(response: unknown): Repo[] {
  if (!isRecord(response) || !Array.isArray(response.hits)) {
    throw new Error('Bobbin returned an invalid search response.')
  }

  return response.hits.map((hit, index) => validateSearchHit(hit, index))
}

function validateSearchHit(hit: unknown, index: number): Repo {
  if (!isRecord(hit) || hit.nsid !== REPOSITORY_COLLECTION || typeof hit.uri !== 'string') {
    throw new Error(`Bobbin returned an invalid repository search hit at index ${index}.`)
  }

  try {
    parseResourceUri(hit.uri)
  } catch {
    throw new Error(`Bobbin returned an invalid repository URI at index ${index}.`)
  }

  return validateRepo({ uri: hit.uri as ResourceUri, value: hit.value })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
