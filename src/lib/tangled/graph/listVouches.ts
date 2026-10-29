import { ok } from '../response'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as listVouchesSchema } from '../lexicons/types/org/tangled/graph/listNetworkVouches'
import { mainSchema as vouchSchema } from '../lexicons/types/org/tangled/graph/vouch'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { ListVouchesOptions, VouchList } from './types'

export async function listVouches(did: Did, options: ListVouchesOptions = {}): Promise<VouchList> {
  const response = await ok(
    rpc.get('org.tangled.graph.listNetworkVouches', {
      params: {
        actors: [did],
        limit: options.limit,
        cursor: options.cursor,
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
