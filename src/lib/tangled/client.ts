import { Client, simpleFetchHandler } from '@atcute/client'
import './lexicons'

export const BOBBIN_URL = import.meta.env?.VITE_TANGLED_API_URL || 'https://api.tangled.org'
export const rpc = new Client({
  handler: simpleFetchHandler({
    service: BOBBIN_URL,
    fetch: (...args) => globalThis.fetch(...args),
  }),
})
