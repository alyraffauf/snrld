import { useEffect, useState } from 'react'
import type { Repo } from '../lib/tangled'
import { getRecentCommits, type RepoCommit } from '../lib/tangled/repo'

export function useRepoCommits(repo: Repo, branch?: string) {
  const [commits, setCommits] = useState<RepoCommit[] | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadCommits() {
      setError(null)
      try {
        const response = await getRecentCommits(repo, { branch })
        if (!isCancelled) setCommits(response)
      } catch (caught) {
        if (!isCancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository log'))
        }
      }
    }

    void loadCommits()
    return () => {
      isCancelled = true
    }
  }, [branch, repo])

  return { commits, error }
}
