import type { Repo } from './types'
import { getDefaultBranch } from './getDefaultBranch'
import { getRepoLog } from './getRepoLog'

export type RepoCommit = {
  hash: string
  message: string
  author?: { Name?: string; Email?: string; When?: string }
}

export type RecentCommitsOptions = {
  branch?: string
  limit?: number
}

export async function getRecentCommits(
  repo: Repo,
  options: RecentCommitsOptions = {},
): Promise<RepoCommit[]> {
  const branch = options.branch ?? (await getDefaultBranch(repo)).name
  const raw = await getRepoLog(repo, branch, { limit: options.limit ?? 5 })
  return parseCommitLog(raw).map((commit, index) => parseCommit(commit, index))
}

function parseCommitLog(raw: string): unknown[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Bobbin returned a repository log that was not valid JSON')
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.commits)) {
    throw new Error('Bobbin returned an invalid repository log')
  }

  return parsed.commits
}

function parseCommit(commit: unknown, index: number): RepoCommit {
  if (!isRecord(commit) || typeof commit.message !== 'string') {
    throw new Error(`Bobbin returned an invalid commit at index ${index}`)
  }

  const hash = typeof commit.this === 'string' ? commit.this : toHexHash(commit.hash)
  if (hash === undefined) {
    throw new Error(`Bobbin returned an invalid commit hash at index ${index}`)
  }

  if (commit.author !== undefined && !isRecord(commit.author)) {
    throw new Error(`Bobbin returned an invalid commit author at index ${index}`)
  }

  return { hash, message: commit.message, author: commit.author as RepoCommit['author'] }
}

function toHexHash(value: unknown): string | undefined {
  if (!Array.isArray(value) || !value.every(isByte)) return undefined
  return value.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function isByte(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 255
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
