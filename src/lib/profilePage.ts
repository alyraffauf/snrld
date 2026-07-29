import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Handle } from '@atcute/lexicons'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { resolveActor, resolveMiniDoc } from './actor'
import type { Profile } from './tangled'

export type ProfilePageData = {
  identity: MiniDoc
  profile: Profile
  bskyProfile: AppBskyActorProfile.Main | null
}

export async function loadProfilePage(handle: Handle): Promise<ProfilePageData> {
  const identity = await resolveMiniDoc(handle)

  const actor = await resolveActor(identity.did)

  return {
    identity,
    profile: actor.profile,
    bskyProfile: actor.bskyProfile,
  }
}
