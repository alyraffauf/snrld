import type { Cid, ResourceUri } from '@atcute/lexicons'
import { parseResourceUri, safeParse } from '@atcute/lexicons'
import type { Main as TangledRepo } from '@atcute/tangled/types/repo'
import { mainSchema as repoSchema } from '@atcute/tangled/types/repo'

export type Repo = {
  cid?: Cid
  uri: ResourceUri
  value: TangledRepo
}

export type RepoList = {
  items: Repo[]
  cursor?: string
}

export function getRepoRkey(repo: Repo): string {
  const { rkey } = parseResourceUri(repo.uri)
  if (rkey === undefined) {
    throw new Error(`Repository URI has no record key: ${repo.uri}`)
  }

  return rkey
}

export function getRepoName(repo: Repo): string {
  return repo.value.name ?? getRepoRkey(repo)
}

export function validateRepo(repo: { cid?: Cid; uri: ResourceUri; value: unknown }): Repo {
  const validation = safeParse(repoSchema, normalizeRepoRecord(repo.value))
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid repo record: ${repo.uri}: ${validation.message}`)
  }

  return { ...repo, value: validation.value }
}

function normalizeRepoRecord(value: unknown): unknown {
  if (!isRecord(value)) return value

  const normalized = { ...value }
  if (typeof normalized.description === 'string') {
    const graphemes = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(normalized.description),
      ({ segment }) => segment,
    )

    if (graphemes.length === 0) {
      delete normalized.description
    } else if (graphemes.length > 140) {
      normalized.description = graphemes.slice(0, 140).join('')
    }
  }

  return normalized
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
