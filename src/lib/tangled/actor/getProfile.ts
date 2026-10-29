import { ok } from '../response'
import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import type {} from '../lexicons'
import type { Main as TangledProfile } from '../lexicons/types/org/tangled/actor/profile'
import { mainSchema as profileSchema } from '../lexicons/types/org/tangled/actor/profile'
import { rpc } from '../client'

export type Profile = {
  cid?: Cid
  uri: ResourceUri
  value: TangledProfile
}

export async function getProfile(did: Did): Promise<Profile> {
  const profile = await ok(
    rpc.get('org.tangled.actor.getProfile', {
      params: { actor: createProfileUri(did) },
    }),
  )

  const validation = safeParse(profileSchema, normalizeProfile(profile.value))
  if (!validation.ok) {
    throw new Error(`Bobbin returned an invalid profile record: ${validation.message}`)
  }

  return { ...profile, value: validation.value }
}

function createProfileUri(did: Did) {
  return `at://${did}/org.tangled.actor.profile/self` as const
}

function normalizeProfile(profile: unknown): unknown {
  if (typeof profile !== 'object' || profile === null || Array.isArray(profile)) {
    return profile
  }

  const record = profile as Record<string, unknown>
  const normalized = { ...record }

  if (Array.isArray(record.links)) {
    normalized.links = record.links.filter((link) => link !== '')
  }

  if (Array.isArray(record.stats)) {
    normalized.stats = record.stats.filter((stat) => stat !== '')
  }

  return normalized
}
