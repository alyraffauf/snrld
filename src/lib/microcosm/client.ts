import { Client, simpleFetchHandler } from '@atcute/client'

export const slingshot = new Client({
  handler: simpleFetchHandler({ service: 'https://slingshot.microcosm.blue' }),
})
