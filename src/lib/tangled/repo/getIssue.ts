import { ok } from '@atcute/client'
import type { ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import type { IssueRecord } from './types'
import { validateIssueRecord } from './validators'

export async function getIssue(issue: ResourceUri): Promise<IssueRecord> {
  const response = await ok(
    rpc.get('sh.tangled.repo.getIssue', {
      params: { issue },
    }),
  )

  return validateIssueRecord(response)
}
