import type { Did } from '@atcute/lexicons'
import { rpc } from '../client'
import type { Repo } from './types'
import { validateRepo } from './validators'

export async function getRepoByRepoDid(did: Did): Promise<Repo | null> {
  const response = await rpc.get('sh.tangled.repo.getRepoByRepoDid', {
    params: { repoDid: did },
  })

  if (!response.ok) {
    if (response.status === 404) return null

    throw new Error(
      `Bobbin could not load repository ${did}: ${response.data.error}${
        response.data.message ? `: ${response.data.message}` : ''
      }`,
    )
  }

  return validateRepo(response.data)
}
