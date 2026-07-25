import { ok } from '@atcute/client'
import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import type { Main as TangledStar } from '@atcute/tangled/types/feed/star'
import { mainSchema as starSchema } from '@atcute/tangled/types/feed/star'
import { mainSchema as starsBySchema } from '@atcute/tangled/types/feed/listStarsBy'
import { rpc } from './client'
import { removeNullCursor } from './utils'

export type StarRecord = {
  cid?: Cid
  uri: ResourceUri
  value: TangledStar
}

export type StarList = {
  items: StarRecord[]
  cursor?: string
}

export type ListStarsOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}

export function getRepoDidsFromStars(stars: StarList): Did[] {
  return stars.items.flatMap(({ value }) => {
    const subject = value.subject

    if (subject.$type !== 'sh.tangled.feed.star#repo') {
      return []
    }

    return [subject.did]
  })
}

export async function countStars(repoDid: Did): Promise<number> {
  const response = await ok(
    rpc.get('sh.tangled.feed.countStars', {
      params: { subject: repoDid },
    }),
  )

  if (typeof response.count !== 'number' || !Number.isFinite(response.count)) {
    throw new Error('Bobbin returned an invalid star count')
  }

  return response.count
}

export async function countStarsBy(did: Did): Promise<number> {
  const response = await ok(
    rpc.get('sh.tangled.feed.countStarsBy', {
      params: { subject: did },
    }),
  )

  if (typeof response.count !== 'number' || !Number.isFinite(response.count)) {
    throw new Error('Bobbin returned an invalid star count')
  }

  return response.count
}

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

  return {
    items,
    cursor: listValidation.value.cursor,
  }
}
