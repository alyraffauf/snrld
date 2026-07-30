import { ok } from '@atcute/client'
import { getKnotRpc } from '../client'
import { getRepoDid, type Repo } from './types'

export type RepoLogOptions = {
  path?: string
  cursor?: string
  limit?: number
}

export async function getRepoLog(
  repo: Repo,
  ref: string,
  options: RepoLogOptions = {},
): Promise<string> {
  const repoDid = getRepoDid(repo)
  const commits = await ok(
    getKnotRpc(repo.value.knot).get('sh.tangled.repo.log', {
      as: 'blob',
      params: {
        repo: repoDid,
        ref,
        path: options.path ?? '',
        limit: options.limit ?? 50,
        ...(options.cursor === undefined ? {} : { cursor: options.cursor }),
      },
    }),
  )

  return commits.text()
}
