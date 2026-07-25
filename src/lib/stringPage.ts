import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Handle } from '@atcute/lexicons'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { getProfile as getBskyProfile } from './bsky/actor'
import { getMiniDoc } from './microcosm'
import { getProfile, getString, type Profile, type StringRecord } from './tangled'

export type StringPageData = {
  bskyProfile: AppBskyActorProfile.Main | null
  identity: MiniDoc
  profile: Profile
  stringRecord: StringRecord
}

export async function loadStringPage(handle: Handle, stringKey: string): Promise<StringPageData> {
  const identity = await getMiniDoc(handle)
  const [profile, stringRecord, bskyProfile] = await Promise.all([
    getProfile(identity.did),
    getString(identity.did, stringKey),
    getBskyProfile(identity).catch(() => null),
  ])

  return { identity, profile, bskyProfile, stringRecord }
}
