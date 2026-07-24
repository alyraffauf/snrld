// import { is } from '@atcute/lexicons';
import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
// import { mainSchema as repoSchema } from '@atcute/tangled/types/repo';
// import { mainSchema as reposListSchema } from '@atcute/tangled/types/repo/listRepos';
import { rpc } from './client'

export async function countFollows(did: Did): Promise<number> {
  const count = await ok(
    rpc.get('sh.tangled.graph.countFollows', {
      params: { subject: did },
    }),
  )

  if (typeof count.count !== 'number') {
    throw new Error('Bobbin returned an invalid follow count')
  }

  return count.count
}

export async function countFollowsBy(did: Did): Promise<number> {
  const count = await ok(
    rpc.get('sh.tangled.graph.countFollowsBy', {
      params: { subject: did },
    }),
  )

  if (typeof count.count !== 'number') {
    throw new Error('Bobbin returned an invalid follow count')
  }

  return count.count
}
