import type { VouchRecord } from '../../lib/tangled/graph'
import { VouchListItem } from './VouchListItem'

type VouchListProps = {
  vouches: VouchRecord[]
}

export function VouchList({ vouches }: VouchListProps) {
  return (
    <div className="space-y-3">
      {vouches.map((vouch) => (
        <VouchListItem key={vouch.uri} vouchRecord={vouch} />
      ))}
    </div>
  )
}
