import { ok } from '@atcute/client'
import type { ResourceUri } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { mainSchema as commentSchema } from '@atcute/tangled/types/feed/comment'
import { mainSchema as commentListSchema } from '@atcute/tangled/types/feed/listComments'
import { rpc } from '../client'
import { removeNullCursor } from '../utils'
import type { CommentList, ListCommentsOptions } from './types'

export async function listComments(
  subject: ResourceUri,
  options: ListCommentsOptions = {},
): Promise<CommentList> {
  const response = await ok(
    rpc.get('sh.tangled.feed.listComments', {
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

  const items = listValidation.value.items.map((item, index) => {
    const valueValidation = safeParse(commentSchema, item.value)
    if (!valueValidation.ok) {
      throw new Error(
        `Bobbin returned an invalid comment record at index ${index}: ${valueValidation.message}`,
      )
    }

    return { ...item, value: valueValidation.value }
  })

  return { items, cursor: listValidation.value.cursor }
}
