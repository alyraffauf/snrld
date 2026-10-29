import { parseResourceUri } from '@atcute/lexicons'
import { resolveMiniDoc } from '../../actor'
import type { StringRecord } from './types'
export async function loadStringContent(record: StringRecord): Promise<string> {
  const did = parseResourceUri(record.uri).repo
  const { pds } = await resolveMiniDoc(did)
  const blob = record.value.snippet.content
  const cid = 'ref' in blob ? blob.ref.$link : blob.cid
  const url = new URL('/xrpc/com.atproto.sync.getBlob', pds)
  url.search = new URLSearchParams({ did, cid }).toString()
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load string contents: ${response.status}`)
  return response.text()
}
