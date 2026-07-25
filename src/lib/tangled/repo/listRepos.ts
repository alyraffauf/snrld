import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as reposListSchema } from '@atcute/tangled/types/repo/listRepos'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import { validateRepo, type RepoList } from './types'

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

  const items = listValidation.value.items.map((repo) => validateRepo(repo))
  return { items, cursor: listValidation.value.cursor }
}
