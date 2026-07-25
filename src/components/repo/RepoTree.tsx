import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useState } from 'react'
import type { Repo } from '../../lib/tangled'
import { getRepoTree } from '../../lib/tangled/repo'
import { LoadingPanel } from '../shared/LoadingPanel'
import { WorkspacePaneHeader } from './WorkspacePaneHeader'

type RepoTreeProps = {
  initialTree?: RepoTreeResponse
  repo: Repo
}

export function RepoTree({ initialTree, repo }: RepoTreeProps) {
  const [path, setPath] = useState('')
  const [tree, setTree] = useState<RepoTreeResponse | null>(initialTree ?? null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setPath('')
    setTree(initialTree ?? null)
  }, [initialTree, repo.uri])

  useEffect(() => {
    let cancelled = false

    if (path === '' && initialTree !== undefined) {
      return
    }

    async function loadTree() {
      setTree(null)
      setError(null)

      try {
        const response = await getRepoTree(repo, path)
        if (!cancelled) {
          setTree(response)
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load repository tree'))
        }
      }
    }

    void loadTree()

    return () => {
      cancelled = true
    }
  }, [initialTree, repo, path])

  if (error) {
    return <p role="alert">Could not load files: {error.message}</p>
  }

  if (tree === null) {
    return <LoadingPanel label="Loading files" className="h-64 rounded-none border-0" />
  }

  const sortedFiles = [...tree.files].sort((a, b) => {
    const aIsDirectory = isDirectoryMode(a.mode)
    const bIsDirectory = isDirectoryMode(b.mode)

    if (aIsDirectory !== bIsDirectory) {
      return aIsDirectory ? -1 : 1
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  })

  return (
    <section className="flex h-full flex-col font-mono" aria-labelledby="repository-files">
      <div className="flex h-full flex-col">
        <WorkspacePaneHeader
          labelledBy="repository-files"
          title={
            <span className="flex items-baseline gap-3">
              <span>Tree</span>
              <span className="font-mono text-sm font-normal text-ctp-subtext-0">/{path}</span>
            </span>
          }
          trailing={
            <span className="rounded bg-ctp-surface-0 px-2 py-1 font-mono text-sm text-ctp-subtext-1">
              {tree.ref}
            </span>
          }
        />

        <ul className="flex-1 divide-y divide-ctp-surface-0 overflow-hidden bg-ctp-mantle">
          {(tree.parent ?? tree.dotdot) && (
            <li>
              <button
                type="button"
                onClick={() => setPath(tree.parent ?? tree.dotdot ?? '')}
                className="flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-sm text-ctp-subtext-0 transition-colors hover:bg-ctp-surface-0/40 hover:text-ctp-text"
              >
                <span aria-hidden="true" className="w-4 text-center text-ctp-yellow">
                  ↩
                </span>
                ..
              </button>
            </li>
          )}

          {sortedFiles.map((entry) => {
            const isDirectory = isDirectoryMode(entry.mode)
            const entryPath = path ? `${path}/${entry.name}` : entry.name

            return (
              <li
                key={entry.name}
                className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-ctp-surface-0/40"
              >
                {isDirectory ? (
                  <button
                    type="button"
                    onClick={() => setPath(entryPath)}
                    className="flex min-w-0 items-center truncate font-mono text-sm text-ctp-text hover:text-ctp-lavender"
                  >
                    <span aria-hidden="true" className="mr-3 w-4 text-center text-ctp-yellow">
                      ▸
                    </span>
                    {entry.name}
                  </button>
                ) : (
                  <span className="flex min-w-0 items-center truncate font-mono text-sm text-ctp-text">
                    <span aria-hidden="true" className="mr-3 w-4 text-center text-ctp-yellow">
                      ·
                    </span>
                    {entry.name}
                  </span>
                )}
                <span className="shrink-0 font-mono text-sm text-ctp-subtext-0">
                  {isDirectory ? 'directory' : formatBytes(entry.size)}
                </span>
              </li>
            )
          })}
        </ul>

        {tree.files.length === 0 && (
          <p className="mt-3 text-sm text-ctp-subtext-0">This directory is empty.</p>
        )}
      </div>
    </section>
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

function isDirectoryMode(mode: string): boolean {
  const normalized = mode.toLowerCase()

  return (
    normalized === 'tree' ||
    normalized === 'dir' ||
    normalized === 'directory' ||
    normalized === '40000' ||
    normalized === '040000' ||
    normalized.endsWith('40000')
  )
}
