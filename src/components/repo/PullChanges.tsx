import type { Did, ResourceUri } from '@atcute/lexicons'
import { useCallback } from 'react'
import { useDeferredResource } from '../../hooks/useDeferredResource'
import { getLatestPatch } from '../../lib/tangled/repo/patches'
import { SurfaceCard } from '../shared/SurfaceCard'
export function PullChanges({
  isActive,
  pullUri,
  repoDid,
}: {
  isActive: boolean
  pullUri: ResourceUri
  repoDid: Did
}) {
  const load = useCallback(
    async () => ({ patch: await getLatestPatch(repoDid, pullUri) }),
    [repoDid, pullUri],
  )
  const { data, error } = useDeferredResource(pullUri, isActive, load)
  if (error) return <p role="alert">Could not load changes: {error.message}</p>
  if (!data) return <p>Loading changes...</p>
  if (data.patch === null) return <p>This pull request has no changes yet.</p>
  return (
    <SurfaceCard as="section" aria-label="Changes">
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-5">{data.patch}</pre>
    </SurfaceCard>
  )
}
