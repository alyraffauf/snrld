import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import type { Main as TangledStar } from '@atcute/tangled/types/feed/star'

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
    if (value.subject.$type !== 'sh.tangled.feed.star#repo') {
      return []
    }

    return [value.subject.did]
  })
}
