import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'

export async function countStars(repoDid: Did): Promise<number> {
  const response = await ok(
    rpc.get('sh.tangled.feed.countStars', {
      params: { subject: repoDid },
    }),
  )

  if (typeof response.count !== 'number' || !Number.isFinite(response.count)) {
    throw new Error('Bobbin returned an invalid star count')
  }

  return response.count
}
