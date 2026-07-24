import { Client, simpleFetchHandler } from '@atcute/client'

export const BOBBIN_URL = 'https://bobbin.klbr.net'

export const rpc = new Client({
  handler: simpleFetchHandler({ service: BOBBIN_URL }),
})
