import { Client, simpleFetchHandler } from '@atcute/client'

export const BOBBIN_URL = 'https://api.tangled.org'

export const rpc = new Client({
  handler: simpleFetchHandler({ service: BOBBIN_URL }),
})

export function getKnotRpc(knot: string) {
  const service =
    knot.startsWith('http://') || knot.startsWith('https://') ? knot : `https://${knot}`

  return new Client({
    handler: simpleFetchHandler({ service }),
  })
}
