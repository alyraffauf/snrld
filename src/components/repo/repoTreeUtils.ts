import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { isDirectoryMode } from '../../lib/tangled/repo'

type TreeEntry = RepoTreeResponse['files'][number]

export function sortTreeEntries(entries: TreeEntry[]): TreeEntry[] {
  return [...entries].sort((firstEntry, secondEntry) => {
    const firstIsDirectory = isDirectoryMode(firstEntry.mode)
    const secondIsDirectory = isDirectoryMode(secondEntry.mode)

    if (firstIsDirectory !== secondIsDirectory) {
      return firstIsDirectory ? -1 : 1
    }

    return firstEntry.name.localeCompare(secondEntry.name, undefined, { sensitivity: 'base' })
  })
}

export function getParentPath(path: string): string {
  const separatorIndex = path.lastIndexOf('/')
  return separatorIndex === -1 ? '' : path.slice(0, separatorIndex)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}
