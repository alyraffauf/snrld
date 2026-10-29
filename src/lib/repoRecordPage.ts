import type { Handle, ResourceUri } from '@atcute/lexicons'
import { resolveActor, type ResolvedActor } from './actor'
import { loadRepoPage } from './repoPage'
import type { Repo, IssueRecord } from './tangled/repo'
export type RepoRecordPageData<TRecord> = {
  record: TRecord
  recordAuthor: ResolvedActor
  repo: Repo
  repositoryOwner: ResolvedActor
}
export async function loadRepoRecordPage<TRecord extends IssueRecord>({
  getRecord,
  recordKey,
  repoKey,
  repoOwnerHandle,
}: {
  collection: string
  getRecord: (uri: ResourceUri) => Promise<TRecord>
  recordKey: string
  recordOwnerHandle: Handle
  repoKey: string
  repoOwnerHandle: Handle
}): Promise<RepoRecordPageData<TRecord>> {
  const { repo, actor } = await loadRepoPage(repoOwnerHandle, repoKey)
  const record = await getRecord(`at://${repo.repoDid}/org.tangled.track.ticket/${recordKey}`)
  const recordAuthor = await resolveActor(record.author)
  return { record, recordAuthor, repo, repositoryOwner: actor }
}
