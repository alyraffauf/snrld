import type { StringRecord } from '../lib/tangled/index'

type StringProps = {
  string: StringRecord
}

export function StringView({ string }: StringProps) {
  const { value } = string

  return (
    <>
      {value.description && (
        <p className="mb-5 max-w-prose text-base leading-relaxed text-ctp-subtext-1">
          {value.description}
        </p>
      )}

      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words border border-ctp-surface-1 bg-ctp-mantle p-5 font-mono text-sm leading-relaxed text-ctp-text sm:p-6">
        <code>{value.contents}</code>
      </pre>
    </>
  )
}
