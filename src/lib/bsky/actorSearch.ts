import type {} from '@atcute/bluesky'
import { AppBskyActorSearchActorsTypeahead } from '@atcute/bluesky'
import { Client, ok, simpleFetchHandler } from '@atcute/client'
import { safeParse } from '@atcute/lexicons'

const TYPEAHEAD_URL = 'https://typeahead.waow.tech'

const typeahead = new Client({
  handler: simpleFetchHandler({ service: TYPEAHEAD_URL }),
})

export type BlueskyActorSearchResult = AppBskyActorSearchActorsTypeahead.$output['actors'][number]

export async function searchBlueskyActors(
  query: string,
  signal: AbortSignal,
): Promise<BlueskyActorSearchResult[]> {
  const response = await ok(
    typeahead.get('app.bsky.actor.searchActorsTypeahead', {
      signal,
      headers: { 'X-Client': 'snarled.at' },
      params: {
        q: query,
        limit: 8,
      },
    }),
  )

  const validation = safeParse(AppBskyActorSearchActorsTypeahead.mainSchema.output.schema, response)
  if (!validation.ok) {
    throw new Error(`Typeahead returned an invalid actor search response: ${validation.message}`)
  }

  return validation.value.actors
}
