import { Link } from 'react-router-dom'
import { parseResourceUri } from '@atcute/lexicons'
import type { StringRecord } from '../../lib/tangled'
import { SurfaceCard } from '../shared/SurfaceCard'

type StringListItemProps = {
  handle: string
  stringRecord: StringRecord
}

export function StringListItem({ handle, stringRecord }: StringListItemProps) {
  const { value } = stringRecord
  const { rkey } = parseResourceUri(stringRecord.uri)

  if (rkey === undefined) {
    throw new Error(`String record URI has no rkey: ${stringRecord.uri}`)
  }

  return (
    <Link to={`/strings/${handle}/${encodeURIComponent(rkey)}`} className="block">
      <SurfaceCard
        as="article"
        className="group h-full p-4 transition-colors hover:border-ctp-lavender"
      >
        <h3 className="truncate font-mono text-base font-semibold text-ctp-text">
          {value.filename}
        </h3>

        {value.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-ctp-subtext-1">
            {value.description}
          </p>
        )}

        <p className="mt-3 line-clamp-4 whitespace-pre-wrap font-mono text-sm leading-snug text-ctp-overlay-1">
          {value.contents}
        </p>
      </SurfaceCard>
    </Link>
  )
}
