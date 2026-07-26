import { parseResourceUri } from '@atcute/lexicons'
import type { Repo } from './types'

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
