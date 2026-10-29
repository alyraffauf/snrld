import { validateString } from './validators'
import { ok } from '../response'
import { safeParse } from '@atcute/lexicons'
import { OrgTangledStringListStrings } from '../lexicons'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { ListStringsOptions, StringList } from './types'

export async function listStrings(
  subject: string,
  options: ListStringsOptions = {},
): Promise<StringList> {
  const response = await ok(
    rpc.get('org.tangled.string.listStrings', {
      params: {
        subject,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
      },
    }),
  )

  const listValidation = safeParse(
    OrgTangledStringListStrings.mainSchema.output.schema,
    removeNullCursor(response),
  )
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid string list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map((item) => ({
    ...item,
    value: validateString(item.value),
  }))

  return { items, cursor: listValidation.value.cursor }
}
