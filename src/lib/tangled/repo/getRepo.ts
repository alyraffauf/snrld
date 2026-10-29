import { ok } from '../response'
import { parseResourceUri, type ResourceUri, type Did } from '@atcute/lexicons'
import { rpc } from '../client'
import { validateRepo } from './validators'
export async function getRepo(atUri: ResourceUri) {
  const { repo, rkey } = parseResourceUri(atUri)
  return validateRepo(
    await ok(
      rpc.get('org.tangled.temp.repo.getRepoByName', {
        params: { owner: repo as Did, name: rkey ?? '' },
      }),
    ),
  )
}
