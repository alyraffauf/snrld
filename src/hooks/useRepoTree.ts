import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useRef, useState } from 'react'
import type { Repo } from '../lib/tangled'
import { getRepoTree } from '../lib/tangled/repo'

type UseRepoTreeOptions = {
  initialTree?: RepoTreeResponse
  path: string
  repo: Repo
}

export function useRepoTree({ initialTree, path, repo }: UseRepoTreeOptions) {
  const cache = useRef(new Map<string, RepoTreeResponse>())
  const [tree, setTree] = useState<RepoTreeResponse | null>(initialTree ?? null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    cache.current.clear()

    if (initialTree !== undefined) {
      cache.current.set('', initialTree)
    }

    setTree(initialTree ?? null)
    setError(null)
  }, [initialTree, repo.uri])

  useEffect(() => {
    let isCancelled = false
    const cachedTree = cache.current.get(path)

    if (cachedTree !== undefined) {
      setTree(cachedTree)
      setError(null)
      return
    }

    async function loadTree() {
      setTree(null)
      setError(null)

      try {
        const response = await getRepoTree(repo, path)
        cache.current.set(path, response)

        if (!isCancelled) {
          setTree(response)
        }
      } catch (caught) {
        if (!isCancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository tree'))
        }
      }
    }

    void loadTree()

    return () => {
      isCancelled = true
    }
  }, [path, repo])

  return { error, tree }
}
