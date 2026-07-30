import { useCallback } from 'react'
import type { Repo } from '../lib/tangled'
import { getRepoTree } from '../lib/tangled/repo'
import { useDeferredResource } from './useDeferredResource'

export function useRepoRootTree(repo: Repo | null, isEnabled: boolean) {
  const loadRootTree = useCallback(async () => {
    if (repo === null) throw new Error('Repository is required to load its root tree')

    return getRepoTree(repo)
  }, [repo])
  const { data, error } = useDeferredResource(repo?.uri ?? null, isEnabled, loadRootTree)

  return { error, rootTree: data }
}
