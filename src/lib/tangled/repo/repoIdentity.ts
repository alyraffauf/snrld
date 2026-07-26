import type { Repo } from './types'
import { getRecordRkey } from './recordIdentity'

export function getRepoRkey(repo: Repo): string {
  return getRecordRkey(repo.uri)
}

export function getRepoName(repo: Repo): string {
  return repo.value.name ?? getRepoRkey(repo)
}
