import type { Cid, Did, ResourceUri } from '@atcute/lexicons'
import type { Main as TangledRepo } from '@atcute/tangled/types/repo'
import type { Main as TangledIssue } from '@atcute/tangled/types/repo/issue'
import type { $output as IssueListResponse } from '@atcute/tangled/types/repo/listIssues'
import type { Main as TangledPull } from '@atcute/tangled/types/repo/pull'
import type { $output as PullListResponse } from '@atcute/tangled/types/repo/listPulls'

export type TangledRecord<TValue> = {
  cid?: Cid
  uri: ResourceUri
  value: TValue
}

export type Repo = TangledRecord<TangledRepo>

export function getRepoDid(repo: Repo): Did {
  const repoDid = repo.value.repoDid
  if (repoDid === undefined) {
    throw new Error(`Repository ${repo.uri} does not have a repository DID`)
  }

  return repoDid
}

export type IssueRecord = TangledRecord<TangledIssue>

export type Issue = Omit<IssueListResponse['items'][number], 'value'> & {
  value: TangledIssue
}

export type PullRecord = TangledRecord<TangledPull>

export type Pull = Omit<PullListResponse['items'][number], 'value'> & {
  value: TangledPull
}

export type RepoList = {
  items: Repo[]
  cursor?: string
}

export type IssueList = {
  items: Issue[]
  cursor?: string
}

export type PullList = {
  items: Pull[]
  cursor?: string
}
