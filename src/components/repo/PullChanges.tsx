import type { Blob, Did, LegacyBlob } from '@atcute/lexicons'
import type { Main as Pull } from '@atcute/tangled/types/repo/pull'
import { useCallback } from 'react'
import { useDeferredResource } from '../../hooks/useDeferredResource'
import { SurfaceCard } from '../shared/SurfaceCard'

type PullChangesProps = {
  isActive: boolean
  pull: Pull
  pullAuthorDid: Did
  pullAuthorPds: string
}

export function PullChanges({ isActive, pull, pullAuthorDid, pullAuthorPds }: PullChangesProps) {
  const latestRound = pull.rounds.at(-1)
  const patchCid = latestRound === undefined ? null : getBlobCid(latestRound.patchBlob)
  const loadLatestPatch = useCallback(
    () => loadPatch(pullAuthorPds, pullAuthorDid, patchCid),
    [patchCid, pullAuthorDid, pullAuthorPds],
  )
  const { data: patch, error } = useDeferredResource(
    isActive ? patchCid : null,
    isActive && latestRound !== undefined,
    loadLatestPatch,
  )

  if (latestRound === undefined) {
    return <p className="text-sm text-ctp-subtext-0">This pull request has no changes yet.</p>
  }

  if (error) return <p role="alert">Could not load changes: {error.message}</p>
  if (patch === null) return <p>Loading changes...</p>

  return (
    <SurfaceCard as="section" className="overflow-hidden" aria-label="Changes">
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-5 text-ctp-subtext-1">
        {patch}
      </pre>
    </SurfaceCard>
  )
}

function getBlobCid(blob: Blob | LegacyBlob): string {
  return 'ref' in blob ? blob.ref.$link : blob.cid
}

async function loadPatch(pds: string, did: Did, cid: string | null): Promise<string> {
  if (cid === null) throw new Error('The latest pull request round has no patch')
  const patchUrl = new URL('/xrpc/com.atproto.sync.getBlob', pds)
  patchUrl.searchParams.set('did', did)
  patchUrl.searchParams.set('cid', cid)
  const response = await fetch(patchUrl)
  if (!response.ok) throw new Error(`Could not fetch patch: ${response.status}`)
  if (response.body === null) throw new Error('Patch response had no body')

  return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).text()
}
