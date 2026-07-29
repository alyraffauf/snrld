import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useRef, useState } from 'react'
import type { Repo } from '../lib/tangled'
import { getRepoTree } from '../lib/tangled/repo'

type RootTreeState = {
  error?: Error
  key: string
  tree?: RepoTreeResponse
}

export function useRepoRootTree(repo: Repo | null, isEnabled: boolean) {
  const cache = useRef(new Map<string, RepoTreeResponse>())
  const requests = useRef(new Map<string, Promise<RepoTreeResponse>>())
  const [state, setState] = useState<RootTreeState | null>(null)
  const repoKey = repo?.uri ?? null

  useEffect(() => {
    if (repo === null || !isEnabled) return

    const cachedTree = cache.current.get(repo.uri)
    if (cachedTree !== undefined) {
      setState({ key: repo.uri, tree: cachedTree })
      return
    }

    let isCancelled = false
    setState({ key: repo.uri })

    const request = getRootTree(repo, requests.current)
    void request
      .then((tree) => {
        cache.current.set(repo.uri, tree)
        if (!isCancelled) setState({ key: repo.uri, tree })
      })
      .catch((caught) => {
        if (!isCancelled) {
          setState({
            key: repo.uri,
            error:
              caught instanceof Error ? caught : new Error('Unable to load repository contents'),
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [isEnabled, repo])

  const isCurrentRepository = state?.key === repoKey
  return {
    error: isCurrentRepository ? (state.error ?? null) : null,
    rootTree: isCurrentRepository ? (state.tree ?? null) : null,
  }
}

function getRootTree(repo: Repo, requests: Map<string, Promise<RepoTreeResponse>>) {
  const existingRequest = requests.get(repo.uri)
  if (existingRequest !== undefined) return existingRequest

  const request = getRepoTree(repo).finally(() => {
    requests.delete(repo.uri)
  })
  requests.set(repo.uri, request)
  return request
}
