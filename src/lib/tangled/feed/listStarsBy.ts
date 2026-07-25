import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as starSchema } from '@atcute/tangled/types/feed/star'
import { mainSchema as starsBySchema } from '@atcute/tangled/types/feed/listStarsBy'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { ListStarsOptions, StarList } from './types'

export async function listStarsBy(did: Did, options: ListStarsOptions = {}): Promise<StarList> {
  const response = await ok(
    rpc.get('sh.tangled.feed.listStarsBy', {
      params: {
        subject: did,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
      },
    }),
  )

  const listValidation = safeParse(starsBySchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid star list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(starSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid star record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}
