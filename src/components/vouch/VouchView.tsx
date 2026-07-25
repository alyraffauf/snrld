import type { VouchRecord } from '../../lib/tangled/graph'

type VouchProps = {
  vouchRecord: VouchRecord
}

export function VouchView({ vouchRecord }: VouchProps) {
  const { value } = vouchRecord

  return (
    <>
      {value.reason && (
        <p className="mb-5 max-w-prose whitespace-pre-wrap text-base leading-relaxed text-ctp-subtext-1">
          {value.reason}
        </p>
      )}

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-ctp-overlay-1">Kind</dt>
          <dd>{value.kind ?? 'vouch'}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ctp-overlay-1">Created</dt>
          <dd>
            <time dateTime={value.createdAt}>{new Date(value.createdAt).toLocaleString()}</time>
          </dd>
        </div>
      </dl>
    </>
  )
}
