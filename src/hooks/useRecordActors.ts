import { parseResourceUri, type Did, type ResourceUri } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { useEffect, useMemo, useState } from 'react'
import { resolveActor, type ResolvedActor } from '../lib/actor'

const MAX_CONCURRENT_ACTOR_REQUESTS = 3

type RecordWithUri = {
  uri: ResourceUri
}

type ActorsState = {
  actors: Map<Did, ResolvedActor>
  error: Error | null
  key: string
}

export function useRecordActors(records: readonly RecordWithUri[]) {
  const actorDids = useMemo(
    () =>
      [...new Set(records.map(({ uri }) => parseResourceUri(uri).repo))].flatMap((identifier) =>
        isDid(identifier) ? [identifier] : [],
      ),
    [records],
  )
  const actorsKey = [...actorDids].sort().join(',')
  const [state, setState] = useState<ActorsState | null>(null)

  useEffect(() => {
    let isCancelled = false

    void resolveActors(actorDids).then(({ actors, hasFailures }) => {
      if (isCancelled) return

      setState({
        actors,
        error: hasFailures ? new Error('Some record authors could not be resolved') : null,
        key: actorsKey,
      })
    })

    return () => {
      isCancelled = true
    }
  }, [actorDids, actorsKey])

  const isCurrentList = state?.key === actorsKey
  return {
    actors: isCurrentList ? (state.actors ?? null) : null,
    error: isCurrentList ? (state.error ?? null) : null,
  }
}

async function resolveActors(actorDids: Did[]) {
  const actors = new Map<Did, ResolvedActor>()
  let hasFailures = false
  let nextActorIndex = 0
  const workerCount = Math.min(MAX_CONCURRENT_ACTOR_REQUESTS, actorDids.length)

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextActorIndex < actorDids.length) {
        const actorDid = actorDids[nextActorIndex]
        nextActorIndex += 1

        try {
          actors.set(actorDid, await resolveActor(actorDid))
        } catch {
          hasFailures = true
        }
      }
    }),
  )

  return { actors, hasFailures }
}
