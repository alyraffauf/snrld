import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import type { Main as TangledIssue } from '@atcute/tangled/types/repo/issue'
import { mainSchema as issueSchema } from '@atcute/tangled/types/repo/issue'
import type { $output as IssueListResponse } from '@atcute/tangled/types/repo/listIssues'
import { mainSchema as issueListSchema } from '@atcute/tangled/types/repo/listIssues'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'

export type Issue = Omit<IssueListResponse['items'][number], 'value'> & {
  value: TangledIssue
}

export type IssueList = {
  items: Issue[]
  cursor?: string
}

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
    rpc.get('sh.tangled.repo.listIssues', {
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

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(issueSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid issue record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}
