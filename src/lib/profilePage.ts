import type { AppBskyActorProfile } from '@atcute/bluesky'
import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import type { $output as MiniDoc } from '@atcute/microcosm/types/blue/microcosm/identity/resolveMiniDoc'
import { resolveActor, resolveMiniDoc } from './actor'
import { listStrings, type Profile, type StringList } from './tangled'
import { getRepoByRepoDid, listRepos, type Repo, type RepoList } from './tangled/repo'
import { getRepoDidsFromStars, listStarsBy } from './tangled/feed'
import { listVouches, type VouchList } from './tangled/graph'

export type StarredRepo = {
  repo: Repo
  handle: Handle
}

export type ProfilePageData = {
  identity: MiniDoc
  profile: Profile
  repos: RepoList
  strings: StringList
  pinnedRepos: Repo[]
  starredRepos: StarredRepo[]
  vouches: VouchList
  bskyProfile: AppBskyActorProfile.Main | null
}

export async function loadProfilePage(handle: Handle): Promise<ProfilePageData> {
  const identity = await resolveMiniDoc(handle)
  const stars = await listStarsBy(identity.did)
  const repoDids = getRepoDidsFromStars(stars)

  const [actor, repos, vouches, strings] = await Promise.all([
    resolveActor(identity.did),
    listRepos(identity.did),
    listVouches(identity.did),
    listStrings(identity.did),
  ])
  const profile = actor.profile

  const ownerDocs = new Map<string, Promise<MiniDoc>>()
  const getOwner = (identifier: string) => {
    const existing = ownerDocs.get(identifier)
    if (existing !== undefined) return existing

    const request = resolveMiniDoc(identifier)
    ownerDocs.set(identifier, request)
    return request
  }

  const starredRepos = (
    await Promise.allSettled(
      repoDids.map(async (repoDid): Promise<StarredRepo> => {
        const repo = await getRepoByRepoDid(repoDid)
        const owner = await getOwner(parseResourceUri(repo.uri).repo)

        return { repo, handle: owner.handle }
      }),
    )
  ).flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))

  const pinnedResults = await Promise.allSettled(
    (profile.value.pinnedRepositories ?? []).map((repoDid) => getRepoByRepoDid(repoDid as Did)),
  )

  const pinnedRepos = pinnedResults.flatMap((result) =>
    result.status === 'fulfilled' ? [result.value] : [],
  )

  return {
    identity,
    profile: actor.profile,
    repos,
    strings,
    pinnedRepos,
    starredRepos,
    vouches,
    bskyProfile: actor.bskyProfile,
  }
}
