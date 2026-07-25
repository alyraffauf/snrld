import { ok } from '@atcute/client'
import type { ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import { validateRepo, type Repo } from './types'

export async function getRepo(atUri: ResourceUri): Promise<Repo> {
  const repo = await ok(
    rpc.get('sh.tangled.repo.getRepo', {
      params: { repo: atUri },
    }),
  )

  return validateRepo(repo)
}
