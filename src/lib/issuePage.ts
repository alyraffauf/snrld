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
    collection: 'org.tangled.repo.issue',
    getRecord: getIssue,
    recordKey: issueKey,
    recordOwnerHandle: issueOwnerHandle,
    repoKey,
    repoOwnerHandle,
  })

  return page
}
