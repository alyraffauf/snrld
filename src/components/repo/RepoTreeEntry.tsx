import { IconChevronRight, IconFile, IconFolder } from '@tabler/icons-react'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { isDirectoryMode } from '../../lib/tangled/repo'
import { formatBytes } from './repoTreeUtils'

type TreeEntry = RepoTreeResponse['files'][number]

type RepoTreeEntryProps = {
  currentPath: string
  entry: TreeEntry
  onNavigate: (path: string) => void
}

export function RepoTreeEntry({ currentPath, entry, onNavigate }: RepoTreeEntryProps) {
  const isDirectory = isDirectoryMode(entry.mode)
  const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name
  const entryContent = <EntryContent entry={entry} isDirectory={isDirectory} />

  return (
    <li>
      {isDirectory ? (
        <button
          type="button"
          onClick={() => onNavigate(entryPath)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-mono text-sm text-ctp-text transition-colors hover:bg-ctp-surface-0/40 hover:text-ctp-lavender"
        >
          {entryContent}
          <span className="shrink-0 text-ctp-subtext-0">directory</span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          {entryContent}
          <span className="shrink-0 font-mono text-sm text-ctp-subtext-0">
            {formatBytes(entry.size)}
          </span>
        </div>
      )}
    </li>
  )
}

type EntryContentProps = {
  entry: TreeEntry
  isDirectory: boolean
}

function EntryContent({ entry, isDirectory }: EntryContentProps) {
  return (
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
}
