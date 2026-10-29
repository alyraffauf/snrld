import { ok } from '../response'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as reposListSchema } from '../lexicons/types/org/tangled/repo/listRepos'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { RepoList } from './types'
import { validateRepo } from './validators'

export type ListReposOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}

export async function listRepos(did: Did, options: ListReposOptions = {}): Promise<RepoList> {
  const response = await ok(
    rpc.get('org.tangled.repo.listRepos', {
      params: { subject: did, cursor: options.cursor, limit: options.limit, order: options.order },
    }),
  )

  const listValidation = safeParse(reposListSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid repo list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((repo) => validateRepo(repo))
  return { items, cursor: listValidation.value.cursor }
}
