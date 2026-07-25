import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'
import { validateRepo, type Repo } from './types'

export async function getRepoByRepoDid(did: Did): Promise<Repo> {
  const repo = await ok(
    rpc.get('sh.tangled.repo.getRepoByRepoDid', {
      params: { repoDid: did },
    }),
  )

  return validateRepo(repo)
}
