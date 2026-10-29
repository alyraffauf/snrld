import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import type { Main as TangledStar } from '../lexicons/types/org/tangled/feed/star'
import type { $output as CommentListResponse } from '../lexicons/types/org/tangled/feed/listComments'

export type CommentRecord = CommentListResponse['items'][number]

export type CommentList = {
  items: CommentRecord[]
  cursor?: string
}

export type ListCommentsOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}

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
    if (value.subject.$type !== 'org.tangled.feed.star#repo') {
      return []
    }

    return [value.subject.identity]
  })
}
