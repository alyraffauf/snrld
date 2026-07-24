import type { Blob as AtprotoBlob, Did, LegacyBlob } from '@atcute/lexicons'

type AvatarBlob = AtprotoBlob | LegacyBlob

const DEFAULT_CDN = 'https://cdn.bsky.app'

export function getAvatarUrl(did: Did, avatar: AvatarBlob, cdn = DEFAULT_CDN): string {
  const cid = 'ref' in avatar ? avatar.ref.$link : avatar.cid

  return `${cdn}/img/avatar/plain/${did}/${cid}@jpeg`
}
