import type { Cid, ResourceUri } from '@atcute/lexicons'
import { ShTangledString } from '@atcute/tangled'

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
