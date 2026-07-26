import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as reposListSchema } from '@atcute/tangled/types/repo/listRepos'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import { getRepoRkey, validateRepo, type Repo, type RepoList } from './types'

export async function listRepos(did: Did): Promise<RepoList> {
  const response = await ok(
    rpc.get('sh.tangled.repo.listRepos', {
      params: { subject: did },
    }),
  )

  const listValidation = safeParse(reposListSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid repo list: ${listValidation.message}`)
  }

  const items = deduplicateRepos(listValidation.value.items.map((repo) => validateRepo(repo)))
  return { items, cursor: listValidation.value.cursor }
}

function deduplicateRepos(repos: Repo[]): Repo[] {
  const repoIndexesByDid = new Map<string, number>()
  const uniqueRepos: Repo[] = []

  for (const repo of repos) {
    const repoDid = repo.value.repoDid
    if (repoDid === undefined) {
      uniqueRepos.push(repo)
      continue
    }

    const existingIndex = repoIndexesByDid.get(repoDid)
    if (existingIndex === undefined) {
      repoIndexesByDid.set(repoDid, uniqueRepos.length)
      uniqueRepos.push(repo)
      continue
    }

    if (isCurrentRepoRecord(repo)) uniqueRepos[existingIndex] = repo
  }

  return uniqueRepos
}

function isCurrentRepoRecord(repo: Repo): boolean {
  return repo.value.name !== undefined && getRepoRkey(repo) === repo.value.name
}
