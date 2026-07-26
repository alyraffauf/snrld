import type { Handle, ResourceUri } from '@atcute/lexicons'
import { resolveActor, resolveMiniDoc, type ResolvedActor } from './actor'
import { getRepo, type Repo, type TangledRecord } from './tangled/repo'

type RecordLoader<TRecord> = (uri: ResourceUri) => Promise<TRecord>

export type RepoRecordPageData<TRecord> = {
  record: TRecord
  recordAuthor: ResolvedActor
  repo: Repo
  repositoryOwner: ResolvedActor
}

type LoadRepoRecordPageOptions<TRecord extends TangledRecord<unknown>> = {
  collection: string
  getRecord: RecordLoader<TRecord>
  recordKey: string
  recordOwnerHandle: Handle
  repoKey: string
  repoOwnerHandle: Handle
}

export async function loadRepoRecordPage<TRecord extends TangledRecord<unknown>>({
  collection,
  getRecord,
  recordKey,
  recordOwnerHandle,
  repoKey,
  repoOwnerHandle,
}: LoadRepoRecordPageOptions<TRecord>): Promise<RepoRecordPageData<TRecord>> {
  const repoIdentity = await resolveMiniDoc(repoOwnerHandle)
  const recordIdentity =
    repoOwnerHandle === recordOwnerHandle ? repoIdentity : await resolveMiniDoc(recordOwnerHandle)
  const repoUri = `at://${repoIdentity.did}/sh.tangled.repo/${repoKey}` as ResourceUri
  const recordUri = `at://${recordIdentity.did}/${collection}/${recordKey}` as ResourceUri
  const [owner, author, repo, record] = await Promise.all([
    resolveActor(repoIdentity.did),
    resolveActor(recordIdentity.did),
    getRepo(repoUri),
    getRecord(recordUri),
  ])

  return { record, recordAuthor: author, repo, repositoryOwner: owner }
}
