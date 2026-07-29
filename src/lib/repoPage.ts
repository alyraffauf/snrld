import { type Handle, type ResourceUri } from '@atcute/lexicons'
import { resolveActor, resolveMiniDoc, type ResolvedActor } from './actor'
import { getRepo, type Repo } from './tangled/repo'

export type RepoPageData = {
  actor: ResolvedActor
  repo: Repo
}

export async function loadRepoPage(handle: Handle, repoKey: string): Promise<RepoPageData> {
  const identity = await resolveMiniDoc(handle)
  const repoUri = `at://${identity.did}/sh.tangled.repo/${repoKey}` as ResourceUri
  const [actor, repo] = await Promise.all([resolveActor(identity.did), getRepo(repoUri)])

  return { actor, repo }
}
