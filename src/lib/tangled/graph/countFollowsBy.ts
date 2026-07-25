import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'

export async function countFollowsBy(did: Did): Promise<number> {
  const response = await ok(
    rpc.get('sh.tangled.graph.countFollowsBy', {
      params: { subject: did },
    }),
  )

  if (typeof response.count !== 'number') {
    throw new Error('Bobbin returned an invalid follow count')
  }

  return response.count
}
