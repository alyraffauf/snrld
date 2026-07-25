import { IconCornerLeftUp } from '@tabler/icons-react'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useSearchParams } from 'react-router-dom'
import type { Repo } from '../../lib/tangled'
import { getRepoName } from '../../lib/tangled/repo'
import { LoadingPanel } from '../shared/LoadingPanel'
import { RepoTreeEntry } from './RepoTreeEntry'
import { RepoTreePath } from './RepoTreePath'
import { WorkspacePaneHeader } from './WorkspacePaneHeader'
import { getParentPath, sortTreeEntries } from './repoTreeUtils'
import { useRepoTree } from './useRepoTree'

type RepoTreeProps = {
  initialTree?: RepoTreeResponse
  repo: Repo
}

export function RepoTree({ initialTree, repo }: RepoTreeProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const path = searchParams.get('path') ?? ''
  const repoName = getRepoName(repo)
  const { error, tree } = useRepoTree({ initialTree, path, repo })

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

  if (error) {
    return <p role="alert">Could not load files: {error.message}</p>
  }

  if (tree === null) {
    return <LoadingPanel label="Loading files" className="h-64 rounded-none border-0" />
  }

  const sortedEntries = sortTreeEntries(tree.files)

  return (
    <section className="flex h-full flex-col font-mono" aria-labelledby="repository-files">
      <WorkspacePaneHeader
        labelledBy="repository-files"
        title={
          <span className="flex min-w-0 items-baseline gap-2">
            <span>Tree</span>
            <RepoTreePath repoName={repoName} path={path} onNavigate={navigateToPath} />
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

        {sortedEntries.map((entry) => (
          <RepoTreeEntry
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
    </section>
  )
}
