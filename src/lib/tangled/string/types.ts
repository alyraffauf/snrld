import type { Cid, ResourceUri } from '@atcute/lexicons'
import { OrgTangledSnippetString } from '../lexicons'

export type StringRecord = {
  cid?: Cid
  uri: ResourceUri
  value: OrgTangledSnippetString.Main
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
