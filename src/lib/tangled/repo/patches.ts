import { ok, validate } from '../response'
import { mainSchema } from '../lexicons/types/org/tangled/temp/review/listPatches'
import { safeParse, type ResourceUri, type Did } from '@atcute/lexicons'
import { rpc } from '../client'
import { mainSchema as patchSchema } from '../lexicons/types/org/tangled/review/patch'
import { formatPatch } from '../git'
export async function getLatestPatchRecord(ticket: ResourceUri) {
  const response = validate(
    mainSchema.output.schema,
    await ok(
      rpc.get('org.tangled.temp.review.listPatches', {
        params: { ticket, order: 'desc', limit: 1 },
      }),
    ),
  )
  const item = response.items[0]
  if (!item) return null
  const parsed = safeParse(patchSchema, item.value)
  if (!parsed.ok) throw new Error(`Invalid patch: ${parsed.message}`)
  return parsed.value
}

export async function getLatestPatch(repo: Did, ticket: ResourceUri): Promise<string | null> {
  const patch = await getLatestPatchRecord(ticket)
  return patch ? formatPatch(repo, patch.base.oid, patch.head.oid) : null
}
