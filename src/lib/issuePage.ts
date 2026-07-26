import type { Handle } from '@atcute/lexicons'
import { loadRepoRecordPage, type RepoRecordPageData } from './repoRecordPage'
import { getIssue, type IssueRecord } from './tangled/repo'

export type IssuePageData = RepoRecordPageData<IssueRecord>

export async function loadIssuePage(
  repoOwnerHandle: Handle,
  repoKey: string,
  issueOwnerHandle: Handle,
  issueKey: string,
): Promise<IssuePageData> {
  const page = await loadRepoRecordPage({
    collection: 'sh.tangled.repo.issue',
    getRecord: getIssue,
    recordKey: issueKey,
    recordOwnerHandle: issueOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })

  if (page.repo.value.repoDid !== page.record.value.repo) {
    throw new Error('Issue does not belong to this repository')
  }

  return page
}
