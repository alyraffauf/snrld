import type { AppBskyActorProfile } from '@atcute/bluesky'
import type { Did } from '@atcute/lexicons'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { getAvatarUrl } from './atproto/media'
import { getProfile as getBskyProfile } from './bsky/actor'
import { getMiniDoc } from './microcosm'
import { getProfile, type Profile } from './tangled'

export type ResolvedActor = {
  miniDoc: MiniDoc
  profile: Profile
  bskyProfile: AppBskyActorProfile.Main | null
  avatarUrl: string | null
}

type CacheEntry<T> = {
  value: Promise<T>
  expiresAt: number
}

const ACTOR_CACHE_TTL_MS = 5 * 60 * 1000
const miniDocCache = new Map<string, CacheEntry<MiniDoc>>()
const actorCache = new Map<string, CacheEntry<ResolvedActor>>()

export function resolveMiniDoc(identifier: string): Promise<MiniDoc> {
  const cached = getCachedValue(miniDocCache, identifier)
  if (cached !== undefined) return cached

  const request = getMiniDoc(identifier).catch((error) => {
    deleteIfCurrent(miniDocCache, identifier, request)
    throw error
  })

  miniDocCache.set(identifier, createCacheEntry(request))
  return request
}

export function resolveActor(did: Did): Promise<ResolvedActor> {
  const cached = getCachedValue(actorCache, did)
  if (cached !== undefined) return cached

  const request = Promise.all([resolveMiniDoc(did), getProfile(did)])
    .then(async ([miniDoc, profile]) => {
      const bskyProfile = await getBskyProfile(miniDoc).catch(() => null)
      const avatar = profile.value.avatar ?? bskyProfile?.avatar
      const avatarUrl = avatar ? getAvatarUrl(did, avatar) : null

      return { miniDoc, profile, bskyProfile, avatarUrl }
    })
    .catch((error) => {
      deleteIfCurrent(actorCache, did, request)
      throw error
    })

  actorCache.set(did, createCacheEntry(request))
  return request
}

export function invalidateActor(did: Did): void {
  actorCache.delete(did)
  miniDocCache.delete(did)
}

export function clearActorCache(): void {
  actorCache.clear()
  miniDocCache.clear()
}

function createCacheEntry<T>(value: Promise<T>): CacheEntry<T> {
  return {
    value,
    expiresAt: Date.now() + ACTOR_CACHE_TTL_MS,
  }
}

function getCachedValue<T>(cache: Map<string, CacheEntry<T>>, key: string): Promise<T> | undefined {
  const entry = cache.get(key)
  if (entry === undefined) return undefined

  if (entry.expiresAt <= Date.now()) {
    cache.delete(key)
    return undefined
  }

  return entry.value
}

function deleteIfCurrent<T>(
  cache: Map<string, CacheEntry<T>>,
  key: string,
  value: Promise<T>,
): void {
  if (cache.get(key)?.value === value) {
    cache.delete(key)
  }
}
