import { Client, ok, simpleFetchHandler } from '@atcute/client'
import { isActorIdentifier } from '@atcute/lexicons/syntax'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import type {} from '@atcute/microcosm'

const slingshot = new Client({
  handler: simpleFetchHandler({ service: 'https://slingshot.microcosm.blue' }),
})

export async function getMiniDoc(identifier: string): Promise<MiniDoc> {
  if (!isActorIdentifier(identifier)) {
    throw new Error(`Invalid handle or DID: ${identifier}`)
  }

  return ok(
    slingshot.get('blue.microcosm.identity.resolveMiniDoc', {
      params: { identifier },
    }),
  )
}
