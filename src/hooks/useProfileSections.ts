import { parseResourceUri, type Did, type Handle } from '@atcute/lexicons'
import { resolveMiniDoc } from '../lib/actor'
import { getRepoDidsFromStars, listStarsBy } from '../lib/tangled/feed'
import { listVouches, type VouchList } from '../lib/tangled/graph'
import { getRepoByRepoDid, listRepos, type Repo, type RepoList } from '../lib/tangled/repo'
import { listStrings, type StringList } from '../lib/tangled/string'
import { useDeferredResource } from './useDeferredResource'
import { useCursorList } from './useCursorList'

type StarredRepo = { handle: Handle; repo: Repo }
const PROFILE_LIST_LIMIT = 20

export function useProfileRepos(did: Did, isEnabled: boolean) {
  return useCursorList(
    isEnabled ? did : null,
    (options) => listRepos(did, options),
    PROFILE_LIST_LIMIT,
  )
}

export function useProfileStrings(did: Did, isEnabled: boolean) {
  return useCursorList(
    isEnabled ? did : null,
    (options) => listStrings(did, options),
    PROFILE_LIST_LIMIT,
  )
}

export function useProfileVouches(did: Did, isEnabled: boolean) {
  return useCursorList(
    isEnabled ? did : null,
    (options) => listVouches(did, options),
    PROFILE_LIST_LIMIT,
  )
}

export function usePinnedRepos(repoDids: readonly Did[], isEnabled: boolean) {
  return useDeferredResource(repoDids.join(','), isEnabled, loadPinnedRepos, { cache: true })
}

export function useStarredRepos(did: Did, isEnabled: boolean) {
  return useCursorList(
    isEnabled ? did : null,
    (options) => loadStarredRepos(did, options),
    PROFILE_LIST_LIMIT,
  )
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

async function loadStarredRepos(did: Did, options: { cursor?: string; limit: number }) {
  const stars = await listStarsBy(did, options)
  const results = await Promise.allSettled(getRepoDidsFromStars(stars).map(loadStarredRepo))
  const items = results.flatMap((result) =>
    result.status === 'fulfilled' && result.value !== null ? [result.value] : [],
  )
  return { items, cursor: stars.cursor }
}

async function loadStarredRepo(repoDid: Did): Promise<StarredRepo | null> {
  const repo = await getRepoByRepoDid(repoDid)
  if (repo === null) return null

  const owner = await resolveMiniDoc(parseResourceUri(repo.uri).repo)
  return { handle: owner.handle, repo }
}

export type { RepoList, StringList, VouchList, StarredRepo }
