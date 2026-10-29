import { getLatestPatchRecord } from './patches'
import type { ResourceUri } from '@atcute/lexicons'
import { getIssue } from './getIssue'
export async function getPull(uri: ResourceUri) {
  const [ticket, patch] = await Promise.all([getIssue(uri), getLatestPatchRecord(uri)])
  return {
    ...ticket,
    value: { ...ticket.value, source: patch?.source },
    state: ticket.state === 'completed' ? 'merged' : ticket.state,
  }
}
