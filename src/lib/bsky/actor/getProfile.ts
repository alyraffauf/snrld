import type {} from '@atcute/atproto'
import { AppBskyActorProfile } from '@atcute/bluesky'
import { ok } from '@atcute/client'
import { safeParse } from '@atcute/lexicons'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { slingshot } from '../../microcosm'

export async function getProfile(miniDoc: MiniDoc): Promise<AppBskyActorProfile.Main> {
  const response = await ok(
    slingshot.get('com.atproto.repo.getRecord', {
      params: {
        repo: miniDoc.did,
        collection: 'app.bsky.actor.profile',
        rkey: 'self',
      },
    }),
  )

  const validation = safeParse(AppBskyActorProfile.mainSchema, response.value)
  if (!validation.ok) {
    throw new Error(`Slingshot returned an invalid Bluesky profile record: ${validation.message}`)
  }

  return validation.value
}
