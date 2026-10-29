import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import type { Main as Manifest } from '../lexicons/types/org/tangled/repo/manifest'
import type { Main as TicketRecord } from '../lexicons/types/org/tangled/track/ticket'

export type TangledRecord<TValue> = { cid?: Cid; uri: ResourceUri; value: TValue }
export type Repo = {
  uri: ResourceUri
  manifestUri: ResourceUri
  declarationUri: ResourceUri
  repoDid: Did
  ownerDid: Did
  name: string
  cid?: Cid
  knot?: string
  spindle?: string
  description?: string
  website?: string
  topics?: string[]
  createdAt: string
  git?: { defaultBranch?: string; isEmpty?: boolean }
}
export type RepoManifest = TangledRecord<Manifest>
export function getRepoDid(repo: Repo): Did {
  return repo.repoDid
}
export type Ticket = Omit<TicketRecord, 'title' | 'body'> & {
  title: string
  body?: string
  source?: { repo: Did; branch: string }
  markup: { title: TicketRecord['title']; body?: TicketRecord['body'] }
}
export type IssueRecord = TangledRecord<Ticket> & {
  author: Did
  state: string
  commentCount: number
}
export type PullRecord = IssueRecord
export type Issue = IssueRecord
export type Pull = PullRecord
export type RepoList = { items: Repo[]; cursor?: string }
export type IssueList = { items: Issue[]; cursor?: string }
export type PullList = { items: Pull[]; cursor?: string }
