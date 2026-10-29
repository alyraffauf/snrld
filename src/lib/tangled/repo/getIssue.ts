import { ok, validate } from '../response'
import { mainSchema } from '../lexicons/types/org/tangled/track/getTicketView'
import type { ResourceUri } from '@atcute/lexicons'
import { rpc } from '../client'
import { validateIssue, normalizeTicketTitle } from './validators'
export async function getIssue(uri: ResourceUri) {
  const view = validate(
    mainSchema.output.schema,
    normalizeTicketTitle(await ok(rpc.get('org.tangled.track.getTicketView', { params: { uri } }))),
  )
  return validateIssue({
    uri: view.uri,
    cid: view.cid,
    author: view.author.did,
    state: view.state,
    value: {
      $type: 'org.tangled.track.ticket',
      title: view.title,
      body: view.body,
      state: view.state,
      targetBranch: view.targetBranch,
      createdAt: view.createdAt,
    },
  })
}
