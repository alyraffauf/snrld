import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as pullListSchema } from '@atcute/tangled/types/repo/listPulls'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { PullList } from './types'
import { validatePull } from './validators'

export type ListPullsOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
  status?: 'open' | 'closed' | 'merged'
}

export async function listPulls(repoDid: Did, options: ListPullsOptions = {}): Promise<PullList> {
  const response = await ok(
    rpc.get('sh.tangled.repo.listPulls', {
      params: {
        subject: repoDid,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
        status: options.status,
      },
    }),
  )

  const listValidation = safeParse(pullListSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid pull list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map(validatePull)

  return { items, cursor: listValidation.value.cursor }
}
