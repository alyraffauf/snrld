import { ok } from '@atcute/client'
import type { Did } from '@atcute/lexicons'
import { safeParse } from '@atcute/lexicons'
import { ShTangledString } from '@atcute/tangled'
import { slingshot } from '../../microcosm'
import type { StringRecord } from './types'

export async function getString(did: Did, rkey: string): Promise<StringRecord> {
  const response = await ok(
    slingshot.get('com.atproto.repo.getRecord', {
      params: {
        repo: did,
        collection: 'sh.tangled.string',
        rkey,
      },
    }),
  )

  const validation = safeParse(ShTangledString.mainSchema, response.value)
  if (!validation.ok) {
    throw new Error(`Slingshot returned an invalid string record: ${validation.message}`)
  }

  return { ...response, value: validation.value }
}
