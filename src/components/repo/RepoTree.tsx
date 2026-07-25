import { IconChevronRight, IconCornerLeftUp, IconFile, IconFolder } from '@tabler/icons-react'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Repo } from '../../lib/tangled'
import { getRepoTree } from '../../lib/tangled/repo'
import { LoadingPanel } from '../shared/LoadingPanel'
import { WorkspacePaneHeader } from './WorkspacePaneHeader'

type RepoTreeProps = {
  initialTree?: RepoTreeResponse
  repo: Repo
}

export function RepoTree({ initialTree, repo }: RepoTreeProps) {
  const cache = useRef(new Map<string, RepoTreeResponse>())
  const prefetching = useRef(new Set<string>())
  const [searchParams, setSearchParams] = useSearchParams()
  const path = searchParams.get('path') ?? ''
  const [tree, setTree] = useState<RepoTreeResponse | null>(initialTree ?? null)
  const [error, setError] = useState<Error | null>(null)

  function navigateToPath(nextPath: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (nextPath === '') {
          next.delete('path')
        } else {
          next.set('path', nextPath)
        }
        return next
      },
      { replace: true },
    )
  }

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
    let cancelled = false
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

        if (!cancelled) {
          setTree(response)
          void prefetchDirectories(repo, response, path, cache.current, prefetching.current)
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
  }, [path, repo])

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
            <span className="flex min-w-0 items-baseline gap-2">
              <span>Tree</span>
              <TreePath path={path} onNavigate={navigateToPath} />
            </span>
          }
          trailing={
            <span className="rounded bg-ctp-surface-0 px-2 py-1 font-mono text-sm text-ctp-subtext-1">
              {tree.ref}
            </span>
          }
        />

        <ul className="flex-1 divide-y divide-ctp-surface-0 overflow-hidden bg-ctp-mantle">
          {path !== '' && (
            <li>
              <button
                type="button"
                onClick={() => navigateToPath(getParentPath(path))}
                className="flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-sm text-ctp-subtext-0 transition-colors hover:bg-ctp-surface-0/40 hover:text-ctp-text"
              >
                <IconCornerLeftUp
                  size={16}
                  stroke={1.75}
                  aria-hidden="true"
                  className="text-ctp-yellow"
                />
                ..
              </button>
            </li>
          )}

          {sortedFiles.map((entry) => (
            <TreeEntryRow
              key={entry.name}
              entry={entry}
              currentPath={path}
              onNavigate={navigateToPath}
            />
          ))}
        </ul>

        {tree.files.length === 0 && (
          <p className="px-4 py-3 text-sm text-ctp-subtext-0">This directory is empty.</p>
        )}
      </div>
    </section>
  )
}

type TreeEntry = RepoTreeResponse['files'][number]

type TreeEntryRowProps = {
  entry: TreeEntry
  currentPath: string
  onNavigate: (path: string) => void
}

function TreeEntryRow({ entry, currentPath, onNavigate }: TreeEntryRowProps) {
  const isDirectory = isDirectoryMode(entry.mode)
  const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name
  const content = (
    <span className="flex min-w-0 items-center gap-3 font-mono text-sm text-ctp-text">
      {isDirectory ? (
        <IconFolder size={16} stroke={1.75} aria-hidden="true" className="text-ctp-yellow" />
      ) : (
        <IconFile size={16} stroke={1.75} aria-hidden="true" className="text-ctp-overlay-1" />
      )}
      <span className="truncate">{entry.name}</span>
      {isDirectory && (
        <IconChevronRight
          size={14}
          stroke={1.75}
          aria-hidden="true"
          className="shrink-0 text-ctp-overlay-1"
        />
      )}
    </span>
  )

  return (
    <li>
      {isDirectory ? (
        <button
          type="button"
          onClick={() => onNavigate(entryPath)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-mono text-sm text-ctp-text transition-colors hover:bg-ctp-surface-0/40 hover:text-ctp-lavender"
        >
          {content}
          <span className="shrink-0 text-ctp-subtext-0">directory</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          {content}
          <span className="shrink-0 font-mono text-sm text-ctp-subtext-0">
            {formatBytes(entry.size)}
          </span>
        </div>
      )}
    </li>
  )
}

type TreePathProps = {
  path: string
  onNavigate: (path: string) => void
}

function TreePath({ path, onNavigate }: TreePathProps) {
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) {
    return <span className="font-mono text-sm font-normal text-ctp-subtext-0">/</span>
  }

  return (
    <span className="flex min-w-0 items-baseline gap-1 font-mono text-sm font-normal">
      <span className="text-ctp-subtext-0">/</span>
      <button
        type="button"
        onClick={() => onNavigate('')}
        className="truncate text-ctp-subtext-0 hover:text-ctp-lavender"
        aria-label="Repository root"
      >
        root
      </button>
      {segments.map((segment, index) => {
        const segmentPath = segments.slice(0, index + 1).join('/')

        return (
          <span key={segmentPath} className="flex min-w-0 items-baseline gap-1">
            <span className="text-ctp-subtext-0">/</span>
            <button
              type="button"
              onClick={() => onNavigate(segmentPath)}
              className="truncate text-ctp-subtext-0 hover:text-ctp-lavender"
            >
              {segment}
            </button>
          </span>
        )
      })}
    </span>
  )
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

function getParentPath(path: string): string {
  const separatorIndex = path.lastIndexOf('/')
  return separatorIndex === -1 ? '' : path.slice(0, separatorIndex)
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
