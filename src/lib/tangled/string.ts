import { ok } from '@atcute/client'
import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { ShTangledString, ShTangledStringListStrings } from '@atcute/tangled'
import { slingshot } from '../microcosm'
import { rpc } from './client'
import { removeNullCursor } from './utils'

export type StringRecord = {
  cid?: Cid
  uri: ResourceUri
  value: ShTangledString.Main
}

export type StringList = {
  items: StringRecord[]
  cursor?: string
}

export type ListStringsOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}

export async function getString(did: Did, rkey: string): Promise<StringRecord> {
  const response = await ok(
    slingshot.get('com.atproto.repo.getRecord', {
      params: {
        repo: did,
        collection: 'sh.tangled.string',
        rkey,
      },
    }),
  )

  const validation = safeParse(ShTangledString.mainSchema, response.value)
  if (!validation.ok) {
    throw new Error(`Slingshot returned an invalid string record: ${validation.message}`)
  }

  return { ...response, value: validation.value }
}

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

  return {
    items,
    cursor: listValidation.value.cursor,
  }
}
