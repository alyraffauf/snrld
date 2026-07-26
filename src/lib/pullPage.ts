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
    collection: 'sh.tangled.repo.pull',
    getRecord: getPull,
    recordKey: pullKey,
    recordOwnerHandle: pullOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })

  if (page.repo.value.repoDid !== page.record.value.target.repo) {
    throw new Error('Pull request does not belong to this repository')
  }

  return page
}
