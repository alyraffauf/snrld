import type { Handle } from '@atcute/lexicons'
import { loadRepoRecordPage, type RepoRecordPageData } from './repoRecordPage'
import { getPull, type PullRecord } from './tangled/repo'

export type PullPageData = RepoRecordPageData<PullRecord>

export async function loadPullPage(
  repoOwnerHandle: Handle,
  repoKey: string,
  pullOwnerHandle: Handle,
  pullKey: string,
): Promise<PullPageData> {
  const page = await loadRepoRecordPage({
    collection: 'org.tangled.repo.pull',
    getRecord: getPull,
    recordKey: pullKey,
    recordOwnerHandle: pullOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })

  return page
}
