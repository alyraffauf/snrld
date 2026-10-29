import { ok } from '../response'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as issueListSchema } from '../lexicons/types/org/tangled/repo/listIssues'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { IssueList } from './types'
import { validateIssue } from './validators'

export type ListIssuesOptions = {
  cursor?: string
  limit?: number
  order?: 'asc' | 'desc'
  state?: 'open' | 'closed'
}

export async function listIssues(
  repoDid: Did,
  options: ListIssuesOptions = {},
): Promise<IssueList> {
  const response = await ok(
    rpc.get('org.tangled.repo.listIssues', {
      params: {
        subject: repoDid,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
        state: options.state,
      },
    }),
  )

  const listValidation = safeParse(issueListSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid issue list: ${listValidation.message}`)
  }

  const items = listValidation.value.items.map(validateIssue)

  return { items, cursor: listValidation.value.cursor }
}
