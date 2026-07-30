import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { resolveActor, resolveMiniDoc, type ResolvedActor } from '../lib/actor'
import { useElementVisibility } from './useElementVisibility'

type ActorState = {
  actor?: ResolvedActor
  did: Did
  miniDoc?: ResolvedActor['miniDoc']
}

export function useVisibleActor(did: Did | null) {
  const { elementRef, isVisible } = useElementVisibility()
  const [state, setState] = useState<ActorState | null>(null)

  useEffect(() => {
    if (did === null || !isVisible) return

    let isCancelled = false

    void resolveMiniDoc(did)
      .then((miniDoc) => {
        if (!isCancelled) setState({ did, miniDoc })
      })
      .catch(() => {
        if (!isCancelled) setState({ did })
      })

    void resolveActor(did)
      .then((actor) => {
        if (!isCancelled) setState({ did, actor, miniDoc: actor.miniDoc })
      })
      .catch(() => undefined)

    return () => {
      isCancelled = true
    }
  }, [did, isVisible])

  return {
    actor: state?.did === did ? (state.actor ?? null) : null,
    miniDoc: state?.did === did ? (state.miniDoc ?? null) : null,
    elementRef,
    isVisible,
  }
}
