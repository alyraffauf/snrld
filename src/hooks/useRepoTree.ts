import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useRef, useState } from 'react'
import type { Repo } from '../lib/tangled'
import { getRepoTree, isDirectoryMode } from '../lib/tangled/repo'

type UseRepoTreeOptions = {
  initialTree?: RepoTreeResponse
  path: string
  repo: Repo
}

export function useRepoTree({ initialTree, path, repo }: UseRepoTreeOptions) {
  const cache = useRef(new Map<string, RepoTreeResponse>())
  const prefetching = useRef(new Set<string>())
  const [tree, setTree] = useState<RepoTreeResponse | null>(initialTree ?? null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    cache.current.clear()
    prefetching.current.clear()

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
      void prefetchDirectories(repo, cachedTree, path, cache.current, prefetching.current)
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
          void prefetchDirectories(repo, response, path, cache.current, prefetching.current)
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

async function prefetchDirectories(
  repo: Repo,
  tree: RepoTreeResponse,
  currentPath: string,
  cache: Map<string, RepoTreeResponse>,
  prefetching: Set<string>,
): Promise<void> {
  const directories = tree.files
    .filter((entry) => isDirectoryMode(entry.mode))
    .map((entry) => (currentPath ? `${currentPath}/${entry.name}` : entry.name))

  await Promise.all(
    directories.map(async (directoryPath) => {
      if (cache.has(directoryPath) || prefetching.has(directoryPath)) return

      prefetching.add(directoryPath)
      try {
        const childTree = await getRepoTree(repo, directoryPath)
        cache.set(directoryPath, childTree)
        await prefetchDirectories(repo, childTree, directoryPath, cache, prefetching)
      } catch {
        // Navigation retries directories whose background prefetch failed.
      } finally {
        prefetching.delete(directoryPath)
      }
    }),
  )
}
