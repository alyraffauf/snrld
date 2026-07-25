import type { VouchRecord } from '../../lib/tangled/graph'
import { useResolvedVouches } from '../../hooks/useResolvedVouches'
import { VouchListItem } from './VouchListItem'

type VouchListProps = {
  vouches: VouchRecord[]
}

export function VouchList({ vouches }: VouchListProps) {
  const { resolvedVouches, isLoading } = useResolvedVouches(vouches)

  if (isLoading) {
    return <p>Loading vouches...</p>
  }

  if (resolvedVouches.length === 0) {
    return <p>Vouches could not be resolved.</p>
  }

  return (
    <div className="space-y-3">
      {resolvedVouches.map(({ vouch, author }) => (
        <VouchListItem key={vouch.uri} vouchRecord={vouch} author={author} />
      ))}
    </div>
  )
}
