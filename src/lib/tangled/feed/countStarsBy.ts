import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'

export async function countStarsBy(did: Did): Promise<number> {
  const response = await ok(
    rpc.get('sh.tangled.feed.countStarsBy', {
      params: { subject: did },
    }),
  )

  if (typeof response.count !== 'number' || !Number.isFinite(response.count)) {
    throw new Error('Bobbin returned an invalid star count')
  }

  return response.count
}
