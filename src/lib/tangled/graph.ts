import { ok } from '@atcute/client'
import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import type { Main as TangledVouch } from '@atcute/tangled/types/graph/vouch'
import { mainSchema as vouchSchema } from '@atcute/tangled/types/graph/vouch'
import { mainSchema as listVouchesSchema } from '@atcute/tangled/types/graph/listVouches'
import { rpc } from './client'
import { removeNullCursor } from './utils'

export type VouchRecord = {
  cid?: Cid
  uri: ResourceUri
  value: TangledVouch
}

export type VouchList = {
  items: VouchRecord[]
  cursor?: string
}

export type ListVouchesOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}

export async function countFollows(did: Did): Promise<number> {
  const count = await ok(
    rpc.get('sh.tangled.graph.countFollows', {
      params: { subject: did },
    }),
  )

  if (typeof count.count !== 'number') {
    throw new Error('Bobbin returned an invalid follow count')
  }

  return count.count
}

export async function countFollowsBy(did: Did): Promise<number> {
  const count = await ok(
    rpc.get('sh.tangled.graph.countFollowsBy', {
      params: { subject: did },
    }),
  )

  if (typeof count.count !== 'number') {
    throw new Error('Bobbin returned an invalid follow count')
  }

  return count.count
}

export async function listVouches(did: Did, options: ListVouchesOptions = {}): Promise<VouchList> {
  const response = await ok(
    rpc.get('sh.tangled.graph.listVouches', {
      params: {
        subject: did,
        limit: options.limit,
        cursor: options.cursor,
        order: options.order,
      },
    }),
  )

  const listValidation = safeParse(listVouchesSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid vouch list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(vouchSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid vouch record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return {
    items,
    cursor: listValidation.value.cursor,
  }
}
