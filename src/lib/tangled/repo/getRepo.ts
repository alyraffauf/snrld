import { ok } from '@atcute/client'
import type { ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import type { Repo } from './types'
import { validateRepo } from './validators'

export async function getRepo(atUri: ResourceUri): Promise<Repo> {
  const repo = await ok(
    rpc.get('sh.tangled.repo.getRepo', {
      params: { repo: atUri },
    }),
  )

  return validateRepo(repo)
}
