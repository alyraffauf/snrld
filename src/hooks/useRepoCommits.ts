import { useCallback } from 'react'
import type { Repo } from '../lib/tangled'
import { getRecentCommits, type RepoCommit } from '../lib/tangled/repo'
import { useDeferredResource } from './useDeferredResource'

export function useRepoCommits(repo: Repo, branch: string | undefined, isEnabled: boolean) {
  const loadCommits = useCallback(
    (): Promise<RepoCommit[]> => getRecentCommits(repo, { branch }),
    [branch, repo],
  )
  const key = isEnabled ? `${repo.uri}:${branch ?? 'default'}` : null
  const { data: commits, error } = useDeferredResource(key, isEnabled, loadCommits)

  return { commits, error }
}
