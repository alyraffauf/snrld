import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import type { Main as TangledPull } from '@atcute/tangled/types/repo/pull'
import { mainSchema as pullSchema } from '@atcute/tangled/types/repo/pull'
import type { $output as PullListResponse } from '@atcute/tangled/types/repo/listPulls'
import { mainSchema as pullListSchema } from '@atcute/tangled/types/repo/listPulls'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'

export type Pull = Omit<PullListResponse['items'][number], 'value'> & {
  value: TangledPull
}

export type PullList = {
  items: Pull[]
  cursor?: string
}

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

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(pullSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid pull record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}
