import { ok } from '../response'
import type { Did } from '@atcute/lexicons'
import { validateString } from './validators'
import { rpc } from '../client'
import type { StringRecord } from './types'

export async function getString(did: Did, rkey: string): Promise<StringRecord> {
  const response = await ok(
    rpc.get('org.tangled.string.getString', {
      params: { uri: `at://${did}/org.tangled.snippet.string/${rkey}` },
    }),
  )

  return { ...response, value: validateString(response.value) }
}
