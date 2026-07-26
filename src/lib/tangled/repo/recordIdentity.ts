import type { ResourceUri } from '@atcute/lexicons'
import { parseResourceUri } from '@atcute/lexicons'

export function getRecordRkey(uri: ResourceUri): string {
  const { rkey } = parseResourceUri(uri)
  if (rkey === undefined) {
    throw new Error(`Record URI has no record key: ${uri}`)
  }

  return rkey
}
