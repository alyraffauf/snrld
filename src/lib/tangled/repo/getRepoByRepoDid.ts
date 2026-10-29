import { ok } from '../response'
import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'
import type { Repo } from './types'
import { validateRepo } from './validators'

export async function getRepoByRepoDid(did: Did): Promise<Repo | null> {
  const response = await rpc.get('org.tangled.repo.getRepoByRepoDid', {
    params: { repoDid: did },
  })

  if (!response.ok && response.status === 404) return null

  return validateRepo(await ok(Promise.resolve(response)))
}
