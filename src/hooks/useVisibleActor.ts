import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { resolveActor, type ResolvedActor } from '../lib/actor'
import { useElementVisibility } from './useElementVisibility'

type ActorState = {
  actor?: ResolvedActor
  did: Did
}

export function useVisibleActor(did: Did | null) {
  const { elementRef, isVisible } = useElementVisibility()
  const [state, setState] = useState<ActorState | null>(null)

  useEffect(() => {
    if (did === null || !isVisible) return

    let isCancelled = false

    void resolveActor(did)
      .then((actor) => {
        if (!isCancelled) setState({ did, actor })
      })
      .catch(() => {
        if (!isCancelled) setState({ did })
      })

    return () => {
      isCancelled = true
    }
  }, [did, isVisible])

  return {
    actor: state?.did === did ? (state.actor ?? null) : null,
    elementRef,
    isVisible,
  }
}
