import { ok } from '@atcute/client'
import { safeParse } from '@atcute/lexicons'
import { isDatetime } from '@atcute/lexicons/syntax'
import type { $output as RepoTree } from '@atcute/tangled/types/repo/tree'
import { mainSchema as treeSchema } from '@atcute/tangled/types/repo/tree'
import { getKnotRpc } from '../client'
import { getDefaultBranch } from './getDefaultBranch'
import { getRepoDid, type Repo } from './types'

export async function getRepoTree(repo: Repo, path = '', ref?: string): Promise<RepoTree> {
  const repoDid = getRepoDid(repo)
  const defaultBranch = ref ?? (await getDefaultBranch(repo)).name
  const treeResponse = await ok(
    getKnotRpc(repo.value.knot).get('sh.tangled.repo.tree', {
      params: { repo: repoDid, ref: defaultBranch, path },
    }),
  )

  const treeValidation = safeParse(treeSchema.output.schema, normalizeTreeResponse(treeResponse))
  if (!treeValidation.ok) {
    throw new Error(`Bobbin returned an invalid repository tree: ${treeValidation.message}`)
  }

  return treeValidation.value
}

function normalizeTreeResponse(value: unknown): unknown {
  if (!isRecord(value)) return value

  const tree = { ...value }
  if (Array.isArray(tree.files)) {
    tree.files = tree.files.map((entry) =>
      isRecord(entry) ? { ...entry, last_commit: normalizeCommit(entry.last_commit) } : entry,
    )
  }

  tree.lastCommit = normalizeCommit(tree.lastCommit)
  return tree
}

function normalizeCommit(value: unknown): unknown {
  if (!isRecord(value)) return value

  const commit = { ...value }
  if (isRecord(commit.author) && !isDatetime(commit.author.when)) {
    delete commit.author
  }

  return commit
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
