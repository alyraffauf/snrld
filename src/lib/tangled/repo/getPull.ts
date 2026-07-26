import { ok } from '@atcute/client'
import type { ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import type { PullRecord } from './types'
import { validatePullRecord } from './validators'

export async function getPull(pull: ResourceUri): Promise<PullRecord> {
  const response = await ok(
    rpc.get('sh.tangled.repo.getPull', {
      params: { pull },
    }),
  )

  return validatePullRecord(response)
}
