import { ok } from '@atcute/client'
import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import { parseResourceUri, safeParse } from '@atcute/lexicons'
import { isDatetime } from '@atcute/lexicons/syntax'
import type { Main as TangledRepo } from '@atcute/tangled/types/repo'
import { mainSchema as repoSchema } from '@atcute/tangled/types/repo'
import type { $output as DefaultBranch } from '@atcute/tangled/types/repo/getDefaultBranch'
import { mainSchema as defaultBranchSchema } from '@atcute/tangled/types/repo/getDefaultBranch'
import { mainSchema as reposListSchema } from '@atcute/tangled/types/repo/listRepos'
import type { $output as RepoTree } from '@atcute/tangled/types/repo/tree'
import { mainSchema as treeSchema } from '@atcute/tangled/types/repo/tree'
import { rpc } from './client'

export type Repo = {
  cid?: Cid
  uri: ResourceUri
  value: TangledRepo
}

export type RepoList = {
  items: Repo[]
  cursor?: string
}

// Tangled just...changed their lexicon, or whatever,
// so we have to do some normalization here.
export function getRepoRkey(repo: Repo): string {
  const { rkey } = parseResourceUri(repo.uri)
  if (rkey === undefined) {
    throw new Error(`Repository URI has no record key: ${repo.uri}`)
  }

  return rkey
}

export function getRepoName(repo: Repo): string {
  return repo.value.name ?? getRepoRkey(repo)
}

export async function getRepo(atUri: ResourceUri): Promise<Repo> {
  const repo = await ok(
    rpc.get('sh.tangled.repo.getRepo', {
      params: { repo: atUri },
    }),
  )

  const value = normalizeRepoRecord(repo.value)

  const validation = safeParse(repoSchema, value)
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid repo record: ${validation.message}`)
  }

  return { ...repo, value: validation.value }
}

export async function getRepoByRepoDid(did: Did): Promise<Repo> {
  const repo = await ok(
    rpc.get('sh.tangled.repo.getRepoByRepoDid', {
      params: { repoDid: did },
    }),
  )

  const value = normalizeRepoRecord(repo.value)

  const validation = safeParse(repoSchema, value)
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid repo record: ${validation.message}`)
  }

  return { ...repo, value: validation.value }
}

export async function listRepos(did: Did): Promise<RepoList> {
  const repos = await ok(
    rpc.get('sh.tangled.repo.listRepos', {
      params: { subject: did },
    }),
  )

  const repoList = removeNullCursor(repos)
  const listValidation = safeParse(reposListSchema.output.schema, repoList)
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid repo list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((repo) => {
    const validation = safeParse(repoSchema, normalizeRepoRecord(repo.value))
    if (!validation.ok) {
      throw new Error(`Bobbin returned an invalid repo record: ${repo.uri}: ${validation.message}`)
    }

    return { ...repo, value: validation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}

export async function getRepoTree(repo: Repo, path = ''): Promise<RepoTree> {
  const defaultBranch = await getDefaultBranch(repo)

  const treeResponse = await ok(
    rpc.get('sh.tangled.repo.tree', {
      params: {
        repo: repo.uri,
        ref: defaultBranch.name,
        path,
      },
    }),
  )

  const treeValidation = safeParse(treeSchema.output.schema, normalizeTreeResponse(treeResponse))
  if (!treeValidation.ok) {
    throw new Error(`Bobbin returned an invalid repository tree: ${treeValidation.message}`)
  }

  return treeValidation.value
}

export type RepoLogOptions = {
  path?: string
  cursor?: string
  limit?: number
}

export type RepoCommit = {
  hash: string
  message: string
  author?: {
    Name?: string
    Email?: string
    When?: string
  }
}

export async function getRepoLog(
  repo: Repo,
  ref: string,
  options: RepoLogOptions = {},
): Promise<string> {
  const commits = await ok(
    rpc.get('sh.tangled.repo.log', {
      as: 'blob',
      params: {
        repo: repo.uri,
        ref,
        path: options.path ?? '',
        limit: options.limit ?? 50,
        ...(options.cursor === undefined ? {} : { cursor: options.cursor }),
      },
    }),
  )

  // `repo.log` is declared as an XRPC blob, not JSON
  return commits.text()
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

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Bobbin returned a repository log that was not valid JSON')
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.commits)) {
    throw new Error('Bobbin returned an invalid repository log')
  }

  return parsed.commits.map((commit, index) => {
    if (!isRecord(commit) || typeof commit.message !== 'string') {
      throw new Error(`Bobbin returned an invalid commit at index ${index}`)
    }

    const hash =
      typeof commit.this === 'string'
        ? commit.this
        : isByteArray(commit.hash)
          ? bytesToHex(commit.hash)
          : undefined

    if (hash === undefined) {
      throw new Error(`Bobbin returned an invalid commit hash at index ${index}`)
    }

    if (commit.author !== undefined && !isRecord(commit.author)) {
      throw new Error(`Bobbin returned an invalid commit author at index ${index}`)
    }

    return {
      hash,
      message: commit.message,
      author: commit.author as RepoCommit['author'],
    }
  })
}

export async function getDefaultBranch(repo: Repo): Promise<DefaultBranch> {
  const response = await ok(
    rpc.get('sh.tangled.repo.getDefaultBranch', {
      params: { repo: repo.uri },
    }),
  )

  const branchValidation = safeParse(defaultBranchSchema.output.schema, response)
  if (!branchValidation.ok) {
    throw new Error(`Bobbin returned an invalid default branch: ${branchValidation.message}`)
  }

  return branchValidation.value
}

function normalizeTreeResponse(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value
  }

  const tree = { ...(value as Record<string, unknown>) }

  if (Array.isArray(tree.files)) {
    tree.files = tree.files.map((entry) => {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
        return entry
      }

      const normalizedEntry = { ...(entry as Record<string, unknown>) }
      normalizedEntry.last_commit = normalizeCommit(normalizedEntry.last_commit)
      return normalizedEntry
    })
  }

  tree.lastCommit = normalizeCommit(tree.lastCommit)
  return tree
}

function normalizeRepoRecord(value: unknown): unknown {
  if (!isRecord(value)) return value

  const normalized = { ...value }
  if (typeof normalized.description === 'string') {
    const graphemes = Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(normalized.description),
      ({ segment }) => segment,
    )

    if (graphemes.length === 0) {
      delete normalized.description
    } else if (graphemes.length > 140) {
      normalized.description = graphemes.slice(0, 140).join('')
    }
  }

  return normalized
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isByteArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(
      (byte) => typeof byte === 'number' && Number.isInteger(byte) && byte >= 0 && byte <= 255,
    )
  )
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function normalizeCommit(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value
  }

  const commit = { ...(value as Record<string, unknown>) }
  const author = commit.author

  if (
    typeof author === 'object' &&
    author !== null &&
    !Array.isArray(author) &&
    !isDatetime((author as Record<string, unknown>).when)
  ) {
    // Bobbin occasionally sends an empty/non-ISO author timestamp. The
    // author is optional, so discard only that malformed metadata.
    delete commit.author
  }

  return commit
}

function removeNullCursor(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return value
  }

  const { cursor, ...rest } = value as Record<string, unknown>
  return cursor === null ? rest : value
}
