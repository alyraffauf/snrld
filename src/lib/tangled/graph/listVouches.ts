import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as listVouchesSchema } from '@atcute/tangled/types/graph/listVouches'
import { mainSchema as vouchSchema } from '@atcute/tangled/types/graph/vouch'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { ListVouchesOptions, VouchList } from './types'

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

  const items = listValidation.value.items.flatMap((item, index) => {
    const valueValidation = safeParse(vouchSchema, item.value)
    if (!valueValidation.ok) {
      console.warn(
        `Ignoring invalid Bobbin vouch record at index ${index}: ${valueValidation.message}`,
      )
      return []
    }

    return [{ ...item, value: valueValidation.value }]
  })

  return { items, cursor: listValidation.value.cursor }
}
