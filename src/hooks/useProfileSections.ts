import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { resolveMiniDoc } from '../lib/actor'
import { getRepoDidsFromStars, listStarsBy } from '../lib/tangled/feed'
import { listVouches, type VouchList } from '../lib/tangled/graph'
import { getRepoByRepoDid, listRepos, type Repo, type RepoList } from '../lib/tangled/repo'
import { listStrings, type StringList } from '../lib/tangled/string'
import { useDeferredResource } from './useDeferredResource'

type StarredRepo = { handle: Handle; repo: Repo }

export function useProfileRepos(did: Did, isEnabled: boolean) {
  return useDeferredResource(did, isEnabled, loadRepos)
}

export function useProfileStrings(did: Did, isEnabled: boolean) {
  return useDeferredResource(did, isEnabled, listStrings)
}

export function useProfileVouches(did: Did, isEnabled: boolean) {
  return useDeferredResource(did, isEnabled, loadVouches)
}

export function usePinnedRepos(repoDids: readonly Did[], isEnabled: boolean) {
  return useDeferredResource(repoDids.join(','), isEnabled, loadPinnedRepos)
}

export function useStarredRepos(did: Did, isEnabled: boolean) {
  return useDeferredResource(did, isEnabled, loadStarredRepos)
}

async function loadPinnedRepos(repoDids: string): Promise<Repo[]> {
  const results = await Promise.allSettled(
    repoDids
      .split(',')
      .filter(Boolean)
      .map((did) => getRepoByRepoDid(did as Did)),
  )
  return results.flatMap((result) =>
    result.status === 'fulfilled' && result.value !== null ? [result.value] : [],
  )
}

function loadRepos(did: string): Promise<RepoList> {
  return listRepos(did as Did)
}

function loadVouches(did: string): Promise<VouchList> {
  return listVouches(did as Did)
}

async function loadStarredRepos(did: string): Promise<StarredRepo[]> {
  const stars = await listStarsBy(did as Did)
  const results = await Promise.allSettled(getRepoDidsFromStars(stars).map(loadStarredRepo))
  return results.flatMap((result) =>
    result.status === 'fulfilled' && result.value !== null ? [result.value] : [],
  )
}

async function loadStarredRepo(repoDid: Did): Promise<StarredRepo | null> {
  const repo = await getRepoByRepoDid(repoDid)
  if (repo === null) return null

  const owner = await resolveMiniDoc(parseResourceUri(repo.uri).repo)
  return { handle: owner.handle, repo }
}

export type { RepoList, StringList, VouchList, StarredRepo }
