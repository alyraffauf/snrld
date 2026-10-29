import { ok } from '../response'
import type { ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as commentListSchema } from '../lexicons/types/org/tangled/feed/listComments'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { CommentList, ListCommentsOptions } from './types'

export async function listComments(
  subject: ResourceUri,
  options: ListCommentsOptions = {},
): Promise<CommentList> {
  const response = await ok(
    rpc.get('org.tangled.feed.listComments', {
      params: {
        subject,
        cursor: options.cursor,
        limit: options.limit,
        order: options.order,
      },
    }),
  )

  const listValidation = safeParse(commentListSchema.output.schema, removeNullCursor(response))
  if (!listValidation.ok) {
    throw new Error(`Bobbin returned an invalid comment list: ${listValidation.message}`)
  }

  return { items: listValidation.value.items, cursor: listValidation.value.cursor }
}
