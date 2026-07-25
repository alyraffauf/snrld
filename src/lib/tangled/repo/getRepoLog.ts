import { ok } from '@atcute/client'
import { rpc } from '../client'
import type { Repo } from './types'

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
  const commits = await ok(
    rpc.get('sh.tangled.repo.log', {
      as: 'blob',
      params: {
        repo: repo.uri,
        ref,
        path: options.path ?? '',
        limit: options.limit ?? 50,
        ...(options.cursor === undefined ? {} : { cursor: options.cursor }),
      },
    }),
  )

  return commits.text()
}
