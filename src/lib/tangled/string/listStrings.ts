import { ok } from '@atcute/client'
import { safeParse } from '@atcute/lexicons'
import { ShTangledString, ShTangledStringListStrings } from '@atcute/tangled'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { ListStringsOptions, StringList } from './types'

export async function listStrings(
  subject: string,
  options: ListStringsOptions = {},
): Promise<StringList> {
  const response = await ok(
    rpc.get('sh.tangled.string.listStrings', {
      params: {
        subject,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
      },
    }),
  )

  const listValidation = safeParse(
    ShTangledStringListStrings.mainSchema.output.schema,
    removeNullCursor(response),
  )
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid string list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(ShTangledString.mainSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid string record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}
