import type { Cid, ResourceUri } from '@atcute/lexicons'
import type { Main as TangledVouch } from '@atcute/tangled/types/graph/vouch'

export type VouchRecord = {
  cid?: Cid
  uri: ResourceUri
  value: TangledVouch
}

export type VouchList = {
  items: VouchRecord[]
  cursor?: string
}

export type ListVouchesOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
}
