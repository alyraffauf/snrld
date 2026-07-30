import { useCallback } from 'react'
import type { Repo } from '../lib/tangled'
import { getRecentCommits, type RepoCommit } from '../lib/tangled/repo'
import { useDeferredResource } from './useDeferredResource'

export function useRepoCommits(repo: Repo, branch?: string) {
  const loadCommits = useCallback(
    (): Promise<RepoCommit[]> => getRecentCommits(repo, { branch }),
    [branch, repo],
  )
  const key = `${repo.uri}:${branch ?? 'default'}`
  const { data: commits, error } = useDeferredResource(key, true, loadCommits)

  return { commits, error }
}
